import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success message flashed from registration page
  const successMessage = location.state?.successMessage;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  }

  function validate() {
    const nextErrors = {};
    if (!formData.email.trim()) {
      nextErrors.email = 'Email address is required.';
    }
    if (!formData.password) {
      nextErrors.password = 'Password is required.';
    }
    return nextErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (response?.data?.token && response?.data?.user) {
        login(response.data.token, response.data.user);
        navigate('/', { replace: true });
      } else {
        throw new Error('Unexpected response format from server.');
      }
    } catch (err) {
      setServerError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page page--narrow">
      <div className="task-form" style={{ maxWidth: '520px', margin: '2rem auto' }}>
        <h1 className="page__heading" style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
          Sign In
        </h1>
        <p className="page__subheading" style={{ marginBottom: '1.75rem' }}>
          Welcome back! Access your personal task board.
        </p>

        {successMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              borderRadius: 'var(--radius)',
              background: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
              color: 'var(--success-text)',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
            role="status"
          >
            ✓ {successMessage}
          </div>
        )}

        {serverError && (
          <div
            className="task-form__error"
            style={{ marginBottom: '1.25rem', padding: '0.65rem 0.85rem' }}
            role="alert"
          >
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="login-email" className="task-form__label">
              Email Address
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              className={`task-form__input${errors.email ? ' task-form__input--error' : ''}`}
              placeholder="e.g. john@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <p className="task-form__error">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="login-password" className="task-form__label">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              className={`task-form__input${errors.password ? ' task-form__input--error' : ''}`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && <p className="task-form__error">{errors.password}</p>}
          </div>

          {/* Actions */}
          <div className="task-form__actions" style={{ marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="btn btn--primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1.25rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <p
            style={{
              marginTop: '1.5rem',
              textAlign: 'center',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
            }}
          >
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--primary)',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default Login;
