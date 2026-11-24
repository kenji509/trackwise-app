import { filterAndSort, plural } from './quizData.js'

export function availableQuizViews(views) {
  const playable = views.filter((view) => view.questionCount > 0)
  return filterAndSort(playable, { search: '', teacherId: '', topicId: '', sort: 'newest' })
}

export function createAttempt(quiz, questions) {
  const totalSeconds = quiz.timeLimitMin * 60
  return { quiz, questions, totalSeconds, deadline: Date.now() + totalSeconds * 1000 }
}

export function choiceLetter(index) {
  return String.fromCharCode(65 + index)
}

export function secondsUntil(deadline, now) {
  return Math.max(0, Math.ceil((deadline - now) / 1000))
}

function pad(value) {
  return String(value).padStart(2, '0')
}

export function formatClock(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`
}

export function spokenDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const parts = []
  if (minutes > 0) parts.push(plural(minutes, 'minute'))
  if (seconds > 0 || minutes === 0) parts.push(plural(seconds, 'second'))
  return parts.join(' ')
}

export function timerLevel(seconds, totalSeconds) {
  if (seconds <= 60) return 'low'
  if (seconds <= 300 && totalSeconds > 300) return 'warn'
  return 'ok'
}

export function timerWarning(level) {
  if (level === 'low') return 'Less than 1 minute left.'
  if (level === 'warn') return '5 minutes or less left.'
  return ''
}

export function questionState(question, answers, marked) {
  return {
    answered: answers[question.questionId] != null,
    marked: Boolean(marked[question.questionId]),
  }
}

export function navigatorStatus(state) {
  if (state.marked) return 'marked'
  return state.answered ? 'answered' : 'unanswered'
}

export function navigatorLabel(number, state) {
  return [
    `Question ${number}`,
    state.answered ? 'answered' : 'not answered',
    state.marked ? 'marked for review' : '',
  ]
    .filter(Boolean)
    .join(', ')
}

export function attemptSummary(questions, answers, marked) {
  const unanswered = []
  let markedCount = 0

  questions.forEach((question, index) => {
    if (answers[question.questionId] == null) unanswered.push(index + 1)
    if (marked[question.questionId]) markedCount += 1
  })

  return {
    total: questions.length,
    answeredCount: questions.length - unanswered.length,
    unanswered,
    markedCount,
  }
}

const numberList = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' })

export function listNumbers(numbers) {
  return numberList.format(numbers.map(String))
}
