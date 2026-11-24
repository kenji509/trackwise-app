import './RoleTabs.css'

const TABS = [
  {
    value: 'STUDENT',
    label: 'Student',
    icon: (
      <>
        <path d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z" />
        <path d="M22 10v6" />
        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
      </>
    ),
  },
  {
    value: 'TEACHER',
    label: 'Teacher',
    icon: (
      <>
        <path d="M2 3h20" />
        <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
        <path d="m7 21 5-5 5 5" />
      </>
    ),
  },
]

function tabId(value) {
  return `role-tab-${value.toLowerCase()}`
}

function RoleTabs({ value, onChange, children }) {
  function handleKeyDown(event) {
    const index = TABS.findIndex((tab) => tab.value === value)
    const moves = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: TABS.length - 1 }
    if (!Object.hasOwn(moves, event.key)) return

    event.preventDefault()
    const next = TABS[(moves[event.key] + TABS.length) % TABS.length]
    onChange(next.value)
    document.getElementById(tabId(next.value)).focus()
  }

  return (
    <>
      <div className="role-tabs" role="tablist" aria-label="Log in as" onKeyDown={handleKeyDown}>
        {TABS.map((tab) => {
          const selected = tab.value === value
          return (
            <button
              key={tab.value}
              id={tabId(tab.value)}
              type="button"
              role="tab"
              className="role-tabs__tab"
              aria-selected={selected}
              aria-controls="role-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.value)}
            >
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                {tab.icon}
              </svg>
              {tab.label}
            </button>
          )
        })}
      </div>

      <div id="role-panel" role="tabpanel" aria-labelledby={tabId(value)}>
        {children}
      </div>
    </>
  )
}

export default RoleTabs
