// Calls to the Spring Boot backend (http://localhost:8080).
// Paths are relative: the Vite dev server forwards them (see vite.config.js).

const SERVER_DOWN = "Can't reach the server. Make sure the backend is running on port 8080."

// Sends a request and returns the reply (JSON or text).
// Throws an Error with a readable message when something goes wrong.
async function request(path, options = {}) {
  let response
  try {
    response = await fetch(path, {
      ...options,
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    })
  } catch {
    throw new Error(SERVER_DOWN)
  }

  const isJson = (response.headers.get('Content-Type') || '').includes('application/json')
  const data = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    // Backend errors look like { status, message }
    if (data.message) throw new Error(data.message)
    throw new Error(response.status >= 500 ? SERVER_DOWN : `Request failed (${response.status}).`)
  }
  return data
}

export function getQuizzes() {
  return request('/quiz/api/getAllQuizzes')
}

export function createQuiz(quiz) {
  return request('/quiz/api/postNewQuiz', { method: 'POST', body: JSON.stringify(quiz) })
}

export function updateQuiz(id, quiz) {
  return request(`/quiz/api/putQuiz?id=${id}`, { method: 'PUT', body: JSON.stringify(quiz) })
}

export function deleteQuiz(id) {
  return request(`/quiz/api/deleteQuiz/${id}`, { method: 'DELETE' })
}

// Only users with the TEACHER role can own a quiz
export async function getTeachers() {
  const users = await request('/user/api/getAllUsers')
  return users.filter((user) => user.role === 'TEACHER')
}

// Every question, each with its quiz and topic: { questionId, questionText, quiz, topic }.
// The Quizzes page uses it for question counts, topic chips and Draft/Published.
export function getQuestions() {
  return request('/question/api/getAllQuestions')
}

// All topics: { topicId, name }
export function getTopics() {
  return request('/topic/api/getAllTopics')
}

export function login(email, password) {
  return request('/user/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, passwordHash: password }),
  })
}

export function register(user) {
  return request('/user/api/postNewUser', { method: 'POST', body: JSON.stringify(user) })
}

export function getSections() {
  return request('/section/api/getAllSections')
}
