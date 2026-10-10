import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Lock, Phone, ArrowRight, AlertCircle, PawPrint, Eye, EyeOff, Check,
} from 'lucide-react';

import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { fadeUp, stagger, EASE } from '../components/ui/motion';
import { useAuth } from '../context/AuthContext';
import { Field } from './Login';

const rules = [
  { test: (p) => p.length >= 6, label: 'At least 6 characters' },
  { test: (p) => /[A-Za-z]/.test(p), label: 'Contains a letter' },
  { test: (p) => /[0-9]/.test(p), label: 'Contains a number' },
];

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';

    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Please enter a valid email address';

    if (form.phone && !/^[0-9+\-\s()]{10,15}$/.test(form.phone))
      next.phone = 'Please enter a valid phone number';

    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6)
      next.password = 'Password must be at least 6 characters';

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
      await register(form);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Could not create your account. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] grid place-items-center py-16 bg-shell">

      <Container size="narrow">
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
            <h1 className="text-3xl sm:text-4xl text-ink leading-tight">Create your account</h1>
            <p className="mt-3 text-ink-soft">
              Your bag, bookings and orders — saved across every device.
            </p>
          </motion.div>

          <motion.form
            variants={fadeUp}
            onSubmit={submit}
            noValidate
            className="rounded-2xl bg-cream border border-hairline shadow-soft p-7 sm:p-9"
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
                label="Name" name="name" icon={User}
                value={form.name} onChange={change} error={errors.name}
                placeholder="Your full name" autoComplete="name"
              />
              <Field
                label="Email" name="email" type="email" icon={Mail}
                value={form.email} onChange={change} error={errors.email}
                placeholder="you@example.com" autoComplete="email"
              />
              <Field
                label="Phone (optional)" name="phone" type="tel" icon={Phone}
                value={form.phone} onChange={change} error={errors.phone}
                placeholder="+91 98765 43210" autoComplete="tel"
              />
              <Field
                label="Password" name="password" icon={Lock}
                type={showPw ? 'text' : 'password'}
                value={form.password} onChange={change} error={errors.password}
                placeholder="At least 6 characters" autoComplete="new-password"
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

              {/* Live strength hints, only once typing starts */}
              <AnimatePresence>
                {form.password.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden flex flex-wrap gap-x-5 gap-y-2 pt-1"
                  >
                    {rules.map((r) => {
                      const ok = r.test(form.password);
                      return (
                        <li
                          key={r.label}
                          className={`flex items-center gap-1.5 text-xs transition-colors ${
                            ok ? 'text-sage-300' : 'text-ink-mute'
                          }`}
                        >
                          <Check size={12} strokeWidth={3} className={ok ? '' : 'opacity-30'} />
                          {r.label}
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <Button as="button" type="submit" size="lg" className="w-full mt-8" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create account'}
              {!submitting && <ArrowRight size={17} strokeWidth={2.2} />}
            </Button>

            <p className="text-center text-sm text-ink-soft mt-6">
              Already have an account?{' '}
              <Link
                to="/login"
                state={{ from }}
                className="font-medium text-blush-500 hover:text-blush-600 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.form>
        </motion.div>
      </Container>
    </div>
  );
};

export default Signup;
