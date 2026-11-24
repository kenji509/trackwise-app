import { StrictMode, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './components/Header.jsx'
import SideBar from './components/SideBar.jsx'
import SideSection from './components/SideSection.jsx'
import SideBtn from './components/SideBtn.jsx'
import MainContent from './components/MainContent.jsx'
import SampleNotice from './components/SampleNotice.jsx'
import QuizStats from './components/QuizStats.jsx'
import Quizzes from './components/Quizzes.jsx'
import QuizToolbar from './components/QuizToolbar.jsx'
import SampleSwitch from './components/SampleSwitch.jsx'
import QuizCard from './components/QuizCard.jsx'
import QuizForm from './components/QuizForm.jsx'
import FormField from './components/FormField.jsx'
import FormButtons from './components/FormButtons.jsx'
import Toast from './components/Toast.jsx'
import AuthLayout from './components/AuthLayout.jsx'
import AuthForm from './components/AuthForm.jsx'
import RoleTabs from './components/RoleTabs.jsx'
import RoleChoice from './components/RoleChoice.jsx'
import StudentHome from './components/StudentHome.jsx'
import * as api from './api.js'
import { emptyForm, toForm, toRequestBody, validateQuiz } from './quizForm.js'
import {
  emptyLogin,
  emptyRegister,
  isEmailTaken,
  isValidUser,
  roleProblem,
  sectionOptions,
  toRegisterBody,
  validateLogin,
  validateRegister,
} from './authForm.js'
import {
  SORT_OPTIONS,
  buildQuizViews,
  filterAndSort,
  greeting,
  plural,
  quizStats,
  teacherOptions,
  topicOptions,
} from './quizData.js'
import { makeSampleData } from './sampleData.js'

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

  const statTiles = [
    {
      id: 'quizzes',
      icon: 'quizzes',
      accent: 'sunny',
      label: 'Quizzes',
      value: stats.quizCount,
      helper: `${stats.publishedCount} published · ${plural(stats.draftCount, 'draft')}`,
    },
    {
      id: 'questions',
      icon: 'questions',
      accent: 'primary',
      label: 'Questions',
      value: stats.questionTotal,
      helper: stats.quizCount
        ? `About ${Math.round(stats.questionTotal / stats.quizCount)} per quiz`
        : 'None yet',
    },
    {
      id: 'week',
      icon: 'week',
      accent: 'mint',
      label: 'New this week',
      value: stats.thisWeek,
      helper: 'Created in the last 7 days',
    },
    {
      id: 'topic',
      icon: 'topic',
      accent: stats.topTopic ? stats.topTopic.accent : 'coral',
      label: 'Most-used topic',
      value: stats.topTopic ? (
        <span className={`topic-chip accent-${stats.topTopic.accent}`}>{stats.topTopic.name}</span>
      ) : (
        '—'
      ),
      helper: stats.topTopic ? plural(stats.topTopic.count, 'question') : 'No questions yet',
    },
  ]

  let heroSummary = `${plural(stats.quizCount, 'quiz', 'quizzes')} · ${plural(stats.questionTotal, 'question')} · ${plural(stats.topicCount, 'topic')}`
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

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

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
            eyebrow={`${greeting(now)}, Teacher`}
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
  if (user) pageTitle = user.role === 'TEACHER' ? 'Quizzes' : 'Student dashboard'

  useEffect(() => {
    document.title = `${pageTitle} · TrackWise`
  }, [pageTitle])

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
    focusById(account.role === 'TEACHER' ? 'main' : 'student-title')
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
  if (user) return <StudentHome user={user} onLogout={logout} />

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
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
