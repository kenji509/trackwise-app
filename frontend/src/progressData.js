export const LEVELS = [
  { id: 'strong', label: 'Strong', min: 80, accent: 'mint' },
  { id: 'practice', label: 'Needs practice', min: 50, accent: 'sunny' },
  { id: 'weak', label: 'Weak', min: 0, accent: 'coral' },
]

export const TREND_LENGTH = 6
export const RECENT_LENGTH = 3
export const REVIEW_LENGTH = 2

export function levelFor(percent) {
  return LEVELS.find((level) => percent >= level.min)
}

export function levelThresholds() {
  return LEVELS.filter((level) => level.min > 0).map((level) => level.min)
}

export function percentOf(correct, total) {
  return total > 0 ? Math.round((correct / total) * 100) : 0
}

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

const shortDateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

function toDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDateTime(date) {
  return date ? dateTimeFormat.format(date) : ''
}

export function formatShortDate(date) {
  return date ? shortDateFormat.format(date) : ''
}

export function attemptView(attempt) {
  const total = (attempt.answers || []).length
  const percent = percentOf(attempt.score, total)
  return {
    attemptId: attempt.attemptId,
    quizId: attempt.quiz?.quizId ?? null,
    title: attempt.quiz?.title || 'Quiz',
    submittedAt: toDate(attempt.submittedAt),
    score: attempt.score,
    total,
    percent,
    level: levelFor(percent),
  }
}

function newestFirst(a, b) {
  const aTime = a.submittedAt ? a.submittedAt.getTime() : 0
  const bTime = b.submittedAt ? b.submittedAt.getTime() : 0
  return bTime - aTime || b.attemptId - a.attemptId
}

export function historyViews(attempts) {
  return attempts.map(attemptView).sort(newestFirst)
}

function byStrength(a, b) {
  return b.percent - a.percent || b.asked - a.asked || a.name.localeCompare(b.name)
}

export function buildProgress(attempts) {
  const views = historyViews(attempts)
  const graded = views.filter((view) => view.total > 0)
  const topics = new Map()

  for (const attempt of attempts) {
    for (const answer of attempt.answers || []) {
      const topic = answer.question?.topic
      if (!topic) continue
      const current = topics.get(topic.topicId) || {
        topicId: topic.topicId,
        name: topic.name,
        correct: 0,
        asked: 0,
        quizzes: new Set(),
      }
      current.asked += 1
      if (answer.correct) current.correct += 1
      if (attempt.quiz?.title) current.quizzes.add(attempt.quiz.title)
      topics.set(topic.topicId, current)
    }
  }

  const topicList = [...topics.values()]
    .map((topic) => {
      const percent = percentOf(topic.correct, topic.asked)
      return { ...topic, quizzes: [...topic.quizzes].sort(), percent, level: levelFor(percent) }
    })
    .sort(byStrength)

  const averagePercent = graded.length
    ? Math.round(graded.reduce((sum, view) => sum + (view.score / view.total) * 100, 0) / graded.length)
    : null

  const needsPractice = [...topicList].reverse().filter((topic) => topic.level.id !== 'strong')

  const trend = graded
    .slice(0, TREND_LENGTH)
    .reverse()
    .map((view) => ({ ...view, number: graded.length - graded.indexOf(view) }))

  return {
    views,
    quizzesTaken: views.length,
    averagePercent,
    topics: topicList,
    strongest: topicList.find((topic) => topic.level.id === 'strong') || null,
    needsPractice: needsPractice[0] || null,
    practice: needsPractice.slice(0, REVIEW_LENGTH),
    trend,
    recent: views.slice(0, RECENT_LENGTH),
  }
}

// Newest score (percent) per quiz id, for the Available Quizzes cards
export function lastScores(attempts) {
  const scores = new Map()
  for (const view of historyViews(attempts)) {
    if (view.quizId !== null && !scores.has(view.quizId)) scores.set(view.quizId, view.percent)
  }
  return scores
}
