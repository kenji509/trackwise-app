import './AuthForm.css'

function AuthForm({ error, submitLabel, submitting, onSubmit, children }) {
  function handleSubmit(event) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className="auth-form" noValidate onSubmit={handleSubmit}>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      {children}

      <button
        id="auth-submit"
        type="submit"
        className="btn btn-primary auth-form__submit"
        disabled={submitting}
      >
        {submitLabel}
      </button>
    </form>
  )
}

export default AuthForm
