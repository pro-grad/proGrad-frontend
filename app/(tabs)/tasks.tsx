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
import { useRouter } from 'expo-router'
import { initialFieldsData, ProField, Topic } from '../../lib/data'

const initialFields: ProField[] = initialFieldsData

type QuestionStatus = 'unanswered' | 'correct' | 'incorrect'
type QuestionState = {
  userAnswer: string
  submitted: boolean
  revealed: boolean
  status: QuestionStatus
}

const EMPTY_QUESTION_STATE: QuestionState = {
  userAnswer: '',
  submitted: false,
  revealed: false,
  status: 'unanswered',
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
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000)
  return diff
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
  const router = useRouter()

  const [fieldsData, setFieldsData] = useState<ProField[]>(initialFields)
  const [searchInput, setSearchInput] = useState('')
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)

  const [dateDraftTopicId, setDateDraftTopicId] = useState<string | null>(null)
  const [dateDraftValue, setDateDraftValue] = useState('')

  // How many of the topic's questions the person wants to be quizzed on.
  // Dummy for now — once the backend exists, this count is what gets sent
  // to it to generate/pull that many questions instead of just slicing
  // the local array.
  const [questionCountInput, setQuestionCountInput] = useState('')
  const [activeQuestionCount, setActiveQuestionCount] = useState(0)

  // Quiz progress for whichever topic is currently open. Not part of the
  // dummy data model itself — resets whenever a new topic opens or
  // "Refresh questions" is tapped.
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({})

  // "Need more info? Ask AI" selection mode — lets the person check off
  // which questions they want to hand to the AI instead of asking about
  // the whole topic at once.
  const [askAiMode, setAskAiMode] = useState(false)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Record<string, boolean>>({})

  const filteredFields = fieldsData.filter((field) =>
    field.name.toLowerCase().includes(searchInput.toLowerCase())
  )

  const selectedField = fieldsData.find((field) => field.id === selectedFieldId) ?? null
  const selectedTopic =
    selectedField?.topics.find((topic) => topic.id === selectedTopicId) ?? null

  const upcomingTasks = fieldsData
    .flatMap((field) =>
      field.topics
        .filter((topic) => topic.completionDate)
        .map((topic) => ({ ...topic, fieldName: field.name, fieldId: field.id }))
    )
    .sort((a, b) => (a.completionDate! < b.completionDate! ? -1 : 1))

  // Reset quiz progress, question count, and ask-AI selection every time a
  // different topic opens.
  useEffect(() => {
    setQuestionStates({})
    setAskAiMode(false)
    setSelectedQuestionIds({})
    const total = selectedTopic?.questions.length ?? 0
    setActiveQuestionCount(total)
    setQuestionCountInput(total > 0 ? String(total) : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopicId])

  function updateTopic(topicId: string, updater: (topic: Topic) => Topic) {
    setFieldsData((prev) =>
      prev.map((field) => ({
        ...field,
        topics: field.topics.map((topic) =>
          topic.id === topicId ? updater(topic) : topic
        ),
      }))
    )
  }

  function saveCompletionDate(topicId: string) {
    if (!dateDraftValue.trim()) return
    updateTopic(topicId, (topic) => ({ ...topic, completionDate: dateDraftValue.trim() }))
    setDateDraftTopicId(null)
    setDateDraftValue('')
  }

  function updateUserAnswer(questionId: string, text: string) {
    setQuestionStates((prev) => ({
      ...prev,
      [questionId]: { ...(prev[questionId] ?? EMPTY_QUESTION_STATE), userAnswer: text },
    }))
  }

  function submitAnswer(questionId: string, correctAnswer: string) {
    const typed = questionStates[questionId]?.userAnswer ?? ''

    // See checkAnswerAgainstKey above — this doesn't do anything yet.
    checkAnswerAgainstKey(typed, correctAnswer)

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
      [questionId]: {
        ...(prev[questionId] ?? EMPTY_QUESTION_STATE),
        submitted: false,
        revealed: true,
      },
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

  function applyQuestionCount() {
    if (!selectedTopic) return
    const parsed = parseInt(questionCountInput, 10)
    if (isNaN(parsed) || parsed < 0) return
    setActiveQuestionCount(Math.min(parsed, selectedTopic.questions.length))
    setQuestionStates({})
  }

  function generateNewQuestions() {
    // Dummy — will call the AI question-generation endpoint later.
    Alert.alert(
      'Coming soon',
      'AI-generated questions for this topic will show up here once the backend is connected. For now, use Refresh to answer the existing questions again.'
    )
  }

  // Dummy handoff for a single question's "click to know more" / "go
  // deeper" link — no real AI wiring yet, just routes to the chat tab
  // with the question as context.
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

  // Dummy handoff for the multi-question picker — bundles the selected
  // questions into one prefill and routes to chat. Same story: real
  // backend wiring comes later.
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

  // ---------- Topic quiz view (full screen) ----------

  if (selectedTopic && selectedField) {
    const questionsToShow = selectedTopic.questions.slice(0, activeQuestionCount)
    const answeredCount = questionsToShow.filter(
      (q) => questionStates[q.id] && questionStates[q.id].status !== 'unanswered'
    ).length
    const selectedCount = Object.values(selectedQuestionIds).filter(Boolean).length
    const isEditingDate = dateDraftTopicId === selectedTopic.id

    return (
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => setSelectedTopicId(null)} style={styles.backRow}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backLabel}>Back to {selectedField.name}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{selectedTopic.topicName}</Text>
          {questionsToShow.length > 0 ? (
            <Text style={styles.subtitle}>
              {answeredCount}/{questionsToShow.length} answered
            </Text>
          ) : (
            <Text style={styles.subtitle}>No questions yet</Text>
          )}

          {/* Target date */}
          <View style={styles.card}>
            <Text style={styles.questionsLabel}>
              How long will it take you to take on an analysis test of your skills of 20
              questions, 250 questions?
            </Text>
            {selectedTopic.completionDate ? (
              <Text style={styles.topicMeta}>
                Target · {formatDate(selectedTopic.completionDate)}
                {daysUntil(selectedTopic.completionDate) >= 0
                  ? `  ·  ${daysUntil(selectedTopic.completionDate)}d left`
                  : '  ·  overdue'}
              </Text>
            ) : (
              <Text style={styles.topicMetaMuted}>No target date set</Text>
            )}

            {isEditingDate ? (
              <View style={[styles.inlineRow, { marginTop: 10 }]}>
                <TextInput
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#6B6B6B"
                  value={dateDraftValue}
                  onChangeText={setDateDraftValue}
                  style={styles.inlineInput}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={() => saveCompletionDate(selectedTopic.id)}
                >
                  <Text style={styles.smallButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.secondaryAction}
                onPress={() => {
                  setDateDraftTopicId(selectedTopic.id)
                  setDateDraftValue(selectedTopic.completionDate ?? '')
                }}
              >
                <Text style={styles.secondaryActionText}>
                  {selectedTopic.completionDate ? 'Change target date' : '+ Set target date'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* How many questions */}
          <View style={styles.card}>
            <Text style={styles.questionsLabel}>How many questions would you like?</Text>
            <View style={styles.inlineRow}>
              <TextInput
                placeholder="e.g. 10"
                placeholderTextColor="#6B6B6B"
                value={questionCountInput}
                onChangeText={setQuestionCountInput}
                keyboardType="number-pad"
                style={styles.inlineInput}
              />
              <TouchableOpacity style={styles.smallButton} onPress={applyQuestionCount}>
                <Text style={styles.smallButtonText}>Set</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.topicMetaMuted, { marginTop: 8 }]}>
              {selectedTopic.questions.length} question
              {selectedTopic.questions.length === 1 ? '' : 's'} available right now — once the
              backend's connected this can pull from a much bigger bank.
            </Text>
          </View>

          {/* "Need more info" — enters ask-AI selection mode instead of asking right away */}
          {!askAiMode && (
            <TouchableOpacity
              style={styles.askAiCard}
              onPress={toggleAskAiMode}
              activeOpacity={0.8}
            >
              <Text style={styles.askAiText}>💬 Need more info? Ask AI</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          )}

          {/* Refresh / generate new questions */}
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
              <Text style={styles.sectionHeading}>Questions ({questionsToShow.length})</Text>

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
                          <Text style={styles.userAnswerText}>
                            Your answer: {state.userAnswer}
                          </Text>
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
                                state.status === 'correct'
                                  ? styles.statusCorrect
                                  : styles.statusIncorrect
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
                                {state.status === 'correct'
                                  ? 'Ask AI to go deeper'
                                  : 'Click to know more'}
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

        {selectedField.topics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={styles.card}
            onPress={() => setSelectedTopicId(topic.id)}
            activeOpacity={0.8}
          >
            <View style={styles.topicHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.topicName}>{topic.topicName}</Text>
                {topic.completionDate ? (
                  <Text style={styles.topicMeta}>
                    Target · {formatDate(topic.completionDate)}
                    {daysUntil(topic.completionDate) >= 0
                      ? `  ·  ${daysUntil(topic.completionDate)}d left`
                      : '  ·  overdue'}
                  </Text>
                ) : (
                  <Text style={styles.topicMetaMuted}>No target date set</Text>
                )}
                <Text style={styles.fieldMeta}>
                  {topic.questions.length} question{topic.questions.length === 1 ? '' : 's'}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    )
  }

  // ---------- Browser + current tasks view ----------

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Select a field of choice</Text>

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
          const setCount = field.topics.filter((t) => t.completionDate).length
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
                  {setCount > 0 ? `  ·  ${setCount} scheduled` : ''}
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

      {/* Current tasks */}
      <Text style={styles.sectionHeading}>Upcoming</Text>
      <View style={styles.taskList}>
        {upcomingTasks.length === 0 && (
          <Text style={styles.emptyText}>Set a target date on a topic to see it here.</Text>
        )}
        {upcomingTasks.map((task) => (
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
                {task.fieldName} · {formatDate(task.completionDate!)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  title: {
    color: TEXT_PRIMARY,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: TEXT_SECONDARY,
    fontSize: 14,
    marginBottom: 20,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backArrow: {
    color: ACCENT,
    fontSize: 22,
    marginRight: 4,
  },
  backLabel: {
    color: ACCENT,
    fontSize: 15,
    fontWeight: '500',
  },
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
  fieldList: {
    gap: 12,
  },
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
  fieldName: {
    color: TEXT_PRIMARY,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  fieldMeta: {
    color: TEXT_SECONDARY,
    fontSize: 13,
  },
  chevron: {
    color: TEXT_MUTED,
    fontSize: 22,
    marginLeft: 8,
  },
  emptyText: {
    color: TEXT_MUTED,
    fontSize: 14,
    paddingVertical: 8,
  },
  sectionHeading: {
    color: TEXT_PRIMARY,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
  },
  taskList: {
    gap: 10,
  },
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
  taskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ACCENT,
    marginRight: 12,
  },
  taskTitle: {
    color: TEXT_PRIMARY,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  taskMeta: {
    color: TEXT_SECONDARY,
    fontSize: 13,
  },
  card: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 12,
  },
  topicHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicName: {
    color: TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  topicMeta: {
    color: ACCENT,
    fontSize: 13,
  },
  topicMetaMuted: {
    color: TEXT_MUTED,
    fontSize: 13,
  },
  secondaryAction: {
    paddingVertical: 6,
    marginTop: 8,
  },
  secondaryActionText: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '500',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
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
  smallButton: {
    backgroundColor: ACCENT,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  smallButtonDisabled: {
    backgroundColor: DISABLED_BG,
  },
  smallButtonText: {
    color: '#1A1200',
    fontSize: 14,
    fontWeight: '700',
  },
  smallButtonTextDisabled: {
    color: DISABLED_TEXT,
  },
  smallButtonGhost: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  smallButtonGhostText: {
    color: TEXT_SECONDARY,
    fontSize: 13,
    fontWeight: '600',
  },
  questionsLabel: {
    color: TEXT_SECONDARY,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
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
  askAiText: {
    flex: 1,
    color: ACCENT,
    fontSize: 15,
    fontWeight: '600',
  },
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
  checkboxChecked: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  checkboxMark: {
    color: '#1A1200',
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxLabel: {
    flex: 1,
    color: TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '500',
  },
  quizCard: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  quizIndex: {
    color: TEXT_MUTED,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  questionText: {
    color: TEXT_PRIMARY,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
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
  userAnswerText: {
    color: TEXT_SECONDARY,
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 8,
  },
  answerText: {
    color: TEXT_SECONDARY,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 12,
    lineHeight: 20,
  },
  gradeButtonCorrect: {
    backgroundColor: GREEN,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  gradeButtonIncorrect: {
    backgroundColor: RED,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  gradeButtonText: {
    color: '#0A0A0A',
    fontSize: 13,
    fontWeight: '700',
  },
  statusCorrect: {
    color: GREEN,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  statusIncorrect: {
    color: RED,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  aiHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  aiHintIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  aiHintText: {
    color: ACCENT,
    fontSize: 13,
    fontWeight: '600',
  },
})

export default tasks
