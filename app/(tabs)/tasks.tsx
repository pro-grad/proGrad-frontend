// app/(tabs)/tasks.tsx

import { useRouter } from 'expo-router'
import { ChevronDown, ChevronRight, Settings } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  initialFieldsData,
  initialNotesData,
  initialStreaksData,
  Note,
  ProField,
  questionLevels,
  Streak,
} from '../../lib/data'

const initialFields: ProField[] = initialFieldsData

type QuestionStatus = 'unanswered' | 'correct' | 'incorrect'
type QuestionState = {
  userAnswer: string
  submitted: boolean
  revealed: boolean
  status: QuestionStatus
}

type TopicTab = 'questions' | 'notes'

const EMPTY_QUESTION_STATE: QuestionState = {
  userAnswer: '',
  submitted: false,
  revealed: false,
  status: 'unanswered',
}

const DURATION_OPTIONS = [15, 30, 45, 60, 90]

function streaksById(streaks: Streak[]): Record<string, Streak> {
  return Object.fromEntries(streaks.map((s) => [s.topicId, s]))
}

// ---------- Helpers ----------

function formatDate(date: string) {
  const d = new Date(`${date}T00:00:00`)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function daysUntil(date: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(`${date}T00:00:00`)
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function addDaysISO(days: number) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function levelName(levelId: string | undefined) {
  return questionLevels.find((l) => l.id === levelId)?.name ?? 'Not set'
}

// Picks a level "as if the AI decided" — dummy random assignment until the
// real backend actually grades/assesses the person and picks one.
function randomLevelId() {
  const idx = Math.floor(Math.random() * questionLevels.length)
  return questionLevels[idx].id
}

// Not wired up yet — there's no backend that can actually grade a free-text
// answer against the stored answer key. Once that exists, this is where
// we'd call it, something like:
//
//   const result = await api.post('/grade-answer', { userAnswer, correctAnswer })
//   return result.isCorrect  // true | false | 'partial'
//
// For now grading is manual — the person marks themselves right/wrong with
// the buttons below after comparing their answer to the revealed one.
function checkAnswerAgainstKey(userAnswer: string, correctAnswer: string): boolean | null {
  return null
}

// ---------- Component ----------

function tasks() {
  const [fieldsData, setFieldsData] = useState<ProField[]>(initialFields)
  const [searchInput, setSearchInput] = useState('')
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)

  const [hideFields, setHideFields] = useState(false)
  const [hideActiveTasks, setHideActiveTasks] = useState(false)

  // TODO: dummy user later connected to superbase
  const user = {
    userName: 'dave',
    userId: 'dave-001',
    email: 'testNumber@gmail.com',
  }

  const router = useRouter()

  // Streaks live in their own map, keyed by topicId — mirrors the separate
  // `streak` table (streakId pk, topicId/userId/levelId fks). A topic can
  // have zero or one active streak.
  const [streaks, setStreaks] = useState<Record<string, Streak>>(() =>
    streaksById(initialStreaksData)
  )

  // Notes are dummy/empty for now — kept as state so a real fetch can slot
  // in later without changing the render logic.
  const [notes] = useState<Note[]>(initialNotesData)

  // Draft values for the streak setup/edit form on the topic screen.
  const [draftCompletionDate, setDraftCompletionDate] = useState('')
  const [draftDurationDays, setDraftDurationDays] = useState<number | null>(null)
  const [draftDailyGoalInput, setDraftDailyGoalInput] = useState('')
  // Whether the streak form is open. Starts open automatically when a
  // topic has no streak yet (nothing to hide), and closed/collapsed when
  // one already exists — reopened via the gear icon.
  const [streakEditing, setStreakEditing] = useState(false)

  const [activeQuestionCount, setActiveQuestionCount] = useState(0)

  // Questions vs Notes tab on the topic screen.
  const [activeTab, setActiveTab] = useState<TopicTab>('questions')

  // Quiz progress for whichever topic is currently open. Resets whenever a
  // new topic opens, "Refresh questions" is tapped, or the streak's
  // date/goal changes.
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({})

  // "Need more info? Ask AI" selection mode
  const [askAiMode, setAskAiMode] = useState(false)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Record<string, boolean>>({})

  const filteredFields = fieldsData.filter((field) =>
    field.name.toLowerCase().includes(searchInput.toLowerCase())
  )

  const selectedField = fieldsData.find((field) => field.id === selectedFieldId) ?? null
  const selectedTopic =
    selectedField?.topics.find((topic) => topic.id === selectedTopicId) ?? null
  const currentStreak = selectedTopic ? streaks[selectedTopic.id] ?? null : null
  const topicNotes = selectedTopic ? notes.filter((n) => n.topicId === selectedTopic.id) : []

  // Topics that currently have an active streak.
  const streakingTopics = fieldsData
    .flatMap((field) =>
      field.topics
        .filter((topic) => streaks[topic.id])
        .map((topic) => ({ ...topic, fieldName: field.name, fieldId: field.id, streak: streaks[topic.id] }))
    )
    .sort((a, b) => (a.streak.completionDate < b.streak.completionDate ? -1 : 1))

  // Reset quiz progress, tab, ask-AI selection, and the streak draft form
  // every time a different topic opens.
  useEffect(() => {
    setQuestionStates({})
    setAskAiMode(false)
    setSelectedQuestionIds({})
    setActiveTab('questions')
    setDraftDurationDays(null)

    const streak = selectedTopic ? streaks[selectedTopic.id] : undefined
    const total = selectedTopic?.questions.length ?? 0

    if (streak) {
      setDraftCompletionDate(streak.completionDate)
      setDraftDailyGoalInput(String(streak.dailyGoalQuestions))
      setActiveQuestionCount(Math.min(streak.dailyGoalQuestions, total))
      setStreakEditing(false) // collapsed — nothing to hide yet if there's no streak
    } else {
      setDraftCompletionDate('')
      setDraftDailyGoalInput('')
      setActiveQuestionCount(total)
      setStreakEditing(true) // no streak yet, so the setup form is what shows
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopicId])

  function updateUserAnswer(questionId: string, text: string) {
    setQuestionStates((prev) => ({
      ...prev,
      [questionId]: { ...(prev[questionId] ?? EMPTY_QUESTION_STATE), userAnswer: text },
    }))
  }

  function submitAnswer(questionId: string, correctAnswer: string) {
    const typed = questionStates[questionId]?.userAnswer ?? ''
    checkAnswerAgainstKey(typed, correctAnswer) // see note above — not wired up yet

    setQuestionStates((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] ?? EMPTY_QUESTION_STATE),
        userAnswer: typed,
        submitted: true,
        revealed: true,
      },
    }))
  }

  function dontKnowAnswer(questionId: string) {
    setQuestionStates((prev) => ({
      ...prev,
      [questionId]: { ...(prev[questionId] ?? EMPTY_QUESTION_STATE), submitted: false, revealed: true },
    }))
  }

  function markAnswer(questionId: string, status: 'correct' | 'incorrect') {
    setQuestionStates((prev) => ({
      ...prev,
      [questionId]: { ...(prev[questionId] ?? EMPTY_QUESTION_STATE), revealed: true, status },
    }))
  }

  function resetQuiz() {
    setQuestionStates({})
  }

  function generateNewQuestions() {
    Alert.alert(
      'Coming soon',
      'AI-generated questions for this topic will show up here once the backend is connected. For now, use Refresh to answer the existing questions again.'
    )
  }

  function askAiAboutQuestion(questionText: string) {
    router.push({
      pathname: '/chat',
      params: { prefill: `Can you go deeper on this: "${questionText}"?` },
    })
  }

  function toggleAskAiMode() {
    setAskAiMode((prev) => !prev)
    setSelectedQuestionIds({})
  }

  function toggleQuestionSelected(questionId: string) {
    setSelectedQuestionIds((prev) => ({ ...prev, [questionId]: !prev[questionId] }))
  }

  function askAiAboutSelectedQuestions() {
    if (!selectedTopic) return
    const selected = selectedTopic.questions.filter((q) => selectedQuestionIds[q.id])
    if (selected.length === 0) return
    const combined = selected.map((q) => `- ${q.question}`).join('\n')
    router.push({
      pathname: '/chat',
      params: { prefill: `Can you help me with these questions?\n${combined}` },
    })
    setAskAiMode(false)
    setSelectedQuestionIds({})
  }

  // ---------- Streak actions ----------

  function selectDuration(days: number) {
    setDraftDurationDays(days)
    setDraftCompletionDate(addDaysISO(days)) // stored as a date from here on, never as a day count
  }

  // Only creates/updates once both fields are filled AND this is pressed.
  // If the date or daily goal actually changed from what's stored, the
  // streak's progress resets. Level is assigned once (by "the AI") when a
  // streak is first created, and carried forward on edits.
  function confirmStreak() {
    if (!selectedTopic) return
    const trimmedDate = draftCompletionDate.trim()
    const parsedGoal = parseInt(draftDailyGoalInput, 10)
    if (!trimmedDate || isNaN(parsedGoal) || parsedGoal <= 0) return

    const existing = streaks[selectedTopic.id]
    const changed =
      !existing ||
      existing.completionDate !== trimmedDate ||
      existing.dailyGoalQuestions !== parsedGoal

    setStreaks((prev) => ({
      ...prev,
      [selectedTopic.id]: {
        id: existing?.id ?? `streak-${selectedTopic.id}`,
        topicId: selectedTopic.id,
        userId: user.userId,
        dailyGoalQuestions: parsedGoal,
        completionDate: trimmedDate,
        levelId: existing ? existing.levelId : randomLevelId(),
        createdAt: existing && !changed ? existing.createdAt : todayISO(),
      },
    }))

    if (changed) {
      setActiveQuestionCount(Math.min(parsedGoal, selectedTopic.questions.length))
      setQuestionStates({}) // reset progress — the date or goal actually moved
    }
    setDraftDurationDays(null)
    setStreakEditing(false)
  }

  function cancelStreakEdit() {
    if (!currentStreak) return
    setDraftCompletionDate(currentStreak.completionDate)
    setDraftDailyGoalInput(String(currentStreak.dailyGoalQuestions))
    setDraftDurationDays(null)
    setStreakEditing(false)
  }

  function dropStreak() {
    if (!selectedTopic) return
    Alert.alert(
      'Drop this streak?',
      'This clears your lock-in date, daily goal, and level for this topic, and resets your progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Drop streak',
          style: 'destructive',
          onPress: () => {
            setStreaks((prev) => {
              const next = { ...prev }
              delete next[selectedTopic.id]
              return next
            })
            setDraftCompletionDate('')
            setDraftDailyGoalInput('')
            setDraftDurationDays(null)
            setActiveQuestionCount(selectedTopic.questions.length)
            setQuestionStates({})
            setStreakEditing(true)
          },
        },
      ]
    )
  }

  // ---------- Topic quiz view (full screen) ----------

  if (selectedTopic && selectedField) {
    const questionsToShow = selectedTopic.questions.slice(0, activeQuestionCount)
    const answeredCount = questionsToShow.filter(
      (q) => questionStates[q.id] && questionStates[q.id].status !== 'unanswered'
    ).length
    const selectedCount = Object.values(selectedQuestionIds).filter(Boolean).length
    const lockInDays = currentStreak ? daysUntil(currentStreak.completionDate) : null
    const canConfirmStreak = draftCompletionDate.trim() !== '' && parseInt(draftDailyGoalInput, 10) > 0

    return (
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => setSelectedTopicId(null)} style={styles.backRow}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backLabel}>Back to {selectedField.name}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{selectedTopic.topicName}</Text>
          {selectedTopic.description ? (
            <Text style={styles.topicDescription}>{selectedTopic.description}</Text>
          ) : null}
         

          {/* Daily goal + AI-assigned level */}
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Text style={styles.statChipLabel}>Level:</Text>
              <Text style={styles.statChipValue}>
                {currentStreak ? levelName(currentStreak.levelId) : 'Not set'}
              </Text>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statChipLabel}>Daily goal:</Text>
              <Text style={styles.statChipValue}>
                {currentStreak ? `${answeredCount}/${currentStreak.dailyGoalQuestions}` : 'Not set'}
              </Text>
            </View>
          </View>

          {/* Streak card — collapsed summary, edit form, or setup form */}
          {currentStreak && !streakEditing ? (
            <View style={styles.card}>
              <View style={styles.streakHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.streakActiveLabel}>🔥 Streak active</Text>
                  <Text style={styles.topicMeta}>
                    Locked in until {formatDate(currentStreak.completionDate)}
                    {lockInDays !== null &&
                      (lockInDays >= 0
                        ? `  ·  ${lockInDays} day${lockInDays === 1 ? '' : 's'} left`
                        : '  ·  overdue')}
                  </Text>
                  <Text style={styles.topicMetaMuted}>
                    {currentStreak.dailyGoalQuestions} question
                    {currentStreak.dailyGoalQuestions === 1 ? '' : 's'}/day · {levelName(currentStreak.levelId)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setStreakEditing(true)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Settings size={20} color={TEXT_SECONDARY} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.questionsLabel}>
                {currentStreak ? 'Update your streak' : 'Start a streak for this topic'}
              </Text>
              <Text style={[styles.topicMetaMuted, { marginBottom: 12 }]}>
                {currentStreak
                  ? 'Changing the date or daily goal resets your progress on this streak.'
                  : 'Pick how long you want to be locked in and a daily goal, then confirm to start your streak.'}
              </Text>

              <Text style={[styles.questionsLabel, { marginBottom: 6 }]}>
                How long do you want to be locked into this topic?
              </Text>
              <View style={styles.optionRow}>
                {DURATION_OPTIONS.map((days) => {
                  const active = draftDurationDays === days
                  return (
                    <TouchableOpacity
                      key={days}
                      style={[styles.optionPill, active && styles.optionPillActive]}
                      onPress={() => selectDuration(days)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.optionPillText, active && styles.optionPillTextActive]}>
                        {days} days
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
              {draftCompletionDate ? (
                <Text style={[styles.topicMetaMuted, { marginTop: 8 }]}>
                  Locks in until {formatDate(draftCompletionDate)}
                </Text>
              ) : (
                <Text style={[styles.topicMetaMuted, { marginTop: 8 }]}>No duration picked yet</Text>
              )}

              <Text style={[styles.questionsLabel, { marginTop: 16, marginBottom: 6 }]}>
                What's your daily goal for how many questions you want to answer per day?
              </Text>
              <TextInput
                placeholder="e.g. 3"
                placeholderTextColor="#6B6B6B"
                value={draftDailyGoalInput}
                onChangeText={setDraftDailyGoalInput}
                keyboardType="number-pad"
                style={styles.inlineInput}
              />
              <Text style={[styles.topicMetaMuted, { marginTop: 8 }]}>
                {selectedTopic.questions.length} question
                {selectedTopic.questions.length === 1 ? '' : 's'} available right now — once the
                backend's connected this can pull from a much bigger bank.
              </Text>

              <View style={[styles.inlineRow, { marginTop: 16 }]}>
                {currentStreak && (
                  <TouchableOpacity style={styles.smallButtonGhost} onPress={cancelStreakEdit}>
                    <Text style={styles.smallButtonGhostText}>Cancel</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.smallButton, !canConfirmStreak && styles.smallButtonDisabled]}
                  onPress={confirmStreak}
                  disabled={!canConfirmStreak}
                >
                  <Text
                    style={[
                      styles.smallButtonText,
                      !canConfirmStreak && styles.smallButtonTextDisabled,
                    ]}
                  >
                    {currentStreak ? 'Save changes' : 'Start streak'}
                  </Text>
                </TouchableOpacity>
              </View>

              {currentStreak && (
                <TouchableOpacity style={styles.dropButton} onPress={dropStreak}>
                  <Text style={styles.dropButtonText}>Drop this streak</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {!askAiMode && (
            <TouchableOpacity style={styles.askAiCard} onPress={toggleAskAiMode} activeOpacity={0.8}>
              <Text style={styles.askAiText}>💬 Need more info? Ask AI</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          )}

          {!askAiMode && (
            <View style={[styles.inlineRow, { marginTop: 16 }]}>
              <TouchableOpacity style={styles.smallButtonGhost} onPress={resetQuiz}>
                <Text style={styles.smallButtonGhostText}>↻ Refresh questions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallButtonGhost} onPress={generateNewQuestions}>
                <Text style={styles.smallButtonGhostText}>✨ New questions</Text>
              </TouchableOpacity>
            </View>
          )}

          {askAiMode ? (
            <>
              <Text style={styles.sectionHeading}>Select questions to ask AI</Text>
              {questionsToShow.length === 0 && (
                <Text style={styles.emptyText}>No questions yet for this topic.</Text>
              )}
              {questionsToShow.map((q) => {
                const checked = !!selectedQuestionIds[q.id]
                return (
                  <TouchableOpacity
                    key={q.id}
                    style={styles.checkboxRow}
                    onPress={() => toggleQuestionSelected(q.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                      {checked && <Text style={styles.checkboxMark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>{q.question}</Text>
                  </TouchableOpacity>
                )
              })}
              <View style={[styles.inlineRow, { marginTop: 16 }]}>
                <TouchableOpacity style={styles.smallButtonGhost} onPress={toggleAskAiMode}>
                  <Text style={styles.smallButtonGhostText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.smallButton, selectedCount === 0 && styles.smallButtonDisabled]}
                  onPress={askAiAboutSelectedQuestions}
                  disabled={selectedCount === 0}
                >
                  <Text
                    style={[
                      styles.smallButtonText,
                      selectedCount === 0 && styles.smallButtonTextDisabled,
                    ]}
                  >
                    Ask AI{selectedCount > 0 ? ` (${selectedCount})` : ''}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Questions / Notes tab switch */}
              <View style={styles.tabRow}>
                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 'questions' && styles.tabButtonActive]}
                  onPress={() => setActiveTab('questions')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.tabButtonText, activeTab === 'questions' && styles.tabButtonTextActive]}
                  >
                    Questions ({questionsToShow.length})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 'notes' && styles.tabButtonActive]}
                  onPress={() => setActiveTab('notes')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabButtonText, activeTab === 'notes' && styles.tabButtonTextActive]}>
                    Notes
                  </Text>
                </TouchableOpacity>
              </View>

              {activeTab === 'notes' ? (
                topicNotes.length === 0 ? (
                  <View style={styles.emptyNotesCard}>
                    <Text style={styles.emptyNotesIcon}>📝</Text>
                    <Text style={styles.emptyNotesTitle}>No notes yet</Text>
                    <Text style={styles.emptyNotesText}>
                      Notes you save from the chat screen for this topic will show up here.
                    </Text>
                  </View>
                ) : (
                  // Placeholder for when real notes exist — not reached with dummy data.
                  topicNotes.map((n, i) => (
                    <View key={i} style={styles.card}>
                      <Text style={styles.answerText}>{n.noteBlob}</Text>
                    </View>
                  ))
                )
              ) : (
                <>
                  {questionsToShow.length === 0 && (
                    <Text style={styles.emptyText}>No questions yet for this topic.</Text>
                  )}
                  {questionsToShow.map((q, index) => {
                    const state = questionStates[q.id] ?? EMPTY_QUESTION_STATE
                    return (
                      <View key={q.id} style={styles.quizCard}>
                        <Text style={styles.quizIndex}>Q{index + 1}</Text>
                        <Text style={styles.questionText}>{q.question}</Text>

                        {!state.revealed ? (
                          <>
                            <TextInput
                              placeholder="Type your answer"
                              placeholderTextColor="#6B6B6B"
                              value={state.userAnswer}
                              onChangeText={(text) => updateUserAnswer(q.id, text)}
                              style={styles.formInput}
                              multiline
                            />
                            <View style={styles.inlineRow}>
                              <TouchableOpacity
                                style={styles.smallButton}
                                onPress={() => submitAnswer(q.id, q.answer)}
                              >
                                <Text style={styles.smallButtonText}>Submit</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.smallButtonGhost}
                                onPress={() => dontKnowAnswer(q.id)}
                              >
                                <Text style={styles.smallButtonGhostText}>I don't know</Text>
                              </TouchableOpacity>
                            </View>
                          </>
                        ) : (
                          <>
                            {state.submitted && state.userAnswer.trim() !== '' && (
                              <Text style={styles.userAnswerText}>Your answer: {state.userAnswer}</Text>
                            )}
                            <Text style={styles.answerText}>{q.answer}</Text>

                            {state.status === 'unanswered' ? (
                              <View style={styles.inlineRow}>
                                <TouchableOpacity
                                  style={styles.gradeButtonCorrect}
                                  onPress={() => markAnswer(q.id, 'correct')}
                                >
                                  <Text style={styles.gradeButtonText}>Got it right</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={styles.gradeButtonIncorrect}
                                  onPress={() => markAnswer(q.id, 'incorrect')}
                                >
                                  <Text style={styles.gradeButtonText}>Got it wrong</Text>
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <View>
                                <Text
                                  style={
                                    state.status === 'correct' ? styles.statusCorrect : styles.statusIncorrect
                                  }
                                >
                                  {state.status === 'correct' ? 'You got it right' : 'You got it wrong'}
                                </Text>
                                <TouchableOpacity
                                  style={styles.aiHintRow}
                                  onPress={() => askAiAboutQuestion(q.question)}
                                  activeOpacity={0.8}
                                >
                                  <Text style={styles.aiHintIcon}>🤖</Text>
                                  <Text style={styles.aiHintText}>
                                    {state.status === 'correct' ? 'Ask AI to go deeper' : 'Click to know more'}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </>
                        )}
                      </View>
                    )
                  })}
                </>
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  // ---------- Field detail view (topic list) ----------

  if (selectedField) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <TouchableOpacity
          onPress={() => {
            setSelectedFieldId(null)
            setSelectedTopicId(null)
          }}
          style={styles.backRow}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backLabel}>All fields</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{selectedField.name}</Text>
        <Text style={styles.subtitle}>
          {selectedField.topics.length} topic{selectedField.topics.length === 1 ? '' : 's'}
        </Text>

        {selectedField.topics.map((topic) => {
          const streak = streaks[topic.id]
          return (
            <TouchableOpacity
              key={topic.id}
              style={styles.card}
              onPress={() => setSelectedTopicId(topic.id)}
              activeOpacity={0.8}
            >
              <View style={styles.topicHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.topicName}>{topic.topicName}</Text>
                  {streak ? (
                    <Text style={styles.topicMeta}>
                      🔥 Locked in · {formatDate(streak.completionDate)}
                      {daysUntil(streak.completionDate) >= 0
                        ? `  ·  ${daysUntil(streak.completionDate)}d left`
                        : '  ·  overdue'}
                    </Text>
                  ) : (
                    <Text style={styles.topicMetaMuted}>No streak set</Text>
                  )}
                  <Text style={styles.fieldMeta}>
                    {topic.questions.length} question{topic.questions.length === 1 ? '' : 's'}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    )
  }

  // ---------- Browser + current tasks view ----------

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.title}>Select a field of choice</Text>
          {hideFields ? (
            <ChevronRight size={24} color="white" onPress={() => setHideFields(false)} />
          ) : (
            <ChevronDown size={24} color="white" onPress={() => setHideFields(true)} />
          )}
        </View>
        {!hideFields && (
          <>
            <TextInput
              placeholder="Search for the field you want"
              placeholderTextColor="#6B6B6B"
              value={searchInput}
              onChangeText={setSearchInput}
              autoCapitalize="none"
              style={styles.searchInput}
            />

            <View style={styles.fieldList}>
              {filteredFields.map((field) => {
                const streakCount = field.topics.filter((t) => streaks[t.id]).length
                return (
                  <TouchableOpacity
                    key={field.id}
                    style={styles.fieldCard}
                    onPress={() => setSelectedFieldId(field.id)}
                    activeOpacity={0.8}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.fieldName}>{field.name}</Text>
                      <Text style={styles.fieldMeta}>
                        {field.topics.length} topic{field.topics.length === 1 ? '' : 's'}
                        {streakCount > 0 ? `  ·  ${streakCount} streaking` : ''}
                      </Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                )
              })}

              {filteredFields.length === 0 && (
                <Text style={styles.emptyText}>No fields match "{searchInput}".</Text>
              )}
            </View>
          </>
        )}
      </View>

      {/* Topics working on — topics with an active streak */}
      <View style={{ marginTop: 24 }}>
        <View style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.title}>Topics working on</Text>
          {hideActiveTasks ? (
            <ChevronRight size={24} color="white" onPress={() => setHideActiveTasks(false)} />
          ) : (
            <ChevronDown size={24} color="white" onPress={() => setHideActiveTasks(true)} />
          )}
        </View>
        {!hideActiveTasks && (
          <View style={styles.taskList}>
            {streakingTopics.length === 0 && (
              <Text style={styles.emptyText}>Start a streak on a topic to see it here.</Text>
            )}
            {streakingTopics.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => {
                  setSelectedFieldId(task.fieldId)
                  setSelectedTopicId(task.id)
                }}
                activeOpacity={0.8}
              >
                <View style={styles.taskDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.taskTitle}>{task.topicName}</Text>
                  <Text style={styles.taskMeta}>
                    {task.fieldName} · locked in until {formatDate(task.streak.completionDate)}
                    {daysUntil(task.streak.completionDate) >= 0
                      ? `  ·  ${daysUntil(task.streak.completionDate)}d left`
                      : '  ·  overdue'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

// ---------- Styles ----------

const ACCENT = '#F2A93B'
const BG = '#000000'
const CARD_BG = '#121212'
const CARD_BORDER = '#262626'
const TEXT_PRIMARY = '#FFFFFF'
const TEXT_SECONDARY = '#9A9A9A'
const TEXT_MUTED = '#6B6B6B'
const GREEN = '#35C46A'
const RED = '#E05656'
const DISABLED_BG = '#2A2A2A'
const DISABLED_TEXT = '#6E6E6E'

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  content: { padding: 20, paddingBottom: 48 },
  title: { color: TEXT_PRIMARY, fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: TEXT_SECONDARY, fontSize: 14, marginBottom: 12 },
  topicDescription: { color: TEXT_SECONDARY, fontSize: 14, marginBottom: 12 },
  backRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 16, gap: 3 },
  backArrow: { color: ACCENT, fontSize: 22, marginRight: 4 },
  backLabel: { color: ACCENT, fontSize: 15, fontWeight: '500' },
  searchInput: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: TEXT_PRIMARY,
    fontSize: 15,
    marginBottom: 20,
  },
  fieldList: { gap: 12 },
  fieldCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  fieldName: { color: TEXT_PRIMARY, fontSize: 17, fontWeight: '600', marginBottom: 4 },
  fieldMeta: { color: TEXT_SECONDARY, fontSize: 13 },
  chevron: { color: TEXT_MUTED, fontSize: 22, marginLeft: 8 },
  emptyText: { color: TEXT_MUTED, fontSize: 14, paddingVertical: 8 },
  sectionHeading: { color: TEXT_PRIMARY, fontSize: 20, fontWeight: '700', marginTop: 24, marginBottom: 12 },
  taskList: { gap: 10 },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  taskDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: ACCENT, marginRight: 12 },
  taskTitle: { color: TEXT_PRIMARY, fontSize: 15, fontWeight: '600', marginBottom: 2 },
  taskMeta: { color: TEXT_SECONDARY, fontSize: 13 },
  card: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 12,
  },
  topicHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  topicName: { color: TEXT_PRIMARY, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  topicMeta: { color: ACCENT, fontSize: 13 },
  topicMetaMuted: { color: TEXT_MUTED, fontSize: 13 },
  inlineRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  inlineInput: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: TEXT_PRIMARY,
    fontSize: 14,
  },
  smallButton: { backgroundColor: ACCENT, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 9 },
  smallButtonDisabled: { backgroundColor: DISABLED_BG },
  smallButtonText: { color: '#1A1200', fontSize: 14, fontWeight: '700' },
  smallButtonTextDisabled: { color: DISABLED_TEXT },
  smallButtonGhost: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  smallButtonGhostText: { color: TEXT_SECONDARY, fontSize: 13, fontWeight: '600' },
  questionsLabel: { color: TEXT_SECONDARY, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  streakHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  streakActiveLabel: { color: TEXT_PRIMARY, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  iconButton: { padding: 4, marginLeft: 8 },
  dropButton: { alignItems: 'center', marginTop: 14, paddingVertical: 4 },
  dropButtonText: { color: RED, fontSize: 13, fontWeight: '600' },
  statsRow: { display: "flex", flexDirection: 'row', justifyContent: "space-between", marginBottom: 16 },
  statChip: {
  
    display: "flex",
    flexDirection: "row",
    gap: 12,
    alignItems: "baseline"
  },
  statChipLabel: { color: TEXT_MUTED, fontSize: 11, fontWeight: '600', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.4 },
  statChipValue: { color: TEXT_PRIMARY, fontSize: 15, fontWeight: '700' },
  askAiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  askAiText: { flex: 1, color: ACCENT, fontSize: 15, fontWeight: '600' },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: CARD_BORDER,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: ACCENT, borderColor: ACCENT },
  checkboxMark: { color: '#1A1200', fontSize: 14, fontWeight: '700' },
  checkboxLabel: { flex: 1, color: TEXT_PRIMARY, fontSize: 14, fontWeight: '500' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionPill: {
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: '#1A1A1A',
  },
  optionPillActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  optionPillText: { color: TEXT_SECONDARY, fontSize: 13, fontWeight: '600' },
  optionPillTextActive: { color: '#1A1200' },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 12,
    padding: 4,
    marginTop: 24,
    marginBottom: 12,
  },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 9 },
  tabButtonActive: { backgroundColor: '#1A1A1A' },
  tabButtonText: { color: TEXT_SECONDARY, fontSize: 13, fontWeight: '600' },
  tabButtonTextActive: { color: ACCENT },
  emptyNotesCard: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyNotesIcon: { fontSize: 28, marginBottom: 10 },
  emptyNotesTitle: { color: TEXT_PRIMARY, fontSize: 15, fontWeight: '700', marginBottom: 6 },
  emptyNotesText: { color: TEXT_SECONDARY, fontSize: 13, textAlign: 'center', lineHeight: 18 },
  quizCard: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  quizIndex: { color: TEXT_MUTED, fontSize: 12, fontWeight: '700', marginBottom: 6, letterSpacing: 0.5 },
  questionText: { color: TEXT_PRIMARY, fontSize: 15, fontWeight: '600', marginBottom: 10 },
  formInput: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: TEXT_PRIMARY,
    fontSize: 14,
    marginBottom: 10,
    minHeight: 44,
    textAlignVertical: 'top',
  },
  userAnswerText: { color: TEXT_SECONDARY, fontSize: 13, fontStyle: 'italic', marginTop: 8 },
  answerText: { color: TEXT_SECONDARY, fontSize: 14, marginTop: 6, marginBottom: 12, lineHeight: 20 },
  gradeButtonCorrect: { backgroundColor: GREEN, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9 },
  gradeButtonIncorrect: { backgroundColor: RED, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9 },
  gradeButtonText: { color: '#0A0A0A', fontSize: 13, fontWeight: '700' },
  statusCorrect: { color: GREEN, fontSize: 13, fontWeight: '600', marginTop: 4 },
  statusIncorrect: { color: RED, fontSize: 13, fontWeight: '600', marginTop: 4 },
  aiHintRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  aiHintIcon: { fontSize: 16, marginRight: 6 },
  aiHintText: { color: ACCENT, fontSize: 13, fontWeight: '600' },
})

export default tasks