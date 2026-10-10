import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle,
} from 'lucide-react';

import Container from '../components/ui/Container';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { stagger, fadeUp, EASE } from '../components/ui/motion';
import { apiService } from '../services/api';

const EMPTY = { name: '', email: '', phone: '', message: '' };

const channels = [
  { icon: Mail, label: 'Email', value: 'support@petcarehub.com', href: 'mailto:support@petcarehub.com' },
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: MapPin, label: 'Office', value: 'Phagwara, Punjab, India' },
  { icon: Clock, label: 'Hours', value: 'Mon–Sat, 10am–7pm IST' },
];

const Contact = () => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';

    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Please enter a valid email address';

    if (!form.phone.trim()) next.phone = 'Phone number is required';
    else if (!/^[0-9+\-\s()]{10,15}$/.test(form.phone))
      next.phone = 'Please enter a valid phone number';

    if (!form.message.trim()) next.message = 'Message is required';
    else if (form.message.trim().length < 10)
      next.message = 'Message must be at least 10 characters';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const change = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // Clear the error as soon as the field is touched again
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setStatus(null);

    try {
      await apiService.submitContact(form);
      setForm(EMPTY);
      setStatus({ type: 'success', message: "Thank you! We'll be in touch shortly." });
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.response?.data?.message ||
          error.message ||
          'Failed to send message. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(null), 6000);
    return () => clearTimeout(t);
  }, [status]);

  return (
    <div className="min-h-screen pb-24 bg-blush-50">
      <PageHeader
        eyebrow="Contact"
        title="Contact us"
        subtitle="Monday to Saturday, 10am to 7pm IST. We reply within one working day."
      />

      <Container className="pt-10">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-start">
          {/* Channels */}
          <motion.div variants={stagger(0, 0.08)} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="rounded-2xl bg-cream border border-hairline p-8">
              <h2 className="text-lg font-semibold text-ink mb-7">
                Other ways to reach us
              </h2>

              <div className="space-y-6">
                {channels.map(({ icon: Icon, label, value, href }) => {
                  const body = (
                    <>
                      <span className="grid place-items-center w-10 h-10 rounded-2xl bg-blush-100 text-blush-600 shrink-0">
                        <Icon size={18} strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink-mute">
                          {label}
                        </span>
                        <span className="block text-sm text-ink mt-1 break-words">{value}</span>
                      </span>
                    </>
                  );

                  return href ? (
                    <a
                      key={label}
                      href={href}
                      className="flex items-start gap-4 group hover:text-blush-500 transition-colors"
                    >
                      {body}
                    </a>
                  ) : (
                    <div key={label} className="flex items-start gap-4">{body}</div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={submit}
            noValidate
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="rounded-2xl bg-cream border border-hairline shadow-soft p-7 sm:p-10"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <Field
                label="Name" name="name" value={form.name}
                onChange={change} error={errors.name} placeholder="Your full name"
              />
              <Field
                label="Phone" name="phone" type="tel" value={form.phone}
                onChange={change} error={errors.phone} placeholder="+91 98765 43210"
              />
            </div>

            <div className="mt-6">
              <Field
                label="Email" name="email" type="email" value={form.email}
                onChange={change} error={errors.email} placeholder="you@example.com"
              />
            </div>

            <div className="mt-6">
              <Field
                label="Message" name="message" value={form.message}
                onChange={change} error={errors.message} textarea
                placeholder="Tell us a bit about what you're looking for…"
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button as="button" type="submit" size="lg" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send message'}
                {!submitting && <Send size={16} strokeWidth={2.2} />}
              </Button>
              <p className="text-xs text-ink-mute">We never share your details.</p>
            </div>

            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div
                    className={`mt-6 flex items-start gap-3 rounded-2xl px-5 py-4 ${
                      status.type === 'success'
                        ? 'bg-sage-50 text-sage-300'
                        : 'bg-blush-50 text-blush-600'
                    }`}
                  >
                    {status.type === 'success' ? (
                      <CheckCircle2 size={18} className="shrink-0 mt-0.5" strokeWidth={2} />
                    ) : (
                      <AlertCircle size={18} className="shrink-0 mt-0.5" strokeWidth={2} />
                    )}
                    <p className="text-sm font-medium text-ink">{status.message}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </Container>
    </div>
  );
};

const Field = ({ label, name, value, onChange, error, placeholder, type = 'text', textarea }) => {
  const cls = `w-full bg-mist rounded-2xl px-4 py-3.5 text-sm text-ink placeholder:text-ink-mute
    outline-none transition-shadow focus:ring-2
    ${error ? 'ring-2 ring-blush-300' : 'focus:ring-blush-300'}`;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink mb-2.5">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name} name={name} rows={5} value={value}
          onChange={onChange} placeholder={placeholder}
          className={`${cls} resize-none leading-relaxed`}
        />
      ) : (
        <input
          id={name} name={name} type={type} value={value}
          onChange={onChange} placeholder={placeholder} className={cls}
        />
      )}
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
};

export default Contact;
