import { filterAndSort, plural, topicAccent } from './quizData.js'

export function availableQuizViews(views) {
  const playable = views.filter((view) => view.questionCount > 0)
  return filterAndSort(playable, { search: '', teacherId: '', topicId: '', sort: 'newest' })
}

export function createAttempt(quiz, questions) {
  const totalSeconds = quiz.timeLimitMin * 60
  const startedAt = Date.now()
  return { quiz, questions, totalSeconds, startedAt, deadline: startedAt + totalSeconds * 1000 }
}

function localDateTime(time) {
  const date = new Date(time)
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  return `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function toAttemptBody(attempt, answers, studentId) {
  return {
    quiz: { quizId: attempt.quiz.quizId },
    student: { userId: studentId },
    startedAt: localDateTime(attempt.startedAt),
    answers: attempt.questions.map((question) => {
      const choiceId = answers[question.questionId]
      return {
        question: { questionId: question.questionId },
        choice: choiceId == null ? null : { choiceId },
      }
    }),
  }
}

export function answerStatus(answer) {
  if (answer.correct) return 'correct'
  return answer.choice ? 'wrong' : 'unanswered'
}

export function resultSummary(result) {
  const answers = result.answers || []
  const topics = new Map()
  let wrong = 0
  let unanswered = 0

  for (const answer of answers) {
    const status = answerStatus(answer)
    if (status === 'wrong') wrong += 1
    if (status === 'unanswered') unanswered += 1

    const topic = answer.question?.topic
    if (!topic) continue
    const current = topics.get(topic.topicId) || { topicId: topic.topicId, name: topic.name, correct: 0, total: 0 }
    topics.set(topic.topicId, {
      ...current,
      correct: current.correct + (status === 'correct' ? 1 : 0),
      total: current.total + 1,
    })
  }

  const total = answers.length
  return {
    score: result.score,
    total,
    percent: total > 0 ? Math.round((result.score / total) * 100) : 0,
    wrong,
    unanswered,
    topics: [...topics.values()]
      .map((topic) => ({
        ...topic,
        accent: topicAccent(topic.topicId),
        percent: Math.round((topic.correct / topic.total) * 100),
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  }
}

export function resultMessage(percent) {
  if (percent === 100) return 'Perfect score! Every answer is correct.'
  if (percent >= 80) return 'Great work! Check the few you missed below.'
  if (percent >= 50) return 'Good effort. Review the questions you missed below.'
  return 'Keep practicing. The answers below show where to focus next.'
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
