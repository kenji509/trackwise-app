// Helpers for the add/edit quiz form.
// Form values are strings because they come from inputs.

export const emptyForm = { title: '', description: '', timeLimitMin: '', teacherId: '' }

// Backend quiz -> form values
export function toForm(quiz) {
  return {
    title: quiz.title,
    description: quiz.description || '',
    timeLimitMin: String(quiz.timeLimitMin),
    teacherId: String(quiz.teacher.userId),
  }
}

// Form values -> request body the backend expects
export function toRequestBody(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    timeLimitMin: Number(form.timeLimitMin),
    teacher: { userId: Number(form.teacherId) },
  }
}

// Returns an object like { title: 'Title is required.' }; empty means valid
export function validateQuiz(form) {
  const errors = {}
  const title = form.title.trim()
  const minutes = Number(form.timeLimitMin)

  if (!title) errors.title = 'Title is required.'
  else if (title.length < 3) errors.title = 'Title must be at least 3 characters.'

  if (form.timeLimitMin === '') errors.timeLimitMin = 'Time limit is required.'
  else if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
    errors.timeLimitMin = 'Enter a whole number from 1 to 180.'
  }

  if (!form.teacherId) errors.teacherId = 'Choose a teacher.'

  return errors
}
