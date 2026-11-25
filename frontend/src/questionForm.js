import { choiceLetter } from './quizAttempt.js'

export const CHOICE_COUNT = 4
export const QUESTION_MAX = 500
export const CHOICE_MAX = 200

let newDraftCount = 0

function blankSavedChoice() {
  return { choiceId: null, choiceText: '', isCorrect: false }
}

function padChoices(list) {
  const padded = [...list]
  while (padded.length < CHOICE_COUNT) padded.push(blankSavedChoice())
  return padded
}

export function toDraft(question) {
  const server = padChoices(
    (question.choicesWithAnswers || []).map((choice) => ({
      choiceId: choice.choiceId,
      choiceText: choice.choiceText.trim(),
      isCorrect: choice.isCorrect,
    })),
  )
  const correct = server.findIndex((choice) => choice.isCorrect)
  const topicId = question.topic ? String(question.topic.topicId) : ''

  return {
    key: `question-${question.questionId}`,
    questionId: question.questionId,
    topicId,
    questionText: question.questionText,
    choices: server.map((choice) => ({ choiceId: choice.choiceId, choiceText: choice.choiceText })),
    correct: correct >= 0 ? correct : null,
    saved: { topicId, questionText: question.questionText.trim(), choices: server },
  }
}

export function newDraft() {
  newDraftCount += 1
  return {
    key: `new-${newDraftCount}`,
    questionId: null,
    topicId: '',
    questionText: '',
    choices: padChoices([]).map(() => ({ choiceId: null, choiceText: '' })),
    correct: null,
    saved: null,
  }
}

export function savedAfterCreate(draft) {
  return {
    topicId: draft.topicId,
    questionText: draft.questionText.trim(),
    choices: draft.choices.map(blankSavedChoice),
  }
}

export function questionChanged(draft) {
  if (!draft.saved) return true
  return draft.questionText.trim() !== draft.saved.questionText || draft.topicId !== draft.saved.topicId
}

export function choiceChanged(choiceId, choiceText, isCorrect, before) {
  if (choiceId === null || !before) return true
  return choiceText.trim() !== before.choiceText || isCorrect !== before.isCorrect
}

export function isDirty(draft) {
  if (questionChanged(draft)) return true
  return draft.choices.some((choice, index) =>
    choiceChanged(choice.choiceId, choice.choiceText, index === draft.correct, draft.saved.choices[index]),
  )
}

export function validateDraft(draft) {
  const errors = {}
  if (!draft.topicId) errors.topicId = 'Choose a topic.'
  if (!draft.questionText.trim()) errors.questionText = 'Enter the question.'
  if (draft.correct === null) errors.correct = 'Choose the correct answer.'
  draft.choices.forEach((choice, index) => {
    if (!choice.choiceText.trim()) errors[`choice${index}`] = `Enter choice ${choiceLetter(index)}.`
  })
  return errors
}

export function firstErrorId(draft, errors) {
  const order = ['topicId', 'questionText', 'correct', ...draft.choices.map((_, index) => `choice${index}`)]
  const key = order.find((name) => errors[name])
  if (!key) return null
  if (key === 'topicId' || key === 'questionText') return `field-${key}`
  if (key === 'correct') return 'choice-correct-0'
  return `choice-text-${key.slice('choice'.length)}`
}

export function toQuestionBody(draft, quizId) {
  return {
    questionText: draft.questionText.trim(),
    quiz: { quizId },
    topic: { topicId: Number(draft.topicId) },
  }
}

export function toChoiceBody(draft, index, questionId) {
  return {
    choiceText: draft.choices[index].choiceText.trim(),
    isCorrect: index === draft.correct,
    question: { questionId },
  }
}

export function choiceSaveOrder(draft) {
  const order = draft.choices.map((_, index) => index)
  const existingCorrect = draft.correct !== null && draft.choices[draft.correct].choiceId !== null
  if (!existingCorrect) return order
  return [draft.correct, ...order.filter((index) => index !== draft.correct)]
}

export function topicSelectOptions(topics) {
  return topics
    .map((topic) => ({ value: String(topic.topicId), label: topic.name }))
    .sort((a, b) => a.label.localeCompare(b.label))
}
