// lib/data.ts

// ---------- Types ----------
// Shaped to mirror the SQL schema: proField / topic / questions / questionLevel /
// streak / Note / UserAnswer tables. Still pure dummy data — no backend calls yet.
// Note: `streak` is its own table (streakId pk, topicId + userId fks, levelId fk),
// not a field on topic — a topic can have zero or one active streak.

export type Question = {
  id: string // quesId
  question: string
  answer: string
  levelId?: string // fk to questionLevel — not assigned on dummy questions yet
  improve?: string // matches the "improve" column — unused for now
}

export type Topic = {
  id: string // topicId
  proFieldId: string
  topicName: string // name
  description: string
  createdAt: string
  questions: Question[]
}

export type ProField = {
  id: string
  name: string
  topics: Topic[]
}

export type QuestionLevel = {
  id: string // levelId
  name: string
  description?: string
}

export type Streak = {
  id: string // streakId
  topicId: string
  userId: string
  dailyGoalQuestions: number // dailyGoalQues
  completionDate: string // the "locked in until" date — always a real date, never a day count
  levelId: string // fk to questionLevel — decided by the AI, not the user
  createdAt: string
}

export type Note = {
  topicId: string
  noteBlob: string
  createdAt: string
}

// ---------- Dummy lookup: question levels ----------
// Mirrors the questionLevel table. The user never picks from these directly
// anymore — a streak's levelId gets set by the AI (randomized here for now).

export const questionLevels: QuestionLevel[] = [
  { id: 'lvl-beginner', name: 'Beginner', description: 'Foundational concepts and definitions.' },
  { id: 'lvl-intermediate', name: 'Intermediate', description: 'Applied understanding and common scenarios.' },
  { id: 'lvl-expert', name: 'Expert', description: 'Edge cases, tradeoffs, and deep specifics.' },
]

// ---------- Dummy data ----------
// Frontend-only — swapped for real API calls once the Rust backend + DB
// from the diagram is connected.

const STUDENT_ID = 'dave-001' // matches the dummy `user` in tasks.tsx for now
const CREATED_AT = '2026-08-01'

export const initialFieldsData: ProField[] = [
  {
    id: '223423',
    name: 'Software Engineering',
    topics: [
      {
        id: '03843',
        proFieldId: '223423',
        topicName: 'Cloud Architecture',
        description: 'Core concepts behind designing and scaling cloud systems.',
        createdAt: CREATED_AT,
        questions: [
          { id: 'q1', question: 'What is cloud architecture?', answer: 'The way components like networks, servers, and storage are arranged to deliver cloud services.' },
          { id: 'q2', question: 'Name the three main service models.', answer: 'IaaS, PaaS, and SaaS.' },
          { id: 'q3', question: "What's the difference between horizontal and vertical scaling?", answer: 'Horizontal scaling adds more machines; vertical scaling adds more power (CPU/RAM) to an existing machine.' },
          { id: 'q4', question: 'What is a CDN used for?', answer: 'Caching content closer to users geographically to reduce latency.' },
          { id: 'q5', question: 'What does "high availability" mean in cloud design?', answer: 'A system stays operational with minimal downtime, often via redundancy across zones or regions.' },
          { id: 'q6', question: 'What is the difference between public, private, and hybrid cloud?', answer: 'Public: shared multi-tenant infrastructure from a provider. Private: dedicated infrastructure for one org. Hybrid: a mix of both.' },
        ],
      },
      {
        id: '03844',
        proFieldId: '223423',
        topicName: 'Data Structures & Algorithms',
        description: 'Fundamentals for technical interviews and efficient code.',
        createdAt: CREATED_AT,
        questions: [
          { id: 'q7', question: 'What is the time complexity of inserting at the head of a linked list?', answer: 'O(1).' },
          { id: 'q8', question: 'What is the time complexity of binary search?', answer: 'O(log n).' },
          { id: 'q9', question: 'What is a hash map good for?', answer: 'Average O(1) lookup, insert, and delete by key.' },
          { id: 'q10', question: 'What is the difference between a stack and a queue?', answer: 'A stack is LIFO (last in, first out); a queue is FIFO (first in, first out).' },
          { id: 'q11', question: 'What does Big O notation describe?', answer: "An algorithm's growth rate relative to input size, as an upper bound." },
          { id: 'q12', question: 'When would you use a tree over an array?', answer: 'When you need hierarchical relationships, or fast sorted search/insert/delete (e.g. a balanced BST).' },
        ],
      },
      {
        id: '03845',
        proFieldId: '223423',
        topicName: 'System Design',
        description: 'Designing systems that scale reliably under load.',
        createdAt: CREATED_AT,
        questions: [
          { id: 'q13', question: 'What is horizontal scaling?', answer: 'Adding more servers to share the load, rather than upgrading one machine.' },
          { id: 'q14', question: 'What is a load balancer?', answer: 'A component that distributes incoming traffic across multiple servers.' },
          { id: 'q15', question: 'What is the CAP theorem?', answer: 'A distributed system can only guarantee two of Consistency, Availability, and Partition tolerance at once.' },
          { id: 'q16', question: 'Why use caching?', answer: 'To reduce latency and database load by storing frequently accessed data.' },
          { id: 'q17', question: 'What is database sharding?', answer: 'Splitting a database into smaller pieces distributed across multiple servers.' },
          { id: 'q18', question: "What's the difference between SQL and NoSQL databases?", answer: 'SQL: relational, structured schema. NoSQL: flexible schema, often better for unstructured or high-scale data.' },
        ],
      },
    ],
  },
  {
    id: '223424',
    name: 'Accounting',
    topics: [
      {
        id: '04001',
        proFieldId: '223424',
        topicName: 'Financial Statements',
        description: 'Reading and understanding the core financial reports.',
        createdAt: CREATED_AT,
        questions: [
          { id: 'q19', question: 'What are the three core financial statements?', answer: 'The income statement, balance sheet, and statement of cash flows.' },
          { id: 'q20', question: 'What does the balance sheet show?', answer: "A company's assets, liabilities, and equity at a specific point in time." },
          { id: 'q21', question: 'What does the income statement show?', answer: 'Revenues and expenses over a period, resulting in net income.' },
          { id: 'q22', question: 'What is the accounting equation?', answer: 'Assets = Liabilities + Equity.' },
          { id: 'q23', question: 'What is the purpose of the cash flow statement?', answer: 'It shows cash inflows and outflows across operating, investing, and financing activities.' },
          { id: 'q24', question: "What's the difference between accrual and cash accounting?", answer: 'Accrual records transactions when earned or incurred; cash accounting records them when money actually changes hands.' },
        ],
      },
      {
        id: '04002',
        proFieldId: '223424',
        topicName: 'Double-Entry Bookkeeping',
        description: 'The mechanics of keeping balanced books.',
        createdAt: CREATED_AT,
        questions: [
          { id: 'q25', question: 'What does "debits must equal credits" mean?', answer: 'Every transaction affects at least two accounts, and the books must stay balanced.' },
          { id: 'q26', question: 'What is a debit?', answer: 'An entry that increases assets/expenses or decreases liabilities/equity/revenue.' },
          { id: 'q27', question: 'What is a credit?', answer: 'An entry that increases liabilities/equity/revenue or decreases assets/expenses.' },
          { id: 'q28', question: 'What is a general ledger?', answer: "The master record of all a company's accounts and transactions." },
          { id: 'q29', question: 'What is a trial balance?', answer: 'A report listing all account balances, used to verify debits equal credits.' },
          { id: 'q30', question: 'What is a journal entry?', answer: 'The initial record of a transaction before it is posted to the ledger.' },
        ],
      },
      {
        id: '04003',
        proFieldId: '223424',
        topicName: 'Tax Fundamentals',
        description: 'The basics of how individual and business tax works.',
        createdAt: CREATED_AT,
        questions: [
          { id: 'q31', question: "What's a marginal tax rate?", answer: 'The rate applied to the next dollar of taxable income.' },
          { id: 'q32', question: "What's the difference between a tax deduction and a tax credit?", answer: 'A deduction reduces taxable income; a credit reduces the tax owed directly.' },
          { id: 'q33', question: 'What is taxable income?', answer: 'Gross income minus allowable deductions.' },
          { id: 'q34', question: "What's a progressive tax system?", answer: 'One where the tax rate increases as income increases.' },
          { id: 'q35', question: "What's the difference between W-2 and 1099 income (US)?", answer: 'W-2 is for employees with tax withheld; 1099 is for independent contractors.' },
          { id: 'q36', question: 'What is a tax bracket?', answer: 'A range of income taxed at a specific rate.' },
        ],
      },
      {
        id: '04004',
        proFieldId: '223424',
        topicName: 'Auditing Principles',
        description: 'How independent audits verify financial accuracy.',
        createdAt: CREATED_AT,
        questions: [
          { id: 'q37', question: 'What is the purpose of an audit?', answer: "To independently verify the accuracy of a company's financial statements." },
          { id: 'q38', question: 'What is materiality?', answer: 'A threshold above which misstatements are likely to affect decisions.' },
          { id: 'q39', question: "What's the difference between internal and external audits?", answer: 'Internal audits are conducted by employees for internal controls; external audits are an independent third-party review.' },
          { id: 'q40', question: 'What is audit evidence?', answer: "Information used to support the auditor's opinion." },
          { id: 'q41', question: 'What is an unqualified opinion?', answer: "The auditor's conclusion that financials are fairly presented, with no material issues." },
          { id: 'q42', question: 'What is internal control?', answer: 'Processes designed to ensure reliable financial reporting and prevent fraud.' },
        ],
      },
    ],
  },
  {
    id: '223425',
    name: 'Business Management',
    topics: [
      {
        id: '05001',
        proFieldId: '223425',
        topicName: 'Strategic Planning',
        description: 'Setting long-term direction for an organization.',
        createdAt: CREATED_AT,
        questions: [
          { id: 'q43', question: 'What is a SWOT analysis?', answer: 'A framework evaluating Strengths, Weaknesses, Opportunities, and Threats.' },
          { id: 'q44', question: "What's a mission statement?", answer: "A statement defining an organization's purpose and reason for existing." },
          { id: 'q45', question: "What's a vision statement?", answer: 'A statement describing what the organization aspires to become.' },
          { id: 'q46', question: "What's the difference between strategy and tactics?", answer: 'Strategy is the overall long-term plan; tactics are the specific actions used to execute it.' },
          { id: 'q47', question: 'What is a competitive advantage?', answer: 'An attribute that allows a company to outperform its competitors.' },
          { id: 'q48', question: "What's a KPI?", answer: 'A key performance indicator — a measurable value showing progress toward a goal.' },
        ],
      },
      {
        id: '05002',
        proFieldId: '223425',
        topicName: 'Operations Management',
        description: 'Running the production of goods and services efficiently.',
        createdAt: CREATED_AT,
        questions: [
          { id: 'q49', question: 'What is the goal of operations management?', answer: 'To run the production of goods or services as efficiently as possible.' },
          { id: 'q50', question: 'What is a supply chain?', answer: 'The network of entities involved in producing and delivering a product.' },
          { id: 'q51', question: "What's just-in-time (JIT) inventory?", answer: 'Receiving goods only as needed, to reduce inventory holding costs.' },
          { id: 'q52', question: 'What is quality control?', answer: 'Processes used to ensure products meet defined standards.' },
          { id: 'q53', question: "What's capacity planning?", answer: 'Determining the resources needed to meet production demand.' },
          { id: 'q54', question: 'What is process optimization?', answer: 'Improving workflows to increase efficiency and reduce waste.' },
        ],
      },
      {
        id: '05003',
        proFieldId: '223425',
        topicName: 'Leadership & Team Building',
        description: 'Leading, motivating, and developing people.',
        createdAt: CREATED_AT,
        questions: [
          { id: 'q55', question: 'What is the difference between a leader and a manager?', answer: 'A leader inspires and sets direction; a manager organizes and executes tasks.' },
          { id: 'q56', question: 'What is emotional intelligence?', answer: "The ability to recognize and manage your own and others' emotions." },
          { id: 'q57', question: "What's the value of team building activities?", answer: 'They improve trust, communication, and collaboration.' },
          { id: 'q58', question: "What's servant leadership?", answer: "A leadership style focused on serving the team's needs first." },
          { id: 'q59', question: "What's a common trait of high-performing teams?", answer: 'Clear goals, mutual trust, and open communication.' },
          { id: 'q60', question: 'What is delegation?', answer: 'Assigning responsibility and authority for tasks to others.' },
        ],
      },
    ],
  },
  {
    id: '223426',
    name: 'Marketing',
    topics: [
      {
        id: '06001',
        proFieldId: '223426',
        topicName: 'Market Research',
        description: 'Understanding customers, trends, and competitors.',
        createdAt: CREATED_AT,
        questions: [
          { id: 'q61', question: 'What is the purpose of market research?', answer: 'To understand customer needs, market trends, and competitors.' },
          { id: 'q62', question: "What's the difference between primary and secondary research?", answer: 'Primary research is data collected firsthand; secondary research uses existing data from other sources.' },
          { id: 'q63', question: 'What is a target market?', answer: 'The specific group of consumers a product is aimed at.' },
          { id: 'q64', question: "What's a focus group?", answer: 'A small group interviewed to gather qualitative feedback.' },
          { id: 'q65', question: "What's market segmentation?", answer: 'Dividing a market into distinct groups with similar needs.' },
          { id: 'q66', question: 'How is a SWOT used in market research?', answer: 'To evaluate internal and external factors affecting a market position.' },
        ],
      },
      {
        id: '06002',
        proFieldId: '223426',
        topicName: 'Branding & Positioning',
        description: 'Defining who a brand is and how it stands out.',
        createdAt: CREATED_AT,
        questions: [
          { id: 'q67', question: 'What is a brand positioning statement?', answer: 'A short statement defining who a product is for and why it matters to them.' },
          { id: 'q68', question: "What's brand equity?", answer: 'The value a brand adds to a product beyond its functional benefits.' },
          { id: 'q69', question: 'What is a unique selling proposition (USP)?', answer: "What makes a product different or better than competitors'." },
          { id: 'q70', question: "What's brand identity?", answer: 'The visual and verbal elements representing a brand.' },
          { id: 'q71', question: "What's the difference between branding and marketing?", answer: 'Branding is who you are; marketing is how you promote it.' },
          { id: 'q72', question: "What's brand consistency?", answer: 'Presenting a uniform brand experience across all channels.' },
        ],
      },
      {
        id: '06003',
        proFieldId: '223426',
        topicName: 'Digital Advertising',
        description: 'Running and measuring ads online.',
        createdAt: CREATED_AT,
        questions: [
          { id: 'q73', question: 'What is PPC advertising?', answer: 'Pay-per-click — the advertiser pays each time someone clicks the ad.' },
          { id: 'q74', question: "What's CTR?", answer: 'Click-through rate — the percentage of people who click an ad after seeing it.' },
          { id: 'q75', question: "What's retargeting?", answer: 'Showing ads to people who previously visited your site or app.' },
          { id: 'q76', question: "What's A/B testing?", answer: 'Comparing two versions of an ad or page to see which performs better.' },
          { id: 'q77', question: "What's SEO?", answer: 'Optimizing content to rank higher in organic search results.' },
          { id: 'q78', question: "What's CPM?", answer: 'Cost per thousand impressions.' },
        ],
      },
    ],
  },
  {
    id: '223427',
    name: 'Nursing',
    topics: [
      {
        id: '07001',
        proFieldId: '223427',
        topicName: 'Patient Assessment',
        description: "Evaluating a patient's overall health status.",
        createdAt: CREATED_AT,
        questions: [
          { id: 'q79', question: 'What are the vital signs typically checked during assessment?', answer: 'Temperature, pulse, respiration rate, and blood pressure.' },
          { id: 'q80', question: 'What is the purpose of a head-to-toe assessment?', answer: "To systematically evaluate a patient's overall health status." },
          { id: 'q81', question: 'What is the Glasgow Coma Scale used for?', answer: "Assessing a patient's level of consciousness." },
          { id: 'q82', question: 'What is a baseline assessment?', answer: 'The initial recorded status used to compare against future changes.' },
          { id: 'q83', question: 'What is auscultation?', answer: 'Listening to internal body sounds, often with a stethoscope.' },
          { id: 'q84', question: 'Why is patient history important?', answer: 'It informs risk factors, diagnosis, and care planning.' },
        ],
      },
      {
        id: '07002',
        proFieldId: '223427',
        topicName: 'Pharmacology Basics',
        description: "How drugs work in the body and how they're administered.",
        createdAt: CREATED_AT,
        questions: [
          { id: 'q85', question: "What's the difference between generic and brand-name drugs?", answer: 'Generic drugs have the same active ingredient under a different name/cost; brand-name is the original patented version.' },
          { id: 'q86', question: "What is a drug's half-life?", answer: "The time it takes for a drug's concentration in the body to reduce by half." },
          { id: 'q87', question: 'What are the "5 rights" of medication administration?', answer: 'Right patient, right drug, right dose, right route, right time.' },
          { id: 'q88', question: 'What is a contraindication?', answer: 'A condition or factor that makes a treatment inadvisable.' },
          { id: 'q89', question: "What's the difference between agonist and antagonist drugs?", answer: 'An agonist activates a receptor; an antagonist blocks it.' },
          { id: 'q90', question: "What's pharmacokinetics?", answer: 'How the body absorbs, distributes, metabolizes, and excretes a drug.' },
        ],
      },
      {
        id: '07003',
        proFieldId: '223427',
        topicName: 'Infection Control',
        description: 'Preventing the spread of infection in care settings.',
        createdAt: CREATED_AT,
        questions: [
          { id: 'q91', question: 'What is the most effective way to prevent infection spread?', answer: 'Proper hand hygiene.' },
          { id: 'q92', question: "What's the difference between sterilization and disinfection?", answer: 'Sterilization kills all microorganisms; disinfection reduces them to a safe level.' },
          { id: 'q93', question: 'What are standard precautions?', answer: 'Infection control practices used with all patients regardless of diagnosis.' },
          { id: 'q94', question: "What's PPE?", answer: 'Personal protective equipment — gloves, gowns, masks, and similar gear.' },
          { id: 'q95', question: 'What is a nosocomial infection?', answer: 'An infection acquired in a healthcare setting.' },
          { id: 'q96', question: 'What are isolation precautions used for?', answer: 'Preventing transmission of a known or suspected infectious agent.' },
        ],
      },
    ],
  },
  {
    id: '223428',
    name: 'Law',
    topics: [
      {
        id: '08001',
        proFieldId: '223428',
        topicName: 'Contract Law',
        description: 'What makes an agreement legally enforceable.',
        createdAt: CREATED_AT,
        questions: [
          { id: 'q97', question: 'What are the essential elements of a valid contract?', answer: 'Offer, acceptance, consideration, and mutual intent to be bound.' },
          { id: 'q98', question: 'What is consideration?', answer: 'Something of value exchanged between parties in a contract.' },
          { id: 'q99', question: 'What is a breach of contract?', answer: 'Failure to perform contractual obligations without legal excuse.' },
          { id: 'q100', question: "What's the difference between void and voidable contracts?", answer: 'A void contract is never legally valid; a voidable contract is valid but one party can cancel it.' },
          { id: 'q101', question: 'What is a condition precedent?', answer: 'An event that must occur before a contractual duty arises.' },
          { id: 'q102', question: 'What is "capacity" in contract law?', answer: 'The legal ability of a party to enter into a binding agreement.' },
        ],
      },
      {
        id: '08002',
        proFieldId: '223428',
        topicName: 'Constitutional Law',
        description: 'How government power is structured and limited.',
        createdAt: CREATED_AT,
        questions: [
          { id: 'q103', question: 'What is judicial review?', answer: "The courts' power to assess whether laws are constitutional." },
          { id: 'q104', question: 'What is separation of powers?', answer: 'Dividing government into branches (legislative, executive, judicial) to prevent abuse of power.' },
          { id: 'q105', question: 'What is due process?', answer: 'The guarantee of fair treatment through the judicial system.' },
          { id: 'q106', question: 'What is federalism?', answer: 'The division of power between national and state/local governments.' },
          { id: 'q107', question: 'What is the Bill of Rights?', answer: 'The first ten amendments protecting individual liberties (US).' },
          { id: 'q108', question: 'What is equal protection?', answer: 'The requirement that laws apply equally to all people.' },
        ],
      },
      {
        id: '08003',
        proFieldId: '223428',
        topicName: 'Legal Writing & Research',
        description: 'Structuring legal analysis and finding authority.',
        createdAt: CREATED_AT,
        questions: [
          { id: 'q109', question: 'What is IRAC?', answer: 'A framework for legal analysis: Issue, Rule, Application, Conclusion.' },
          { id: 'q110', question: 'What is a legal brief?', answer: 'A written document presenting arguments and legal authority to a court.' },
          { id: 'q111', question: 'What is a citation used for in legal writing?', answer: 'It references legal authority, such as cases or statutes, supporting an argument.' },
          { id: 'q112', question: 'What is precedent?', answer: 'A previous court decision used as authority for deciding similar cases.' },
          { id: 'q113', question: "What's the difference between primary and secondary legal sources?", answer: 'Primary sources are statutes and case law; secondary sources are commentary and analysis of the law.' },
          { id: 'q114', question: 'What is a memorandum of law?', answer: 'An internal document analyzing legal issues and predicting outcomes.' },
        ],
      },
    ],
  },
]

// ---------- Dummy streaks ----------
// Mirrors the `streak` table (streakId pk, topicId/userId/levelId fks). A
// handful of topics start with an active streak already assigned a level;
// the rest have none until the user sets one up.

export const initialStreaksData: Streak[] = [

]

// ---------- Dummy notes ----------
// Mirrors the `Note` table (topicId, noteBlob, createdAt). Left empty on
// purpose — the notes tab just needs the option to exist for now.

export const initialNotesData: Note[] = []