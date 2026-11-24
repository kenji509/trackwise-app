import './RoleChoice.css'

const OPTIONS = [
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

function RoleChoice({ name, value, onChange }) {
  return (
    <fieldset className="role-choice">
      <legend className="role-choice__legend">
        Role
        <span className="role-choice__required" aria-hidden="true">
          {' '}*
        </span>
      </legend>

      <div className="role-choice__options">
        {OPTIONS.map((option) => (
          <label key={option.value} className="role-choice__option">
            <input
              type="radio"
              className="role-choice__input"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
            />
            <span className="role-choice__icon" aria-hidden="true">
              <svg className="icon" viewBox="0 0 24 24">
                {option.icon}
              </svg>
            </span>
            {option.label}
            <svg className="icon role-choice__check" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="m8 12 3 3 5-6" />
            </svg>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default RoleChoice
