import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope, Sparkles, ShieldAlert, ArrowRight,
  RotateCcw, AlertCircle, CheckCircle2, Info,
} from 'lucide-react';

import Container from '../components/ui/Container';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { fadeUp, stagger, EASE } from '../components/ui/motion';
import { apiService } from '../services/api';

const PET_TYPES = ['Dog', 'Cat', 'Rabbit', 'Birds', 'Fish', 'Turtle'];

const SEVERITY = {
  Low: { bg: 'bg-sage-50', text: 'text-sage-300', ring: 'ring-sage-200', icon: CheckCircle2 },
  Moderate: { bg: 'bg-blush-50', text: 'text-blush-500', ring: 'ring-blush-200', icon: Info },
  High: { bg: 'bg-blush-100', text: 'text-blush-600', ring: 'ring-blush-300', icon: AlertCircle },
  Critical: { bg: 'bg-blush-100', text: 'text-blush-600', ring: 'ring-blush-400', icon: ShieldAlert },
};

const EXAMPLES = [
  'Vomiting since yesterday, not eating, very low energy',
  'Constant scratching and red patches near the belly',
  'Sneezing with watery eyes and a runny nose',
];

const DiseasePrediction = () => {
  const [form, setForm] = useState({ pet: '', breed: '', symptoms: '' });
  const [breeds, setBreeds] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setForm((f) => ({ ...f, breed: '' }));
    if (!form.pet) { setBreeds([]); return; }

    let alive = true;
    apiService
      .getBreedsByPet(form.pet)
      .then((res) => { if (alive) setBreeds(res.breeds || []); })
      .catch(() => { if (alive) setBreeds([]); });
    return () => { alive = false; };
  }, [form.pet]);

  const submit = async (e) => {
    e?.preventDefault();
    if (!form.pet || !form.symptoms.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const prediction = await apiService.predictDisease(form);
      setResult(prediction);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "We couldn't reach the health service. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm({ pet: '', breed: '', symptoms: '' });
    setResult(null);
    setError(null);
  };

  const tone = SEVERITY[result?.severity] || SEVERITY.Moderate;
  const SeverityIcon = tone.icon;

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        eyebrow="Health Check"
        title="Describe what you're seeing"
        subtitle="Our assistant reads the symptoms against a veterinary knowledge base and suggests what to look into next."
      />

      <Container className="pt-4">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
          {/* Form */}
          <motion.form
            onSubmit={submit}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="rounded-[2rem] bg-cream border border-hairline shadow-soft p-6 sm:p-8 lg:sticky lg:top-28"
          >
            <div className="flex items-center gap-2 mb-7">
              <Stethoscope size={17} className="text-blush-500" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-mute">
                Symptom check
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-ink mb-2.5">Pet type</label>
                <div className="grid grid-cols-3 gap-2">
                  {PET_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, pet: t }))}
                      className={`px-3 py-2.5 rounded-2xl text-sm font-medium border transition-colors duration-200
                        ${form.pet === t
                          ? 'border-blush-300 bg-blush-50 text-blush-600'
                          : 'border-hairline text-ink-soft hover:border-blush-200 hover:text-ink'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2.5">
                  Breed <span className="text-ink-mute font-normal">(optional)</span>
                </label>
                <select
                  value={form.breed}
                  onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))}
                  disabled={!form.pet || breeds.length === 0}
                  className="w-full bg-mist rounded-2xl px-4 py-3.5 text-sm text-ink outline-none focus:ring-2 focus:ring-blush-300 transition-shadow cursor-pointer disabled:opacity-50"
                >
                  <option value="">{form.pet ? 'Any breed' : 'Pick a pet type first'}</option>
                  {breeds.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2.5">Symptoms</label>
                <textarea
                  rows={4}
                  value={form.symptoms}
                  onChange={(e) => setForm((f) => ({ ...f, symptoms: e.target.value }))}
                  placeholder="When did it start? What have you noticed? Any change in eating, energy or toilet habits?"
                  className="w-full bg-mist rounded-2xl px-4 py-3.5 text-sm text-ink placeholder:text-ink-mute outline-none focus:ring-2 focus:ring-blush-300 transition-shadow resize-none leading-relaxed"
                />

                <div className="flex flex-wrap gap-2 mt-3">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, symptoms: ex }))}
                      className="text-xs px-3 py-1.5 rounded-full border border-hairline text-ink-soft hover:border-blush-300 hover:bg-blush-50 transition-colors text-left"
                    >
                      {ex.length > 38 ? `${ex.slice(0, 38)}…` : ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Button
                as="button"
                type="submit"
                size="lg"
                disabled={!form.pet || !form.symptoms.trim() || loading}
              >
                {loading ? 'Analysing…' : 'Check symptoms'}
                {!loading && <ArrowRight size={17} strokeWidth={2.2} />}
              </Button>
              {(result || error) && (
                <Button onClick={reset} variant="ghost" size="lg" type="button">
                  <RotateCcw size={16} />
                  Start over
                </Button>
              )}
            </div>
          </motion.form>

          {/* Result */}
          <div className="min-h-[20rem]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-[2rem] border border-hairline bg-shell p-8 space-y-4"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="text-blush-400"
                    >
                      <Sparkles size={20} />
                    </motion.span>
                    <p className="text-sm text-ink-soft">Reading the symptoms…</p>
                  </div>
                  <div className="h-6 w-2/3 rounded-full shimmer" />
                  <div className="h-4 w-full rounded-full shimmer" />
                  <div className="h-4 w-5/6 rounded-full shimmer" />
                  <div className="h-4 w-3/4 rounded-full shimmer" />
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[2rem] border border-hairline bg-shell p-8 text-center"
                >
                  <span className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-blush-100 text-blush-500 mb-5">
                    <AlertCircle size={21} />
                  </span>
                  <p className="font-medium text-ink mb-2">Couldn't complete the check</p>
                  <p className="text-sm text-ink-soft max-w-sm mx-auto">{error}</p>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  variants={stagger(0, 0.08)}
                  initial="hidden"
                  animate="show"
                  className="rounded-[2rem] border border-hairline bg-cream shadow-soft overflow-hidden"
                >
                  {/* Severity band */}
                  <motion.div variants={fadeUp} className={`${tone.bg} px-7 py-6`}>
                    <div className="flex items-start gap-4">
                      <span className={`grid place-items-center w-11 h-11 rounded-2xl bg-cream ${tone.text} shrink-0`}>
                        <SeverityIcon size={20} strokeWidth={2} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-mute mb-1.5">
                          Likely condition
                        </p>
                        <h2 className="font-display text-2xl font-semibold text-ink leading-tight">
                          {result.disease}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <span className={`px-3 py-1 rounded-full bg-cream text-xs font-semibold ${tone.text}`}>
                            {result.severity} severity
                          </span>
                          {typeof result.confidence === 'number' && result.confidence > 0 && (
                            <span className="px-3 py-1 rounded-full bg-cream text-xs font-medium text-ink-soft tabular-nums">
                              {result.confidence}% confidence
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div className="px-7 py-7 space-y-7">
                    {result.description && (
                      <motion.p variants={fadeUp} className="text-[0.95rem] text-ink-soft leading-relaxed">
                        {result.description}
                      </motion.p>
                    )}

                    {result.matchedSymptoms?.length > 0 && (
                      <motion.div variants={fadeUp}>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-mute mb-3">
                          Matched signs
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.matchedSymptoms.map((s) => (
                            <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-mist text-ink-soft">
                              {s}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {result.recommendations?.length > 0 && (
                      <motion.div variants={fadeUp}>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-mute mb-4">
                          What to do now
                        </h3>
                        <ul className="space-y-3">
                          {result.recommendations.map((r, i) => (
                            <li key={i} className="flex gap-3 text-sm text-ink-soft leading-relaxed">
                              <span className="grid place-items-center w-5 h-5 rounded-full bg-blush-100 text-blush-600 text-[0.65rem] font-bold shrink-0 mt-0.5 tabular-nums">
                                {i + 1}
                              </span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {result.seeVetIf && (
                      <motion.div variants={fadeUp} className="rounded-2xl bg-blush-50 px-5 py-4">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-blush-600 mb-2">
                          See a vet if
                        </h3>
                        <p className="text-sm text-ink leading-relaxed">{result.seeVetIf}</p>
                      </motion.div>
                    )}

                    <motion.p variants={fadeUp} className="text-xs text-ink-mute leading-relaxed pt-2 border-t border-hairline">
                      {result.disclaimer ||
                        'This is an AI-assisted suggestion, not a veterinary diagnosis. Please consult a licensed vet before acting on it.'}
                    </motion.p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="rounded-[2rem] border border-dashed border-hairline py-20 px-6 text-center"
                >
                  <span className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-mist text-ink-mute mb-5">
                    <Stethoscope size={21} />
                  </span>
                  <p className="font-medium text-ink mb-2">Your result will appear here</p>
                  <p className="text-sm text-ink-soft max-w-xs mx-auto">
                    The more detail you give about the symptoms, the better the guidance.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DiseasePrediction;
