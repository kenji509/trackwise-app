// Turns backend data into what the Quizzes page shows.
// Everything here is pure (same input, same output): no fetching, no React state.
// The page calls these during render, so nothing derived is stored in state.

// Card and topic colors from design-system/trackwise/MASTER.md (classes .accent-<name> in index.css)
export const ACCENTS = ['coral', 'sunny', 'mint', 'grape']

const DAY_MS = 24 * 60 * 60 * 1000

// A topic keeps the same color on every page: chosen from its id
export function topicAccent(topicId) {
  const count = ACCENTS.length
  return ACCENTS[((topicId % count) + count) % count]
}

function parseDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

// One "view" per quiz, combining the quiz with its questions:
// { quiz, questionCount, topics: [{ topicId, name, accent, count }], accent, status, createdAt }
// - topics: most-used first
// - accent: color of the most-used topic (primary when there are no questions)
// - status: 'published' when the quiz has questions, otherwise 'draft'
export function buildQuizViews(quizzes, questions) {
  const byQuiz = new Map()

  for (const question of questions) {
    const quizId = question.quiz?.quizId
    if (quizId == null) continue

    if (!byQuiz.has(quizId)) byQuiz.set(quizId, { count: 0, topics: new Map() })
    const entry = byQuiz.get(quizId)
    entry.count += 1

    const topic = question.topic
    if (topic) {
      const current = entry.topics.get(topic.topicId) || { topicId: topic.topicId, name: topic.name, count: 0 }
      entry.topics.set(topic.topicId, { ...current, count: current.count + 1 })
    }
  }

  return quizzes.map((quiz) => {
    const entry = byQuiz.get(quiz.quizId)
    const topics = entry
      ? [...entry.topics.values()]
          .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
          .map((topic) => ({ ...topic, accent: topicAccent(topic.topicId) }))
      : []
    const questionCount = entry ? entry.count : 0

    return {
      quiz,
      questionCount,
      topics,
      accent: topics[0]?.accent ?? 'primary',
      status: questionCount > 0 ? 'published' : 'draft',
      createdAt: parseDate(quiz.createdAt),
    }
  })
}

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'title', label: 'Title A–Z' },
  { value: 'time', label: 'Shortest time limit' },
]

function byNewest(a, b) {
  const aTime = a.createdAt ? a.createdAt.getTime() : 0
  const bTime = b.createdAt ? b.createdAt.getTime() : 0
  return bTime - aTime || b.quiz.quizId - a.quiz.quizId
}

function byTitle(a, b) {
  return a.quiz.title.localeCompare(b.quiz.title, undefined, { sensitivity: 'base' })
}

const sorters = {
  newest: byNewest,
  title: byTitle,
  time: (a, b) => a.quiz.timeLimitMin - b.quiz.timeLimitMin || byTitle(a, b),
}

// Search (title, description, topic names), teacher and topic filters, then sort.
// teacherId / topicId are strings from <select>; '' means "all".
export function filterAndSort(views, { search, teacherId, topicId, sort }) {
  const query = search.trim().toLowerCase()

  const visible = views.filter((view) => {
    const { quiz, topics } = view
    if (teacherId && String(quiz.teacher?.userId) !== teacherId) return false
    if (topicId && !topics.some((topic) => String(topic.topicId) === topicId)) return false
    if (!query) return true
    return (
      quiz.title.toLowerCase().includes(query) ||
      (quiz.description || '').toLowerCase().includes(query) ||
      topics.some((topic) => topic.name.toLowerCase().includes(query))
    )
  })

  return visible.sort(sorters[sort] || byNewest)
}

// Numbers for the stats row. now: a timestamp (ms) used for "this week".
export function quizStats(views, now) {
  const weekAgo = now - 7 * DAY_MS
  const topicTotals = new Map()
  let questionTotal = 0

  for (const view of views) {
    questionTotal += view.questionCount
    for (const topic of view.topics) {
      const current = topicTotals.get(topic.topicId) || { ...topic, count: 0 }
      topicTotals.set(topic.topicId, { ...current, count: current.count + topic.count })
    }
  }

  const topTopic =
    [...topicTotals.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))[0] || null

  return {
    quizCount: views.length,
    publishedCount: views.filter((view) => view.status === 'published').length,
    draftCount: views.filter((view) => view.status === 'draft').length,
    questionTotal,
    thisWeek: views.filter((view) => view.createdAt && view.createdAt.getTime() >= weekAgo).length,
    topTopic,
    topicCount: topicTotals.size,
  }
}

// Options for the teacher and topic filters, with how many quizzes each has.
// Entries with no quizzes are kept (so the list is complete) but disabled.
export function teacherOptions(teachers, views) {
  return teachers
    .map((teacher) => ({
      value: String(teacher.userId),
      label: teacher.fullName,
      count: views.filter((view) => view.quiz.teacher?.userId === teacher.userId).length,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

export function topicOptions(topics, views) {
  // Topics from the topic list, plus any that only appear on questions
  const all = new Map(topics.map((topic) => [topic.topicId, topic.name]))
  for (const view of views) for (const topic of view.topics) all.set(topic.topicId, topic.name)

  return [...all.entries()]
    .map(([topicId, name]) => ({
      value: String(topicId),
      label: name,
      count: views.filter((view) => view.topics.some((topic) => topic.topicId === topicId)).length,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export function formatDate(date) {
  return date ? dateFormat.format(date) : ''
}

export function greeting(now) {
  const hour = new Date(now).getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function plural(count, word, wordPlural = `${word}s`) {
  return `${count} ${count === 1 ? word : wordPlural}`
}
