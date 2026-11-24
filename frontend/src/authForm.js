export const ROLES = ['STUDENT', 'TEACHER']

export const MIN_PASSWORD = 8

export const emptyLogin = { email: '', password: '' }

export const emptyRegister = { fullName: '', email: '', password: '', role: 'STUDENT', sectionId: '' }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function emailError(value) {
  const email = value.trim()
  if (!email) return 'Email is required.'
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email, like name@school.edu.'
  return ''
}

export function validateLogin(form) {
  const errors = {}
  const email = emailError(form.email)

  if (email) errors.email = email
  if (!form.password) errors.password = 'Password is required.'

  return errors
}

export function validateRegister(form, takenEmail) {
  const errors = {}
  const fullName = form.fullName.trim()
  const email = emailError(form.email)

  if (!fullName) errors.fullName = 'Full name is required.'
  else if (fullName.length < 2) errors.fullName = 'Full name must be at least 2 characters.'

  if (email) errors.email = email
  else if (takenEmail && form.email.trim().toLowerCase() === takenEmail.toLowerCase()) {
    errors.email = 'An account with this email already exists. Log in instead.'
  }

  if (!form.password) errors.password = 'Password is required.'
  else if (form.password.length < MIN_PASSWORD) {
    errors.password = `Password must be at least ${MIN_PASSWORD} characters.`
  }

  if (form.role === 'STUDENT' && !form.sectionId) errors.sectionId = 'Choose your section.'

  return errors
}

export function toRegisterBody(form) {
  return {
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    passwordHash: form.password,
    role: form.role,
    section: form.sectionId ? { sectionId: Number(form.sectionId) } : null,
  }
}

export function isEmailTaken(message) {
  return /already exists/i.test(message)
}

export function isValidUser(user) {
  return (
    typeof user === 'object' &&
    user !== null &&
    typeof user.userId === 'number' &&
    typeof user.fullName === 'string' &&
    ROLES.includes(user.role)
  )
}

export function roleLabel(role) {
  if (role === 'TEACHER') return 'Teacher'
  if (role === 'STUDENT') return 'Student'
  return 'No role'
}

export function roleProblem(user, chosenRole) {
  if (user.role === chosenRole) return ''
  if (!ROLES.includes(user.role)) {
    return 'This account has no role yet, so it can’t log in. Ask your teacher to set one.'
  }
  const label = roleLabel(user.role)
  return `This is a ${label.toLowerCase()} account. Choose the ${label} tab to log in.`
}

export function initials(fullName) {
  const words = fullName.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  const last = words.length > 1 ? words[words.length - 1][0] : ''
  return (words[0][0] + last).toUpperCase()
}

export function firstName(fullName) {
  return fullName.trim().split(/\s+/)[0] || fullName
}

export function sectionOptions(sections) {
  return sections
    .map((section) => ({ value: String(section.sectionId), label: section.name }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }))
}
