import { StrictMode, useEffect, useEffectEvent, useState } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './components/layout/Header.jsx'
import SideBar from './components/layout/SideBar.jsx'
import SideSection from './components/layout/SideSection.jsx'
import SideBtn from './components/layout/SideBtn.jsx'
import MainContent from './components/layout/MainContent.jsx'
import SampleNotice from './components/teacher/SampleNotice.jsx'
import QuizStats from './components/teacher/QuizStats.jsx'
import Quizzes from './components/teacher/Quizzes.jsx'
import QuizToolbar from './components/teacher/QuizToolbar.jsx'
import SampleSwitch from './components/teacher/SampleSwitch.jsx'
import QuizCard from './components/teacher/QuizCard.jsx'
import QuizForm from './components/teacher/QuizForm.jsx'
import FormField from './components/shared/FormField.jsx'
import FormButtons from './components/teacher/FormButtons.jsx'
import Toast from './components/shared/Toast.jsx'
import AuthLayout from './components/layout/AuthLayout.jsx'
import AuthForm from './components/auth/AuthForm.jsx'
import RoleTabs from './components/auth/RoleTabs.jsx'
import RoleChoice from './components/auth/RoleChoice.jsx'
import AvailableQuizzes from './components/student/AvailableQuizzes.jsx'
import StudentQuizCard from './components/student/StudentQuizCard.jsx'
import QuizLayout from './components/layout/QuizLayout.jsx'
import QuizTimer from './components/student/QuizTimer.jsx'
import QuestionCard from './components/student/QuestionCard.jsx'
import QuestionNavigator from './components/student/QuestionNavigator.jsx'
import ConfirmDialog from './components/shared/ConfirmDialog.jsx'
import QuizResults from './components/student/QuizResults.jsx'
import ResultStatus from './components/student/ResultStatus.jsx'
import PageBackdrop from './components/layout/PageBackdrop.jsx'
import QuestionManager from './components/teacher/QuestionManager.jsx'
import QuestionList from './components/teacher/QuestionList.jsx'
import QuestionEditor from './components/teacher/QuestionEditor.jsx'
import MyProgress from './components/student/MyProgress.jsx'
import ProgressSummary from './components/student/ProgressSummary.jsx'
import QuizHistory from './components/student/QuizHistory.jsx'
import * as api from './api.js'
import { emptyForm, toForm, toRequestBody, validateQuiz } from './quizForm.js'
import {
  choiceChanged,
  choiceSaveOrder,
  firstErrorId,
  isDirty,
  newDraft,
  questionChanged,
  savedAfterCreate,
  toChoiceBody,
  toDraft,
  toQuestionBody,
  topicSelectOptions,
  validateDraft,
} from './questionForm.js'
import {
  emptyLogin,
  emptyRegister,
  firstName,
  isEmailTaken,
  isValidUser,
  roleProblem,
  sectionOptions,
  toRegisterBody,
  validateLogin,
  validateRegister,
} from './authForm.js'
import {
  attemptSummary,
  availableQuizViews,
  createAttempt,
  listNumbers,
  secondsUntil,
  toAttemptBody,
} from './quizAttempt.js'
import {
  SORT_OPTIONS,
  buildQuizViews,
  filterAndSort,
  greeting,
  plural,
  quizStats,
  teacherOptions,
  topicAccent,
  topicOptions,
} from './quizData.js'
import { makeSampleData } from './sampleData.js'
import { buildProgress, historyViews, lastScores } from './progressData.js'

// Navigation. Quizzes is the only built page; items marked demo are
// placeholders for the demo: clicking them does nothing (see SideBtn).
const navSections = [
  {
    label: 'Teaching',
    items: [
      { id: 'dashboard', label: 'Dashboard', demo: true },
      { id: 'quizzes', label: 'Quizzes' },
      { id: 'questions', label: 'Questions', demo: true },
      { id: 'topics', label: 'Topics', demo: true },
    ],
  },
]

// Per-browser preferences. Storage can be blocked (private mode), so every
// access is guarded and the app works without it.
const NAV_KEY = 'trackwise:nav-collapsed'
const VIEW_KEY = 'trackwise:view'
const USER_KEY = 'trackwise:user'

function readStored(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStored(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage blocked: the choice still applies until the page reloads
  }
}

function removeStored(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

function readStoredUser() {
  try {
    const user = JSON.parse(readStored(USER_KEY))
    return isValidUser(user) ? user : null
  } catch {
    return null
  }
}

function focusById(id) {
  document.getElementById(id)?.focus()
}

const RESULT_HASH = /^#results\/(\d+)$/

function readResultId() {
  const match = window.location.hash.match(RESULT_HASH)
  return match ? Number(match[1]) : null
}

function showResultUrl(attemptId) {
  window.history.pushState(null, '', `#results/${attemptId}`)
}

const STUDENT_PAGES = ['progress', 'history']

function readStudentPage() {
  const page = window.location.hash.slice(1)
  return STUDENT_PAGES.includes(page) ? page : 'quizzes'
}

// Student URL: '' or #quizzes, #progress, #history, #results/<id>. Any other
// hash (like #main from the skip link) is not a route and returns null.
function readStudentRoute() {
  const resultId = readResultId()
  if (resultId !== null) return { page: null, resultId }
  const hash = window.location.hash
  if (hash === '' || hash === '#' || hash === '#quizzes') return { page: 'quizzes', resultId: null }
  if (STUDENT_PAGES.includes(hash.slice(1))) return { page: hash.slice(1), resultId: null }
  return null
}

function showPageUrl(page) {
  const url = page === 'quizzes' ? window.location.pathname + window.location.search : `#${page}`
  window.history.pushState(null, '', url)
}

// "Now" for the greeting and "this week". Set when data arrives (not during
// render, which must stay pure); this is the starting value.
const PAGE_LOADED_AT = Date.now()

// App lives in main.jsx so every component is imported and rendered here.
// Edits to this file trigger a full page reload instead of a hot update.
// eslint-disable-next-line react-refresh/only-export-components
function App({ user, onLogout }) {
  // Data (from the backend, or sample data when the switch is on)
  const [quizzes, setQuizzes] = useState([])
  const [teachers, setTeachers] = useState([])
  const [questions, setQuestions] = useState([])
  const [topics, setTopics] = useState([])
  const [now, setNow] = useState(PAGE_LOADED_AT)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  // Bumping this number runs the load effect again ("Try again" button)
  const [loadAttempt, setLoadAttempt] = useState(0)
  // Sample quizzes: off by default, not remembered between visits
  const [sampleMode, setSampleMode] = useState(false)

  // List controls
  const [search, setSearch] = useState('')
  const [teacherFilter, setTeacherFilter] = useState('')
  const [topicFilter, setTopicFilter] = useState('')
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState(() => (readStored(VIEW_KEY) === 'list' ? 'list' : 'grid'))
  const [navCollapsed, setNavCollapsed] = useState(() => readStored(NAV_KEY) === '1')

  // Form: null = closed, 'new' = adding, a number = quizId being edited
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  // Fields the user has left; errors only show for these
  const [touched, setTouched] = useState({})
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  // True while asking "Discard your unsaved changes?"
  const [confirmingDiscard, setConfirmingDiscard] = useState(false)

  // Delete: which quiz is being deleted, and the last failure as { quizId, message }
  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  // Success message: { id, title, description } or null
  const [toast, setToast] = useState(null)

  // Manage questions: the quiz being edited (null = closed) and one draft per question
  const [managedQuiz, setManagedQuiz] = useState(null)
  const [drafts, setDrafts] = useState([])
  const [draftTopics, setDraftTopics] = useState([])
  const [draftIndex, setDraftIndex] = useState(0)
  const [draftsLoading, setDraftsLoading] = useState(false)
  const [draftsError, setDraftsError] = useState('')
  const [draftsLoad, setDraftsLoad] = useState(0)
  // Drafts that failed a save attempt; only these show their errors
  const [checkedDrafts, setCheckedDrafts] = useState({})
  const [savingDrafts, setSavingDrafts] = useState(false)
  const [draftSaveError, setDraftSaveError] = useState('')
  // 'delete' | 'leave' | null
  const [draftConfirm, setDraftConfirm] = useState(null)

  const managedQuizId = managedQuiz ? managedQuiz.quizId : null
  const unsavedDrafts = drafts.filter(isDirty)
  const guardDrafts = managedQuiz !== null && unsavedDrafts.length > 0

  useEffect(() => {
    if (managedQuizId === null) return
    let ignore = false

    Promise.all([api.getQuestionsByQuiz(managedQuizId), api.getTopics()])
      .then(([questionList, topicList]) => {
        if (ignore) return
        setDrafts(questionList.map(toDraft))
        setDraftTopics(topicList)
      })
      .catch((error) => {
        if (!ignore) setDraftsError(error.message)
      })
      .finally(() => {
        if (!ignore) setDraftsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [managedQuizId, draftsLoad])

  useEffect(() => {
    if (!managedQuiz) return
    document.title = `Questions: ${managedQuiz.title} – TrackWise`
    return () => {
      document.title = 'Quizzes – TrackWise'
    }
  }, [managedQuiz])

  useEffect(() => {
    if (!guardDrafts) return

    function warnBeforeLeaving(event) {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', warnBeforeLeaving)
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving)
  }, [guardDrafts])

  // Load everything from the backend when the page opens, on "Try again",
  // and when sample quizzes are switched off
  useEffect(() => {
    if (sampleMode) return
    let ignore = false // skip the result if this effect was cleaned up

    Promise.all([api.getQuizzes(), api.getTeachers(), api.getQuestions(), api.getTopics()])
      .then(([quizList, teacherList, questionList, topicList]) => {
        if (ignore) return
        setQuizzes(quizList)
        setTeachers(teacherList)
        setQuestions(questionList)
        setTopics(topicList)
        setNow(Date.now())
      })
      .catch((error) => {
        if (!ignore) setLoadError(error.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [loadAttempt, sampleMode])

  function retryLoad() {
    setLoading(true)
    setLoadError('')
    setLoadAttempt(loadAttempt + 1)
  }

  function clearFilters() {
    setSearch('')
    setTeacherFilter('')
    setTopicFilter('')
  }

  // Swap between backend data and sample data. Filters are cleared because
  // teacher/topic ids differ between the two.
  function changeSampleMode(on) {
    clearFilters()
    setDeleteError(null)
    setLoadError('')
    setSampleMode(on)

    if (on) {
      const time = Date.now()
      const sample = makeSampleData(time)
      setQuizzes(sample.quizzes)
      setTeachers(sample.teachers)
      setQuestions(sample.questions)
      setTopics(sample.topics)
      setNow(time)
      setLoading(false)
    } else {
      // The load effect runs again because sampleMode changed
      setQuizzes([])
      setTeachers([])
      setQuestions([])
      setTopics([])
      setLoading(true)
    }
  }

  function toggleNav() {
    const next = !navCollapsed
    setNavCollapsed(next)
    writeStored(NAV_KEY, next ? '1' : '0')
  }

  function changeView(next) {
    setView(next)
    writeStored(VIEW_KEY, next)
  }

  // A new id restarts the toast (timer and entrance) even when one is showing
  function showToast(title, description) {
    setToast((current) => ({ id: (current?.id ?? 0) + 1, title, description }))
  }

  // ===== Derived data (computed during render, never stored) =====
  const items = buildQuizViews(quizzes, questions)
  const visibleItems = filterAndSort(items, {
    search,
    teacherId: teacherFilter,
    topicId: topicFilter,
    sort,
  })
  const stats = quizStats(items, now)
  const teacherChoices = teacherOptions(teachers, items)
  const topicChoices = topicOptions(topics, items)

  // symbol + tone: the small outlined symbol at each cell's top right (QuizStats)
  const statTiles = [
    {
      id: 'quizzes',
      label: 'Quizzes',
      symbol: 'clipboard',
      tone: 'blue',
      value: stats.quizCount,
      helper: `${stats.publishedCount} published, ${plural(stats.draftCount, 'draft')}`,
    },
    { id: 'questions', label: 'Questions', symbol: 'question', tone: 'sunny', value: stats.questionTotal },
    { id: 'week', label: 'New this week', symbol: 'sparkle', tone: 'mint', value: stats.thisWeek },
    {
      id: 'topic',
      label: 'Most-used topic',
      symbol: 'chart',
      tone: 'grape',
      value: stats.topTopic ? (
        <span className={`topic-chip accent-${stats.topTopic.accent}`}>{stats.topTopic.name}</span>
      ) : (
        '—'
      ),
      helper: stats.topTopic ? plural(stats.topTopic.count, 'question') : 'No questions yet',
    },
  ]

  // The strip below already shows the counts, so the banner only speaks up while loading or on errors
  let heroSummary = ''
  if (loading) heroSummary = 'Loading your quizzes…'
  if (loadError) heroSummary = 'Your quizzes will appear here once the server is reachable.'

  const isFiltered = search.trim() !== '' || teacherFilter !== '' || topicFilter !== ''
  let countText = plural(items.length, 'quiz', 'quizzes')
  if (isFiltered) countText = `Showing ${visibleItems.length} of ${countText}`
  if (loading) countText = 'Loading quizzes…'

  const activeFilters = []
  if (search.trim()) {
    activeFilters.push({ key: 'search', label: `Search: “${search.trim()}”`, onRemove: () => setSearch('') })
  }
  if (teacherFilter) {
    const teacher = teacherChoices.find((option) => option.value === teacherFilter)
    activeFilters.push({
      key: 'teacher',
      label: `Teacher: ${teacher ? teacher.label : 'Unknown'}`,
      onRemove: () => setTeacherFilter(''),
    })
  }
  if (topicFilter) {
    const topic = topicChoices.find((option) => option.value === topicFilter)
    activeFilters.push({
      key: 'topic',
      label: `Topic: ${topic ? topic.label : 'Unknown'}`,
      onRemove: () => setTopicFilter(''),
    })
  }

  // ===== Form =====
  const errors = validateQuiz(form)
  const isNew = editingId === 'new'
  const editingQuiz = quizzes.find((quiz) => quiz.quizId === editingId)
  const startForm = editingQuiz ? toForm(editingQuiz) : emptyForm
  const hasChanges = Object.keys(form).some((key) => form[key] !== startForm[key])

  let saveLabel = isNew ? 'Create quiz' : 'Save changes'
  if (saving) saveLabel = 'Saving…'

  const teacherFormOptions = teachers.map((teacher) => ({
    value: String(teacher.userId),
    label: teacher.fullName,
  }))

  // Same sections in the desktop sidebar and the mobile drawer
  const navigation = navSections.map((section) => (
    <SideSection key={section.label} label={section.label}>
      {section.items.map((item) => (
        <SideBtn
          key={item.id}
          icon={item.id}
          label={item.label}
          active={item.id === 'quizzes'}
          demo={item.demo}
        />
      ))}
    </SideSection>
  ))

  function openForm(quiz) {
    setEditingId(quiz ? quiz.quizId : 'new')
    setForm(quiz ? toForm(quiz) : emptyForm)
    setTouched({})
    setFormError('')
    setConfirmingDiscard(false)
  }

  function closeForm() {
    setConfirmingDiscard(false)
    setEditingId(null)
  }

  // Cancel button, ✕ button and Esc all come here.
  // With unsaved edits, ask first instead of throwing them away.
  function cancelForm() {
    if (saving) return
    if (confirmingDiscard) {
      // Esc while asking = keep editing; put focus back on Cancel
      flushSync(() => setConfirmingDiscard(false))
      document.getElementById('form-cancel').focus()
      return
    }
    if (hasChanges) {
      setConfirmingDiscard(true)
      return
    }
    closeForm()
  }

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function touchField(event) {
    setTouched({ ...touched, [event.target.name]: true })
  }

  // Sample mode: build the saved quiz locally instead of calling the server
  function saveSampleQuiz(body) {
    const teacher = teachers.find((item) => item.userId === body.teacher.userId)
    if (isNew) {
      const nextId = Math.max(0, ...quizzes.map((quiz) => quiz.quizId)) + 1
      return { ...body, quizId: nextId, teacher, createdAt: new Date().toISOString() }
    }
    return { ...editingQuiz, ...body, teacher }
  }

  async function saveQuiz() {
    // Nothing changed while editing: nothing to send
    if (!isNew && !hasChanges) {
      closeForm()
      return
    }

    // Show every error and move focus to the first invalid field
    const firstError = Object.keys(errors)[0]
    if (firstError) {
      setTouched({ title: true, timeLimitMin: true, teacherId: true })
      document.getElementById(`field-${firstError}`).focus()
      return
    }

    setSaving(true)
    setFormError('')
    try {
      const body = toRequestBody(form)
      const note = sampleMode ? ' (sample, not saved to the server)' : ''
      // Use the "current" list inside setQuizzes: it may have changed while we waited
      if (isNew) {
        const created = sampleMode ? saveSampleQuiz(body) : await api.createQuiz(body)
        setQuizzes((current) => [created, ...current])
        showToast('Quiz created', created.title + note)
      } else {
        const updated = sampleMode ? saveSampleQuiz(body) : await api.updateQuiz(editingId, body)
        setQuizzes((current) => current.map((quiz) => (quiz.quizId === editingId ? updated : quiz)))
        showToast('Changes saved', updated.title + note)
      }
      closeForm()
    } catch (error) {
      setFormError(error.message)
    } finally {
      setSaving(false)
    }
  }

  async function removeQuiz(quiz) {
    setDeletingId(quiz.quizId)
    setDeleteError(null)
    try {
      if (!sampleMode) await api.deleteQuiz(quiz.quizId)
      setQuizzes((current) => current.filter((item) => item.quizId !== quiz.quizId))
      setQuestions((current) => current.filter((question) => question.quiz?.quizId !== quiz.quizId))
      showToast('Quiz deleted', quiz.title + (sampleMode ? ' (sample)' : ''))
      // The card is gone, so move keyboard focus somewhere sensible
      document.getElementById('quiz-search').focus()
    } catch (error) {
      setDeleteError({ quizId: quiz.quizId, message: error.message })
    } finally {
      setDeletingId(null)
    }
  }

  // ===== Manage questions =====
  function openManager(quiz) {
    flushSync(() => {
      setManagedQuiz(quiz)
      setDrafts([])
      setDraftIndex(0)
      setDraftsLoading(true)
      setDraftsError('')
      setCheckedDrafts({})
      setDraftSaveError('')
      setDraftConfirm(null)
    })
    window.scrollTo(0, 0)
    focusById('quiz-title')
  }

  // Question counts and topic chips on the quiz cards come from `questions`
  function closeManager() {
    flushSync(() => {
      setDraftConfirm(null)
      setManagedQuiz(null)
      setDrafts([])
    })
    window.scrollTo(0, 0)
    focusById('main')
    api
      .getQuestions()
      .then(setQuestions)
      .catch(() => {})
  }

  function leaveManager() {
    if (unsavedDrafts.length > 0) setDraftConfirm('leave')
    else closeManager()
  }

  function retryDrafts() {
    setDraftsLoading(true)
    setDraftsError('')
    setDraftsLoad(draftsLoad + 1)
  }

  function showDraft(index, moveFocus) {
    flushSync(() => setDraftIndex(index))
    if (moveFocus) focusById('question-editor-title')
  }

  function addDraft() {
    const draft = newDraft()
    flushSync(() => {
      setDrafts([...drafts, draft])
      setDraftIndex(drafts.length)
    })
    focusById('field-topicId')
  }

  function patchDraft(key, change) {
    setDrafts((current) => current.map((draft) => (draft.key === key ? change(draft) : draft)))
  }

  function changeDraftField(event) {
    const { name, value } = event.target
    patchDraft(drafts[draftIndex].key, (draft) => ({ ...draft, [name]: value }))
  }

  function changeChoiceText(index, value) {
    patchDraft(drafts[draftIndex].key, (draft) => ({
      ...draft,
      choices: draft.choices.map((choice, i) => (i === index ? { ...choice, choiceText: value } : choice)),
    }))
  }

  function changeCorrect(index) {
    patchDraft(drafts[draftIndex].key, (draft) => ({ ...draft, correct: index }))
  }

  async function deleteDraft() {
    const draft = drafts[draftIndex]
    const number = draftIndex + 1
    const remaining = drafts.length - 1
    flushSync(() => setDraftConfirm(null))
    try {
      if (draft.questionId !== null) await api.deleteQuestion(draft.questionId)
      flushSync(() => {
        setDrafts((current) => current.filter((item) => item.key !== draft.key))
        setDraftIndex((index) => Math.max(0, Math.min(index, remaining - 1)))
        setDraftSaveError('')
      })
      showToast(draft.questionId !== null ? 'Question deleted' : 'Question removed', `Question ${number}, ${managedQuiz.title}`)
      focusById(remaining > 0 ? 'question-editor-title' : 'question-list-add')
    } catch (error) {
      setDraftSaveError(`Couldn’t delete question ${number}. ${error.message}`)
    }
  }

  // Saves one question, then its choices. New choices are created in A–D order
  // because the server lists choices by id. When an existing choice becomes the
  // correct one it is sent first, so the question never has zero correct choices.
  // Each finished request is recorded right away, so a retry after a failure
  // only sends what is still missing.
  async function persistDraft(draft) {
    const quizId = managedQuiz.quizId
    let questionId = draft.questionId
    let saved = draft.saved
    const choiceIds = draft.choices.map((choice) => choice.choiceId)

    if (questionId === null) {
      const created = await api.createQuestion(toQuestionBody(draft, quizId))
      questionId = created.questionId
      saved = savedAfterCreate(draft)
      const createdId = questionId
      const snapshot = saved
      patchDraft(draft.key, (current) => ({ ...current, questionId: createdId, saved: snapshot }))
    } else if (questionChanged(draft)) {
      await api.updateQuestion(questionId, toQuestionBody(draft, quizId))
      saved = { ...saved, topicId: draft.topicId, questionText: draft.questionText.trim() }
      const snapshot = saved
      patchDraft(draft.key, (current) => ({ ...current, saved: snapshot }))
    }

    for (const index of choiceSaveOrder(draft)) {
      const body = toChoiceBody(draft, index, questionId)
      if (!choiceChanged(choiceIds[index], body.choiceText, body.isCorrect, saved.choices[index])) continue

      const result =
        choiceIds[index] === null ? await api.createChoice(body) : await api.updateChoice(choiceIds[index], body)
      choiceIds[index] = result.choiceId
      saved = {
        ...saved,
        choices: saved.choices.map((choice, i) =>
          i === index ? { choiceId: result.choiceId, choiceText: body.choiceText, isCorrect: body.isCorrect } : choice,
        ),
      }
      const snapshot = saved
      patchDraft(draft.key, (current) => ({
        ...current,
        saved: snapshot,
        choices: current.choices.map((choice, i) => (i === index ? { ...choice, choiceId: result.choiceId } : choice)),
      }))
    }
  }

  async function saveDrafts() {
    if (savingDrafts || draftsLoading || draftsError) return
    if (unsavedDrafts.length === 0) {
      setDraftSaveError('')
      showToast('Nothing to save', 'Every question is already saved.')
      return
    }

    // Show errors on every unsaved question that has them, then go to the first one
    const invalid = unsavedDrafts.filter((draft) => Object.keys(validateDraft(draft)).length > 0)
    if (invalid.length > 0) {
      const target = invalid[0]
      flushSync(() => {
        setCheckedDrafts((current) => ({ ...current, ...Object.fromEntries(invalid.map((draft) => [draft.key, true])) }))
        setDraftIndex(drafts.findIndex((draft) => draft.key === target.key))
        setDraftSaveError('')
      })
      focusById(firstErrorId(target, validateDraft(target)))
      return
    }

    setSavingDrafts(true)
    setDraftSaveError('')
    let failing = null
    try {
      for (const draft of unsavedDrafts) {
        failing = draft
        await persistDraft(draft)
      }
      setCheckedDrafts({})
      showToast('Quiz saved', `${plural(unsavedDrafts.length, 'question')} saved in ${managedQuiz.title}.`)
    } catch (error) {
      const number = drafts.findIndex((draft) => draft.key === failing.key) + 1
      setDraftSaveError(
        `Couldn’t save question ${number}. ${error.message} Your changes are still here, so you can try Save quiz again.`,
      )
    } finally {
      setSavingDrafts(false)
    }
  }

  if (managedQuiz) {
    const currentDraft = drafts[draftIndex] || null
    const currentIsSaved = currentDraft !== null && currentDraft.questionId !== null
    const draftErrors = currentDraft && checkedDrafts[currentDraft.key] ? validateDraft(currentDraft) : {}
    const questionItems = drafts.map((draft) => {
      const topic = draftTopics.find((item) => String(item.topicId) === draft.topicId)
      return {
        key: draft.key,
        text: draft.questionText.trim(),
        topic: topic ? { topicId: topic.topicId, name: topic.name, accent: topicAccent(topic.topicId) } : null,
        unsaved: isDirty(draft),
        invalid: Boolean(checkedDrafts[draft.key]) && Object.keys(validateDraft(draft)).length > 0,
      }
    })

    let managerState = 'ready'
    if (draftsLoading) managerState = 'loading'
    else if (draftsError) managerState = 'error'
    else if (drafts.length === 0) managerState = 'empty'

    let saveStatus = 'All changes saved'
    if (unsavedDrafts.length > 0) saveStatus = `${plural(unsavedDrafts.length, 'question')} with unsaved changes`
    if (savingDrafts) saveStatus = 'Saving…'
    if (managerState === 'loading' || managerState === 'error') saveStatus = ''

    return (
      <>
        <PageBackdrop calm />
        <QuizLayout
          title={managedQuiz.title}
          wide
          actions={
            <>
              <button type="button" className="btn btn-secondary quiz-layout__exit" onClick={leaveManager}>
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
                <span className="quiz-layout__exit-label">Back to Quizzes</span>
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={saveDrafts}
                disabled={managerState === 'loading' || managerState === 'error'}
              >
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 4h11l3 3v13H5z" />
                  <path d="M8 4v5h7V4M8 20v-6h8v6" />
                </svg>
                {savingDrafts ? 'Saving…' : 'Save quiz'}
              </button>
            </>
          }
        >
          <QuestionManager
            quiz={managedQuiz}
            state={managerState}
            loadError={draftsError}
            saveError={draftSaveError}
            onRetry={retryDrafts}
            onAdd={addDraft}
            list={
              <QuestionList
                items={questionItems}
                current={draftIndex}
                loading={managerState === 'loading'}
                emptyText={managerState === 'error' ? 'Questions couldn’t be loaded.' : undefined}
                status={saveStatus}
                busy={savingDrafts || managerState === 'error'}
                onSelect={(index) => showDraft(index, true)}
                onAdd={addDraft}
              />
            }
          >
            {currentDraft && (
              <QuestionEditor
                number={draftIndex + 1}
                total={drafts.length}
                draft={currentDraft}
                topicOptions={topicSelectOptions(draftTopics)}
                errors={draftErrors}
                busy={savingDrafts}
                onField={changeDraftField}
                onChoiceText={changeChoiceText}
                onCorrect={changeCorrect}
                onDelete={() => setDraftConfirm('delete')}
                onPrevious={() => showDraft(draftIndex - 1, false)}
                onNext={() => showDraft(draftIndex + 1, false)}
              />
            )}
          </QuestionManager>
        </QuizLayout>

        <ConfirmDialog
          open={draftConfirm === 'delete' && currentDraft !== null}
          title={currentIsSaved ? `Delete question ${draftIndex + 1}?` : `Remove question ${draftIndex + 1}?`}
          cancelLabel="Keep question"
          confirmLabel={currentIsSaved ? 'Delete question' : 'Remove question'}
          danger
          onConfirm={deleteDraft}
          onCancel={() => setDraftConfirm(null)}
        >
          {currentIsSaved ? (
            <>
              <p className="confirm-dialog__warning">
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                  <path d="M12 9v4M12 17h.01" />
                </svg>
                <span>Students’ saved answers to this question will also be deleted.</span>
              </p>
              <p>This can’t be undone.</p>
            </>
          ) : (
            <p>This question hasn’t been saved yet, so removing it doesn’t change anything else.</p>
          )}
        </ConfirmDialog>

        <ConfirmDialog
          open={draftConfirm === 'leave'}
          title="Leave without saving?"
          cancelLabel="Keep editing"
          confirmLabel="Leave without saving"
          danger
          onConfirm={closeManager}
          onCancel={() => setDraftConfirm(null)}
        >
          <p>
            {plural(unsavedDrafts.length, 'question')} {unsavedDrafts.length === 1 ? 'has' : 'have'} unsaved
            changes. If you leave now, those changes are lost.
          </p>
        </ConfirmDialog>

        <Toast toast={toast} onDismiss={() => setToast(null)} />
      </>
    )
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <PageBackdrop />

      <div className="app" data-nav={navCollapsed ? 'collapsed' : 'expanded'}>
        <SideBar collapsed={navCollapsed} onToggle={toggleNav} user={user} onLogout={onLogout}>
          {navigation}
        </SideBar>

        <div className="app__column">
          <Header user={user} onLogout={onLogout}>
            {navigation}
          </Header>

          <MainContent
            notice={sampleMode && <SampleNotice onTurnOff={() => changeSampleMode(false)} />}
            eyebrow={`${greeting(now)}, ${firstName(user.fullName)}`}
            title="Quizzes"
            summary={heroSummary}
            actionLabel="New quiz"
            actionDisabled={loading || loadError !== ''}
            onAction={() => openForm()}
          >
            {!loadError && <QuizStats items={statTiles} loading={loading} />}

            <Quizzes
              headerAction={<SampleSwitch checked={sampleMode} onChange={changeSampleMode} />}
              toolbar={
                <QuizToolbar
                  search={search}
                  onSearch={setSearch}
                  teacherId={teacherFilter}
                  teacherOptions={teacherChoices}
                  onTeacherChange={setTeacherFilter}
                  topicId={topicFilter}
                  topicOptions={topicChoices}
                  onTopicChange={setTopicFilter}
                  sort={sort}
                  sortOptions={SORT_OPTIONS}
                  onSortChange={setSort}
                  view={view}
                  onViewChange={changeView}
                  countText={countText}
                  activeFilters={activeFilters}
                  onClearAll={clearFilters}
                />
              }
              loading={loading}
              loadError={loadError}
              onRetry={retryLoad}
              total={items.length}
              shown={visibleItems.length}
              layout={view}
              onAdd={() => openForm()}
              onClearFilters={clearFilters}
              onShowSamples={sampleMode ? undefined : () => changeSampleMode(true)}
            >
              {visibleItems.map((item, index) => (
                <QuizCard
                  key={item.quiz.quizId}
                  item={item}
                  layout={view}
                  index={index}
                  deleting={deletingId === item.quiz.quizId}
                  deleteError={deleteError?.quizId === item.quiz.quizId ? deleteError.message : ''}
                  onEdit={() => openForm(item.quiz)}
                  onManage={sampleMode ? undefined : () => openManager(item.quiz)}
                  onDelete={() => removeQuiz(item.quiz)}
                />
              ))}
            </Quizzes>
          </MainContent>
        </div>
      </div>

      <QuizForm
        open={editingId !== null}
        title={isNew ? 'Add quiz' : 'Edit quiz'}
        error={formError}
        onSubmit={saveQuiz}
        onCancel={cancelForm}
        onClosed={closeForm}
      >
        <FormField
          label="Title"
          name="title"
          value={form.title}
          onChange={updateField}
          onBlur={touchField}
          error={touched.title && errors.title}
          maxLength={80}
          required
        />
        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={form.description}
          onChange={updateField}
          hint="Optional. Shown on the quiz card."
          maxLength={300}
        />
        <FormField
          label="Time limit (minutes)"
          name="timeLimitMin"
          type="number"
          value={form.timeLimitMin}
          onChange={updateField}
          onBlur={touchField}
          error={touched.timeLimitMin && errors.timeLimitMin}
          hint="From 1 to 180 minutes."
          min={1}
          max={180}
          step={1}
          inputMode="numeric"
          required
        />
        <FormField
          label="Teacher"
          name="teacherId"
          type="select"
          options={teacherFormOptions}
          value={form.teacherId}
          onChange={updateField}
          onBlur={touchField}
          error={touched.teacherId && errors.teacherId}
          hint={teachers.length === 0 ? 'No teachers found. Add a user with the TEACHER role first.' : ''}
          required
        />
        <FormButtons
          saveLabel={saveLabel}
          saving={saving}
          confirmingDiscard={confirmingDiscard}
          onCancel={cancelForm}
          onKeepEditing={() => setConfirmingDiscard(false)}
          onDiscard={closeForm}
        />
      </QuizForm>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  )
}

const studentNavSections = [
  {
    label: 'Learning',
    items: [
      { id: 'quizzes', label: 'Available Quizzes' },
      { id: 'progress', label: 'My Progress' },
      { id: 'history', label: 'Quiz History' },
    ],
  },
]

const STUDENT_PAGE_TITLES = { quizzes: 'Available Quizzes', progress: 'My Progress', history: 'Quiz History' }
const RESULT_BACK_LABELS = { progress: 'Back to My Progress', history: 'Back to Quiz History' }

// eslint-disable-next-line react-refresh/only-export-components
function StudentApp({ user, onLogout }) {
  const [quizzes, setQuizzes] = useState([])
  const [questions, setQuestions] = useState([])
  const [now, setNow] = useState(PAGE_LOADED_AT)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [navCollapsed, setNavCollapsed] = useState(() => readStored(NAV_KEY) === '1')
  const [startingId, setStartingId] = useState(null)
  const [startError, setStartError] = useState(null)
  const [attempt, setAttempt] = useState(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [marked, setMarked] = useState({})
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [confirming, setConfirming] = useState(null)
  const [finished, setFinished] = useState(null)
  const [submitError, setSubmitError] = useState('')
  const [result, setResult] = useState(null)
  const [resultId, setResultId] = useState(readResultId)
  const [resultError, setResultError] = useState('')
  const [resultLoad, setResultLoad] = useState(0)
  const [timedOutId, setTimedOutId] = useState(null)
  const [page, setPage] = useState(readStudentPage)
  const [resultOrigin, setResultOrigin] = useState(null)
  const [pastAttempts, setPastAttempts] = useState(null)
  const [attemptsError, setAttemptsError] = useState('')
  const [attemptsLoad, setAttemptsLoad] = useState(0)

  const taking = attempt !== null && finished === null
  const deadline = attempt ? attempt.deadline : 0
  const resultReady = result !== null && result.attemptId === resultId
  // Past attempts feed My Progress, Quiz History and the "Last score" line on
  // the Available Quizzes cards; they reload each time the student comes back.
  const needsAttempts = attempt === null && resultId === null
  const attemptsLoading = pastAttempts === null && attemptsError === ''

  let screenTitle = STUDENT_PAGE_TITLES[page]
  if (resultId !== null) screenTitle = resultReady ? `Results: ${result.quiz.title}` : 'Results'
  if (attempt) screenTitle = attempt.quiz.title

  useEffect(() => {
    let ignore = false

    Promise.all([api.getQuizzes(), api.getQuestions()])
      .then(([quizList, questionList]) => {
        if (ignore) return
        setQuizzes(quizList)
        setQuestions(questionList)
        setNow(Date.now())
      })
      .catch((error) => {
        if (!ignore) setLoadError(error.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [loadAttempt])

  useEffect(() => {
    document.title = `${screenTitle} – TrackWise`
  }, [screenTitle])

  useEffect(() => {
    function followUrl() {
      const route = readStudentRoute()
      if (!route) return
      flushSync(() => {
        setResultId(route.resultId)
        setResultError('')
        setResultOrigin(null)
        if (route.page) setPage(route.page)
      })
      if (route.page) {
        window.scrollTo(0, 0)
        focusById('main')
      }
    }

    window.addEventListener('hashchange', followUrl)
    return () => window.removeEventListener('hashchange', followUrl)
  }, [])

  useEffect(() => {
    if (!needsAttempts) return
    let ignore = false

    api
      .getAttemptsByStudent(user.userId)
      .then((list) => {
        if (ignore) return
        setPastAttempts(list)
        setAttemptsError('')
      })
      .catch((error) => {
        if (!ignore) setAttemptsError(error.message)
      })

    return () => {
      ignore = true
    }
  }, [needsAttempts, attemptsLoad, user.userId])

  useEffect(() => {
    if (resultId === null || resultReady) return
    let ignore = false

    api
      .getAttempt(resultId)
      .then((saved) => {
        if (ignore) return
        if (saved.student?.userId !== user.userId) {
          throw new Error('This result belongs to another student.')
        }
        setResult(saved)
      })
      .catch((error) => {
        if (!ignore) setResultError(error.message)
      })

    return () => {
      ignore = true
    }
  }, [resultId, resultReady, resultLoad, user.userId])

  const onTimeUp = useEffectEvent(() => finishQuiz('time'))

  useEffect(() => {
    if (!taking) return

    const timer = setInterval(() => {
      const left = secondsUntil(deadline, Date.now())
      setSecondsLeft(left)
      if (left === 0) onTimeUp()
    }, 250)

    return () => clearInterval(timer)
  }, [taking, deadline])

  const unsaved = attempt !== null

  useEffect(() => {
    if (!unsaved) return

    function warnBeforeLeaving(event) {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', warnBeforeLeaving)
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving)
  }, [unsaved])

  function retryLoad() {
    setLoading(true)
    setLoadError('')
    setLoadAttempt(loadAttempt + 1)
  }

  function toggleNav() {
    const next = !navCollapsed
    setNavCollapsed(next)
    writeStored(NAV_KEY, next ? '1' : '0')
  }

  async function startQuiz(quiz) {
    if (startingId !== null) return
    setStartingId(quiz.quizId)
    setStartError(null)

    try {
      const list = await api.getQuizQuestions(quiz.quizId)
      const playable = list.filter((question) => question.choices?.length > 0)
      if (playable.length === 0) throw new Error('This quiz has no questions to answer yet.')

      const next = createAttempt(quiz, playable)
      flushSync(() => {
        setAttempt(next)
        setSecondsLeft(next.totalSeconds)
        setCurrent(0)
        setAnswers({})
        setMarked({})
        setConfirming(null)
        setFinished(null)
        setStartingId(null)
      })
      window.scrollTo(0, 0)
      focusById('question-text')
    } catch (error) {
      setStartError({ quizId: quiz.quizId, message: error.message })
      setStartingId(null)
    }
  }

  function selectChoice(questionId, choiceId) {
    setAnswers({ ...answers, [questionId]: choiceId })
  }

  function toggleMark(questionId) {
    setMarked({ ...marked, [questionId]: !marked[questionId] })
  }

  function finishQuiz(reason) {
    if (finished) return
    flushSync(() => {
      setConfirming(null)
      setFinished(reason)
      setSubmitError('')
    })
    window.scrollTo(0, 0)
    focusById('quiz-result-title')
    sendAttempt(reason)
  }

  async function sendAttempt(reason) {
    setSubmitError('')
    try {
      const saved = await api.submitAttempt(toAttemptBody(attempt, answers, user.userId))
      showResultUrl(saved.attemptId)
      flushSync(() => {
        setResult(saved)
        setResultId(saved.attemptId)
        setResultError('')
        setTimedOutId(reason === 'time' ? saved.attemptId : null)
        setAttempt(null)
        setFinished(null)
        setAnswers({})
        setMarked({})
      })
      window.scrollTo(0, 0)
      focusById('quiz-result-title')
    } catch (error) {
      setSubmitError(error.message)
    }
  }

  function leaveQuiz() {
    flushSync(() => {
      setConfirming(null)
      setAttempt(null)
      setFinished(null)
      setSubmitError('')
      setAnswers({})
      setMarked({})
    })
    window.scrollTo(0, 0)
    focusById('main')
  }

  function leaveResults() {
    const target = resultOrigin ?? 'quizzes'
    showPageUrl(target)
    flushSync(() => {
      setResultId(null)
      setResultError('')
      setResultOrigin(null)
      setPage(target)
    })
    window.scrollTo(0, 0)
    focusById('main')
  }

  function retryResult() {
    setResultError('')
    setResultLoad(resultLoad + 1)
  }

  // From My Progress or Quiz History: the attempt is already loaded, so the
  // Results screen shows at once and its Back button returns to that page
  function openResult(attemptId) {
    const saved = pastAttempts?.find((item) => item.attemptId === attemptId) || null
    showResultUrl(attemptId)
    flushSync(() => {
      setResultOrigin(page)
      setResultError('')
      setResultId(attemptId)
      if (saved) setResult(saved)
    })
    window.scrollTo(0, 0)
    focusById('quiz-result-title')
  }

  function retryAttempts() {
    setAttemptsError('')
    setAttemptsLoad(attemptsLoad + 1)
  }

  const resultBackLabel = RESULT_BACK_LABELS[resultOrigin] ?? 'Back to Available Quizzes'

  if (attempt && finished) {
    const timedOut = finished === 'time'
    const timeUpNote = timedOut ? 'The timer reached 00:00, so your quiz was submitted automatically.' : ''

    return (
      <>
        <PageBackdrop calm />
        <QuizLayout title={attempt.quiz.title}>
          {submitError ? (
            <ResultStatus title="Your quiz isn’t saved yet" note={timeUpNote} error={submitError}>
              <button type="button" className="btn btn-primary" onClick={() => sendAttempt(finished)}>
                Try again
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setConfirming('exit')}>
                Exit without saving
              </button>
            </ResultStatus>
          ) : (
            <ResultStatus
              busy
              title={timedOut ? 'Time’s up! Quiz submitted' : 'Quiz submitted'}
              note={timeUpNote}
              message="Checking your answers…"
            />
          )}
        </QuizLayout>

        <ConfirmDialog
          open={confirming === 'exit'}
          title="Exit without saving?"
          cancelLabel="Stay here"
          confirmLabel="Exit quiz"
          danger
          onConfirm={leaveQuiz}
          onCancel={() => setConfirming(null)}
        >
          <p>Your answers won’t be saved. You’ll go back to Available Quizzes.</p>
        </ConfirmDialog>
      </>
    )
  }

  if (attempt) {
    const summary = attemptSummary(attempt.questions, answers, marked)
    const question = attempt.questions[current]
    const unansweredCount = summary.unanswered.length

    return (
      <>
        <PageBackdrop calm />
        <QuizLayout
          title={attempt.quiz.title}
          actions={
            <>
              <QuizTimer seconds={secondsLeft} totalSeconds={attempt.totalSeconds} />
              <button
                type="button"
                className="btn btn-secondary quiz-layout__exit"
                onClick={() => setConfirming('exit')}
              >
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="m16 17 5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
                <span className="quiz-layout__exit-label">Exit quiz</span>
              </button>
            </>
          }
          aside={
            <QuestionNavigator
              questions={attempt.questions}
              current={current}
              answers={answers}
              marked={marked}
              answeredCount={summary.answeredCount}
              onJump={setCurrent}
              onSubmit={() => setConfirming('submit')}
            />
          }
        >
          <QuestionCard
            number={current + 1}
            total={summary.total}
            question={question}
            selectedChoiceId={answers[question.questionId]}
            onSelect={(choiceId) => selectChoice(question.questionId, choiceId)}
            marked={Boolean(marked[question.questionId])}
            onToggleMark={() => toggleMark(question.questionId)}
            onPrevious={() => setCurrent(current - 1)}
            onNext={() => setCurrent(current + 1)}
          />
        </QuizLayout>

        <ConfirmDialog
          open={confirming === 'submit'}
          title="Submit quiz?"
          cancelLabel="Keep working"
          confirmLabel="Submit quiz"
          onConfirm={() => finishQuiz('submitted')}
          onCancel={() => setConfirming(null)}
        >
          {unansweredCount > 0 ? (
            <p className="confirm-dialog__warning">
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
              <span>
                You have <strong>{plural(unansweredCount, 'unanswered question')}</strong>:{' '}
                {unansweredCount === 1 ? 'question' : 'questions'} {listNumbers(summary.unanswered)}.
              </span>
            </p>
          ) : (
            <p>You answered all {plural(summary.total, 'question')}.</p>
          )}
          {summary.markedCount > 0 && (
            <p>
              {plural(summary.markedCount, 'question')} {summary.markedCount === 1 ? 'is' : 'are'}{' '}
              still marked for review.
            </p>
          )}
          <p>You can’t change your answers after you submit.</p>
        </ConfirmDialog>

        <ConfirmDialog
          open={confirming === 'exit'}
          title="Exit quiz?"
          cancelLabel="Keep working"
          confirmLabel="Exit quiz"
          danger
          onConfirm={leaveQuiz}
          onCancel={() => setConfirming(null)}
        >
          <p>Your answers won’t be saved and the timer will stop. You’ll go back to Available Quizzes.</p>
        </ConfirmDialog>
      </>
    )
  }

  if (resultId !== null && resultReady) {
    return (
      <>
        <PageBackdrop />
        <QuizLayout
          title={result.quiz.title}
          wide
          actions={
            <button type="button" className="btn btn-secondary quiz-layout__exit" onClick={leaveResults}>
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              <span className="quiz-layout__exit-label">{resultBackLabel}</span>
            </button>
          }
        >
          <QuizResults
            result={result}
            timedOut={timedOutId === result.attemptId}
            onDone={leaveResults}
            doneLabel={resultBackLabel}
          />
        </QuizLayout>
      </>
    )
  }

  if (resultId !== null) {
    return (
      <>
        <PageBackdrop />
        <QuizLayout title="Quiz results">
          {resultError ? (
            <ResultStatus title="Couldn’t load your results" error={resultError}>
              <button type="button" className="btn btn-primary" onClick={retryResult}>
                Try again
              </button>
              <button type="button" className="btn btn-secondary" onClick={leaveResults}>
                {resultBackLabel}
              </button>
            </ResultStatus>
          ) : (
            <ResultStatus busy title="Your results" message="Loading your results…" />
          )}
        </QuizLayout>
      </>
    )
  }

  const navigation = studentNavSections.map((section) => (
    <SideSection key={section.label} label={section.label}>
      {section.items.map((item) => (
        <SideBtn key={item.id} icon={item.id} label={item.label} active={item.id === page} />
      ))}
    </SideSection>
  ))

  let heroSummary
  let pageContent
  // The animated quiz-sheet drawing shows only when at least one quiz can be taken
  let heroArt = 'none'

  if (page === 'progress') {
    const progress = pastAttempts ? buildProgress(pastAttempts) : null
    const showSummary = !attemptsError && (attemptsLoading || (progress !== null && progress.quizzesTaken > 0))

    pageContent = (
      <>
        {showSummary && <ProgressSummary loading={attemptsLoading} progress={progress} />}
        <MyProgress
          loading={attemptsLoading}
          loadError={attemptsError}
          onRetry={retryAttempts}
          progress={progress}
          onView={openResult}
        />
      </>
    )
  } else if (page === 'history') {
    const views = pastAttempts ? historyViews(pastAttempts) : null

    pageContent = (
      <QuizHistory
        loading={attemptsLoading}
        loadError={attemptsError}
        onRetry={retryAttempts}
        attempts={views}
        onView={openResult}
      />
    )
  } else {
    const available = availableQuizViews(buildQuizViews(quizzes, questions))
    // undefined while attempts load (the card leaves the line out), else a Map
    const scores = pastAttempts && !attemptsError ? lastScores(pastAttempts) : undefined

    heroSummary = `${plural(available.length, 'quiz', 'quizzes')} ready to take`
    if (loading) heroSummary = 'Loading your quizzes…'
    if (loadError) heroSummary = 'Your quizzes will appear here once the server is reachable.'
    if (!loading && !loadError && available.length > 0) heroArt = 'drawing'

    pageContent = (
      <AvailableQuizzes loading={loading} loadError={loadError} onRetry={retryLoad} count={available.length}>
        {available.map((item, index) => (
          <StudentQuizCard
            key={item.quiz.quizId}
            item={item}
            index={index}
            lastPercent={scores && (scores.get(item.quiz.quizId) ?? null)}
            starting={startingId === item.quiz.quizId}
            error={startError?.quizId === item.quiz.quizId ? startError.message : ''}
            onStart={() => startQuiz(item.quiz)}
          />
        ))}
      </AvailableQuizzes>
    )
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <PageBackdrop />

      <div className="app" data-nav={navCollapsed ? 'collapsed' : 'expanded'}>
        <SideBar collapsed={navCollapsed} onToggle={toggleNav} user={user} onLogout={onLogout}>
          {navigation}
        </SideBar>

        <div className="app__column">
          <Header user={user} onLogout={onLogout}>
            {navigation}
          </Header>

          <MainContent
            eyebrow={`${greeting(now)}, ${firstName(user.fullName)}`}
            title={STUDENT_PAGE_TITLES[page]}
            summary={heroSummary}
            plain={page !== 'quizzes'}
            art={heroArt}
          >
            {pageContent}
          </MainContent>
        </div>
      </div>
    </>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
function Root() {
  const [user, setUser] = useState(readStoredUser)
  const [screen, setScreen] = useState('login')
  const [loginRole, setLoginRole] = useState('STUDENT')
  const [loginForm, setLoginForm] = useState(emptyLogin)
  const [registerForm, setRegisterForm] = useState(emptyRegister)
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [authError, setAuthError] = useState('')
  const [takenEmail, setTakenEmail] = useState('')
  const [sections, setSections] = useState([])
  const [sectionsLoading, setSectionsLoading] = useState(false)
  const [sectionsError, setSectionsError] = useState('')
  const [sectionsAttempt, setSectionsAttempt] = useState(0)

  let pageTitle = screen === 'register' ? 'Create account' : 'Log in'
  if (user) pageTitle = user.role === 'TEACHER' ? 'Quizzes' : 'Available Quizzes'
  // StudentApp names its own pages (My Progress, Quiz History, Results)
  const studentNamesPage = user?.role === 'STUDENT'

  useEffect(() => {
    if (studentNamesPage) return
    document.title = `${pageTitle} – TrackWise`
  }, [pageTitle, studentNamesPage])

  useEffect(() => {
    if (screen !== 'register') return
    let ignore = false

    api
      .getSections()
      .then((list) => {
        if (!ignore) setSections(list)
      })
      .catch((error) => {
        if (!ignore) setSectionsError(error.message)
      })
      .finally(() => {
        if (!ignore) setSectionsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [screen, sectionsAttempt])

  const loginErrors = validateLogin(loginForm)
  const registerErrors = validateRegister(registerForm, takenEmail)

  function showScreen(next) {
    flushSync(() => {
      setScreen(next)
      setTouched({})
      setAuthError('')
      setTakenEmail('')
      if (next === 'register') {
        setRegisterForm({ ...emptyRegister, email: loginForm.email, role: loginRole })
        setSectionsLoading(true)
        setSectionsError('')
      } else {
        setLoginForm({ ...emptyLogin, email: registerForm.email })
        setLoginRole(registerForm.role)
      }
    })
    focusById('auth-title')
  }

  function retrySections() {
    setSectionsLoading(true)
    setSectionsError('')
    setSectionsAttempt(sectionsAttempt + 1)
  }

  function signIn(account) {
    writeStored(USER_KEY, JSON.stringify(account))
    flushSync(() => {
      setUser(account)
      setScreen('login')
      setLoginForm(emptyLogin)
      setRegisterForm(emptyRegister)
      setTouched({})
      setSubmitting(false)
      setAuthError('')
      setTakenEmail('')
    })
    focusById('main')
  }

  function logout() {
    removeStored(USER_KEY)
    flushSync(() => {
      setLoginRole(user.role)
      setUser(null)
    })
    focusById('auth-title')
  }

  function failSubmit(message, focusId) {
    flushSync(() => {
      setSubmitting(false)
      setAuthError(message)
    })
    focusById(focusId)
  }

  function showErrors(errors, fields) {
    flushSync(() => setTouched(Object.fromEntries(fields.map((field) => [field, true]))))
    focusById(`field-${Object.keys(errors)[0]}`)
  }

  function updateLogin(event) {
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value })
  }

  function updateRegister(event) {
    setRegisterForm({ ...registerForm, [event.target.name]: event.target.value })
  }

  function touchField(event) {
    setTouched({ ...touched, [event.target.name]: true })
  }

  function changeLoginRole(role) {
    setLoginRole(role)
    setAuthError('')
  }

  async function login() {
    if (submitting) return
    if (Object.keys(loginErrors).length > 0) {
      showErrors(loginErrors, Object.keys(emptyLogin))
      return
    }

    setSubmitting(true)
    setAuthError('')
    try {
      const account = await api.login(loginForm.email.trim(), loginForm.password)
      const problem = roleProblem(account, loginRole)
      if (problem) failSubmit(problem, 'auth-submit')
      else signIn(account)
    } catch (error) {
      failSubmit(error.message, 'field-password')
    }
  }

  async function register() {
    if (submitting) return
    if (Object.keys(registerErrors).length > 0) {
      showErrors(registerErrors, Object.keys(emptyRegister))
      return
    }

    setSubmitting(true)
    setAuthError('')
    try {
      signIn(await api.register(toRegisterBody(registerForm)))
    } catch (error) {
      if (isEmailTaken(error.message)) {
        flushSync(() => {
          setSubmitting(false)
          setTakenEmail(registerForm.email.trim())
          setTouched((current) => ({ ...current, email: true }))
        })
        focusById('field-email')
      } else {
        failSubmit(error.message, 'auth-submit')
      }
    }
  }

  if (user?.role === 'TEACHER') return <App user={user} onLogout={logout} />
  if (user) return <StudentApp user={user} onLogout={logout} />

  const isRegister = screen === 'register'
  const sectionChoices = sectionOptions(sections)
  const isStudent = registerForm.role === 'STUDENT'

  let sectionHint = isStudent ? '' : 'Optional for teachers.'
  if (!sectionsLoading && !sectionsError && sectionChoices.length === 0) {
    sectionHint = 'No sections yet. A teacher needs to add one first.'
  }
  if (sectionsLoading) sectionHint = 'Loading sections…'

  let submitLabel = isRegister ? 'Create account' : 'Log in'
  if (submitting) submitLabel = isRegister ? 'Creating account…' : 'Logging in…'

  return (
    <>
      <PageBackdrop />
      <AuthLayout
        title={isRegister ? 'Create your account' : 'Welcome back'}
        subtitle={
          isRegister ? 'Fields marked * are required.' : 'Log in to see your quizzes and progress.'
        }
        footer={
          <>
            {isRegister ? 'Already have an account?' : 'New to TrackWise?'}
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => showScreen(isRegister ? 'login' : 'register')}
              disabled={submitting}
            >
              {isRegister ? 'Log in' : 'Create an account'}
            </button>
          </>
        }
      >
        {isRegister ? (
          <AuthForm
            error={authError}
            submitLabel={submitLabel}
            submitting={submitting}
            onSubmit={register}
          >
            <FormField
              label="Full name"
              name="fullName"
              value={registerForm.fullName}
              onChange={updateRegister}
              onBlur={touchField}
              error={touched.fullName && registerErrors.fullName}
              autoComplete="name"
              maxLength={100}
              required
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={registerForm.email}
              onChange={updateRegister}
              onBlur={touchField}
              error={touched.email && registerErrors.email}
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
            />
            <FormField
              label="Password"
              name="password"
              type="password"
              value={registerForm.password}
              onChange={updateRegister}
              onBlur={touchField}
              error={touched.password && registerErrors.password}
              hint="At least 8 characters."
              autoComplete="new-password"
              maxLength={72}
              required
            />
            <RoleChoice name="role" value={registerForm.role} onChange={updateRegister} />
            <FormField
              label="Section"
              name="sectionId"
              type="select"
              options={sectionChoices}
              value={registerForm.sectionId}
              onChange={updateRegister}
              onBlur={touchField}
              error={touched.sectionId && registerErrors.sectionId}
              hint={sectionHint}
              disabled={sectionsLoading}
              required={isStudent}
            />
            {sectionsError && (
              <div className="alert auth-form__retry" role="alert">
                <span>Couldn’t load sections. {sectionsError}</span>
                <button type="button" className="btn btn-secondary" onClick={retrySections}>
                  Try again
                </button>
              </div>
            )}
          </AuthForm>
        ) : (
          <RoleTabs value={loginRole} onChange={changeLoginRole}>
            <AuthForm
              error={authError}
              submitLabel={submitLabel}
              submitting={submitting}
              onSubmit={login}
            >
              <FormField
                label="Email"
                name="email"
                type="email"
                value={loginForm.email}
                onChange={updateLogin}
                onBlur={touchField}
                error={touched.email && loginErrors.email}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
              />
              <FormField
                label="Password"
                name="password"
                type="password"
                value={loginForm.password}
                onChange={updateLogin}
                onBlur={touchField}
                error={touched.password && loginErrors.password}
                autoComplete="current-password"
                required
              />
            </AuthForm>
          </RoleTabs>
        )}
      </AuthLayout>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
