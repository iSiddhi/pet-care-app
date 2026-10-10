import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, PawPrint, Eye, EyeOff } from 'lucide-react';

import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { fadeUp, stagger, EASE } from '../components/ui/motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Please enter a valid email address';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const change = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
    if (serverError) setServerError(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Could not sign you in. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] grid place-items-center py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blush-50 to-cream" />
      <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-lilac-100/60 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-sage-100/50 blur-3xl" />

      <Container className="relative" size="narrow">
        <motion.div
          variants={stagger(0, 0.08)}
          initial="hidden"
          animate="show"
          className="max-w-md mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-10">
            <span className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-blush-100 text-blush-500 mb-6">
              <PawPrint size={22} strokeWidth={2} />
            </span>
            <h1 className="text-3xl sm:text-4xl text-ink leading-tight">Welcome back</h1>
            <p className="mt-3 text-ink-soft">
              Sign in to see your bag, bookings and orders.
            </p>
          </motion.div>

          <motion.form
            variants={fadeUp}
            onSubmit={submit}
            noValidate
            className="rounded-[2rem] bg-cream border border-hairline shadow-soft p-7 sm:p-9"
          >
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-3 rounded-2xl bg-blush-50 px-4 py-3.5 mb-6">
                    <AlertCircle size={17} className="text-blush-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-ink">{serverError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5">
              <Field
                label="Email" name="email" type="email" icon={Mail}
                value={form.email} onChange={change} error={errors.email}
                placeholder="you@example.com" autoComplete="email"
              />

              <Field
                label="Password" name="password" icon={Lock}
                type={showPw ? 'text' : 'password'}
                value={form.password} onChange={change} error={errors.password}
                placeholder="Your password" autoComplete="current-password"
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="text-ink-mute hover:text-ink transition-colors"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
            </div>

            <Button as="button" type="submit" size="lg" className="w-full mt-8" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
              {!submitting && <ArrowRight size={17} strokeWidth={2.2} />}
            </Button>

            <p className="text-center text-sm text-ink-soft mt-6">
              New here?{' '}
              <Link
                to="/signup"
                state={{ from }}
                className="font-medium text-blush-500 hover:text-blush-600 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </motion.form>
        </motion.div>
      </Container>
    </div>
  );
};

export const Field = ({
  label, name, value, onChange, error, placeholder,
  type = 'text', icon: Icon, trailing, autoComplete,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-ink mb-2.5">
      {label}
    </label>
    <div
      className={`flex items-center gap-3 bg-mist rounded-2xl px-4 transition-shadow
        ${error ? 'ring-2 ring-blush-300' : 'focus-within:ring-2 focus-within:ring-blush-300'}`}
    >
      {Icon && <Icon size={16} className="text-ink-mute shrink-0" strokeWidth={1.9} />}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="flex-1 bg-transparent py-3.5 text-sm text-ink placeholder:text-ink-mute outline-none min-w-0"
      />
      {trailing}
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 text-xs text-blush-600"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

export default Login;
