// Realistic demo content for the "Show sample quizzes" switch (off by default).
// It has the same shape as the backend's data. makeSampleData() returns fresh
// copies each time, so changes made while viewing samples are thrown away when
// the switch is turned off. Nothing here is ever sent to the server.

const DAY_MS = 24 * 60 * 60 * 1000

const teachers = [
  { userId: 1, fullName: 'Maria Santos', role: 'TEACHER' },
  { userId: 2, fullName: 'Daniel Okafor', role: 'TEACHER' },
  { userId: 3, fullName: 'Yuki Tanaka', role: 'TEACHER' },
  { userId: 4, fullName: 'Ana Lima', role: 'TEACHER' },
  { userId: 5, fullName: 'Omar Haddad', role: 'TEACHER' },
]

// Topic ids are picked so topics on the same quiz get different colors
const topics = [
  { topicId: 1, name: 'Algebra' },
  { topicId: 2, name: 'Biology' },
  { topicId: 3, name: 'History' },
  { topicId: 4, name: 'Spanish' },
  { topicId: 5, name: 'Chemistry' },
  { topicId: 6, name: 'Fractions' },
  { topicId: 9, name: 'Decimals' },
  { topicId: 10, name: 'Geometry' },
]

// questions: [topicId, how many]. daysAgo sets createdAt.
const quizzes = [
  {
    quizId: 1,
    title: 'Fractions & Decimals',
    description: 'Converting between fractions, decimals and percentages, with word problems.',
    timeLimitMin: 30,
    teacherId: 1,
    daysAgo: 2,
    questions: [[6, 8], [9, 4]],
  },
  {
    quizId: 2,
    title: 'Photosynthesis Basics',
    description: 'Light reactions, the Calvin cycle and why leaves are green.',
    timeLimitMin: 20,
    teacherId: 2,
    daysAgo: 4,
    questions: [[2, 7], [5, 3]],
  },
  {
    quizId: 3,
    title: 'World War II Timeline',
    description: 'Key events from 1939 to 1945, put in the right order.',
    timeLimitMin: 45,
    teacherId: 3,
    daysAgo: 9,
    questions: [[3, 10]],
  },
  {
    quizId: 4,
    title: 'Spanish Verbs: Present Tense',
    description: 'Regular -ar, -er and -ir verbs plus common irregulars like ser, estar and ir.',
    timeLimitMin: 15,
    teacherId: 4,
    daysAgo: 16,
    questions: [[4, 12]],
  },
  {
    quizId: 5,
    title: 'Algebra I Midterm Review',
    description: 'Linear equations, inequalities, slope and systems of equations.',
    timeLimitMin: 60,
    teacherId: 1,
    daysAgo: 1,
    questions: [[1, 9], [6, 3]],
  },
  {
    quizId: 6,
    title: 'Poetry Devices',
    description: 'Metaphor, simile, alliteration and assonance in modern poems.',
    timeLimitMin: 25,
    teacherId: 3,
    daysAgo: 0,
    questions: [], // no questions yet, so it shows as Draft
  },
]

// now: a timestamp (ms); sample dates are relative to it so "this week" has data
export function makeSampleData(now) {
  const teacherById = new Map(teachers.map((teacher) => [teacher.userId, teacher]))
  const topicById = new Map(topics.map((topic) => [topic.topicId, topic]))
  const questions = []

  const quizList = quizzes.map(({ teacherId, daysAgo, questions: plan, ...quiz }) => {
    const created = {
      ...quiz,
      teacher: { ...teacherById.get(teacherId) },
      // A few hours earlier on the day, so "today" isn't in the future
      createdAt: new Date(now - daysAgo * DAY_MS - 2 * 60 * 60 * 1000).toISOString(),
    }
    for (const [topicId, count] of plan) {
      const topic = topicById.get(topicId)
      for (let n = 1; n <= count; n += 1) {
        questions.push({
          questionId: questions.length + 1,
          questionText: `${topic.name} question ${n}`,
          quiz: { quizId: quiz.quizId },
          topic: { ...topic },
        })
      }
    }
    return created
  })

  return {
    quizzes: quizList,
    teachers: teachers.map((teacher) => ({ ...teacher })),
    topics: topics.map((topic) => ({ ...topic })),
    questions,
  }
}
