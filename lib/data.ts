// ---------- Types ----------

export type Question = {
  id: string
  question: string
  answer: string
}

export type Topic = {
  id: string
  topicName: string
  completionDate: string | null
  questions: Question[]
}

export type ProField = {
  id: string
  name: string
  topics: Topic[]
}

// ---------- Dummy data ----------
// Frontend-only for now — this whole array gets swapped for a real API call later.


export const initialFieldsData: ProField[] = [
  {
    id: '223423',
    name: 'Software Engineering',
    topics: [
      {
        id: '03843',
        topicName: 'Cloud Architecture',
        completionDate: '2026-09-14',
        questions: [
          {
            id: 'q1',
            question: 'What is cloud architecture?',
            answer:
              'The way components like networks, servers, and storage are arranged to deliver cloud services.',
          },
          {
            id: 'q2',
            question: 'Name the three main service models.',
            answer: 'IaaS, PaaS, and SaaS.',
          },
        ],
      },
      {
        id: '03844',
        topicName: 'Data Structures & Algorithms',
        completionDate: null,
        questions: [
          {
            id: 'q3',
            question: 'What is the time complexity of inserting at the head of a linked list?',
            answer: 'O(1).',
          },
        ],
      },
      {
        id: '03845',
        topicName: 'System Design',
        completionDate: '2026-09-20',
        questions: [],
      },
    ],
  },
  {
    id: '223424',
    name: 'Accounting',
    topics: [
      {
        id: '04001',
        topicName: 'Financial Statements',
        completionDate: '2026-09-11',
        questions: [
          {
            id: 'q4',
            question: 'What are the three core financial statements?',
            answer:
              'The income statement, balance sheet, and statement of cash flows.',
          },
        ],
      },
      {
        id: '04002',
        topicName: 'Double-Entry Bookkeeping',
        completionDate: null,
        questions: [
          {
            id: 'q5',
            question: 'What does "debits must equal credits" mean?',
            answer: 'Every transaction affects at least two accounts and the books must stay balanced.',
          },
        ],
      },
      {
        id: '04003',
        topicName: 'Tax Fundamentals',
        completionDate: '2026-09-18',
        questions: [],
      },
      {
        id: '04004',
        topicName: 'Auditing Principles',
        completionDate: null,
        questions: [],
      },
    ],
  },
  {
    id: '223425',
    name: 'Business Management',
    topics: [
      {
        id: '05001',
        topicName: 'Strategic Planning',
        completionDate: null,
        questions: [],
      },
      {
        id: '05002',
        topicName: 'Operations Management',
        completionDate: '2026-09-25',
        questions: [
          {
            id: 'q6',
            question: 'What is the goal of operations management?',
            answer: 'To run the production of goods or services as efficiently as possible.',
          },
        ],
      },
      {
        id: '05003',
        topicName: 'Leadership & Team Building',
        completionDate: '2026-09-16',
        questions: [],
      },
    ],
  },
  {
    id: '223426',
    name: 'Marketing',
    topics: [
      {
        id: '06001',
        topicName: 'Market Research',
        completionDate: '2026-09-13',
        questions: [],
      },
      {
        id: '06002',
        topicName: 'Branding & Positioning',
        completionDate: null,
        questions: [
          {
            id: 'q7',
            question: 'What is a brand positioning statement?',
            answer: 'A short statement defining who a product is for and why it matters to them.',
          },
        ],
      },
      {
        id: '06003',
        topicName: 'Digital Advertising',
        completionDate: null,
        questions: [],
      },
    ],
  },
  {
    id: '223427',
    name: 'Nursing',
    topics: [
      {
        id: '07001',
        topicName: 'Patient Assessment',
        completionDate: '2026-09-17',
        questions: [
          {
            id: 'q8',
            question: 'What are the vital signs typically checked during assessment?',
            answer: 'Temperature, pulse, respiration rate, and blood pressure.',
          },
        ],
      },
      {
        id: '07002',
        topicName: 'Pharmacology Basics',
        completionDate: null,
        questions: [],
      },
      {
        id: '07003',
        topicName: 'Infection Control',
        completionDate: '2026-09-22',
        questions: [],
      },
    ],
  },
  {
    id: '223428',
    name: 'Law',
    topics: [
      {
        id: '08001',
        topicName: 'Contract Law',
        completionDate: null,
        questions: [
          {
            id: 'q9',
            question: 'What are the essential elements of a valid contract?',
            answer: 'Offer, acceptance, consideration, and mutual intent to be bound.',
          },
        ],
      },
      {
        id: '08002',
        topicName: 'Constitutional Law',
        completionDate: '2026-09-19',
        questions: [],
      },
      {
        id: '08003',
        topicName: 'Legal Writing & Research',
        completionDate: null,
        questions: [],
      },
    ],
  },
]