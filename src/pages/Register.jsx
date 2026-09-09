import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function validateRegisterForm({ name, email, password }) {
  const errors = {};

  const trimmedName = name.trim();
  if (!trimmedName) {
    errors.name = 'Full name is required.';
  }

  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long.';
  }

  return errors;
}

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // Redirect to login page with success notification state
      navigate('/login', {
        state: {
          successMessage: 'Account created successfully! Please sign in with your credentials.',
        },
      });
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page page--narrow">
      <div className="task-form" style={{ maxWidth: '520px', margin: '2rem auto' }}>
        <h1 className="page__heading" style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
          Create an Account
        </h1>
        <p className="page__subheading" style={{ marginBottom: '1.75rem' }}>
          Sign up to manage your tasks with persistent cloud sync.
        </p>

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
          {/* Name Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="reg-name" className="task-form__label">
              Full Name
            </label>
            <input
              id="reg-name"
              name="name"
              type="text"
              className={`task-form__input${errors.name ? ' task-form__input--error' : ''}`}
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <p className="task-form__error">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="reg-email" className="task-form__label">
              Email Address
            </label>
            <input
              id="reg-email"
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
            <label htmlFor="reg-password" className="task-form__label">
              Password
            </label>
            <input
              id="reg-password"
              name="password"
              type="password"
              className={`task-form__input${errors.password ? ' task-form__input--error' : ''}`}
              placeholder="At least 6 characters"
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
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
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
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--primary)',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default Register;
