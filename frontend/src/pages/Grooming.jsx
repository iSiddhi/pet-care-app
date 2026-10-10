import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Scissors, Sparkles, Hand, Smile, Droplets, Star,
  Mail, Phone, Clock, Award, AlertCircle, CalendarCheck,
} from 'lucide-react';

import Container from '../components/ui/Container';
import PageHeader from '../components/ui/PageHeader';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { stagger, fadeUp, revealOnce } from '../components/ui/motion';
import { apiService } from '../services/api';

const SERVICES = [
  { name: 'Basic Grooming', price: '$35–50', duration: '1–2 hours', icon: Scissors, desc: 'Bath, blow-dry, brush-out and a tidy trim.' },
  { name: 'Premium Spa', price: '$60–80', duration: '2–3 hours', icon: Sparkles, desc: 'Deep conditioning, de-shed treatment and massage.' },
  { name: 'Nail Trimming', price: '$15–25', duration: '30 mins', icon: Hand, desc: 'Clip, file and paw-pad check.' },
  { name: 'Dental Care', price: '$25–40', duration: '45 mins', icon: Smile, desc: 'Scaling, polish and breath freshening.' },
  { name: 'Flea Treatment', price: '$30–45', duration: '1 hour', icon: Droplets, desc: 'Medicated bath and full coat inspection.' },
  { name: 'Full Package', price: '$80–120', duration: '3–4 hours', icon: Award, desc: 'Everything above, in one sitting.' },
];

const STEPS = [
  { n: '01', title: 'Pick a groomer', body: 'Browse specialities and pick who suits your pet.' },
  { n: '02', title: 'Choose a slot', body: 'Eight slots a day, seven days a week.' },
  { n: '03', title: 'Drop in', body: "We'll message you when they're ready to collect." },
];

const Grooming = () => {
  const [groomers, setGroomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    apiService
      .getGroomers()
      .then((list) => setGroomers(Array.isArray(list) ? list : []))
      .catch(() => {
        setGroomers([]);
        setError("We couldn't load our groomers. Make sure the server is running.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div className="min-h-screen pb-24 bg-sage-50">
      <PageHeader
        eyebrow="Grooming"
        title="Grooming, priced before you book"
        subtitle="Three groomers, six services, slots nine to five every day. The price is agreed before we start."
      >
        <div className="flex flex-wrap gap-3">
          <Button href="#groomers" size="lg">
            <CalendarCheck size={17} strokeWidth={2.2} />
            Book a session
          </Button>
          <Button to="/contact" variant="outline" size="lg">
            Ask a question
          </Button>
        </div>
      </PageHeader>

      {/* Services */}
      <section className="py-16">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="Services"
            title="Services and prices"
            subtitle="The range covers small to large breeds. Nothing is added at pickup."
            className="mx-0 mb-12"
          />

          <motion.div
            variants={stagger(0, 0.06)}
            {...revealOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {SERVICES.map(({ name, price, duration, icon: Icon, desc }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                className="group p-7 rounded-3xl bg-cream border border-hairline hover:border-blush-200 hover:shadow-lift transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <span className="grid place-items-center w-12 h-12 rounded-2xl bg-blush-50 text-blush-500 transition-colors group-hover:bg-blush-100">
                    <Icon size={21} strokeWidth={1.9} />
                  </span>
                  <span className="text-base font-semibold text-ink">{price}</span>
                </div>

                <h3 className="text-lg font-semibold text-ink mb-2">{name}</h3>
                <p className="text-sm text-ink-soft leading-relaxed mb-5">{desc}</p>

                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-mute">
                  <Clock size={13} />
                  {duration}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Groomers — live from the API */}
      <section id="groomers" className="py-16 scroll-mt-24">
        <Container>
          <SectionHeading
            eyebrow="The team"
            title="Who will be grooming"
            subtitle="Pick by speciality. Each one is trained and insured."
            className="mb-14"
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-3xl bg-cream border border-hairline overflow-hidden">
                  <div className="aspect-[4/3] shimmer" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 w-1/2 rounded-full shimmer" />
                    <div className="h-4 w-3/4 rounded-full shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <EmptyState
              tone="error"
              icon={AlertCircle}
              title="Something went wrong"
              body={error}
              actionLabel="Try again"
              onAction={load}
            />
          ) : (
            <motion.div
              variants={stagger(0, 0.08)}
              {...revealOnce}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {groomers.map((g) => (
                <motion.article
                  key={g._id || g.id}
                  variants={fadeUp}
                  className="h-full flex flex-col bg-cream rounded-lg border border-hairline shadow-soft overflow-hidden transition-shadow duration-200 hover:shadow-lift"
                >
                  <div className="aspect-[4/3] bg-mist">
                    <img
                      src={g.avatar}
                      alt={g.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold text-ink">{g.name}</h3>
                      {g.rating && (
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink shrink-0">
                          <Star size={13} className="fill-blush-400 text-blush-400" />
                          {g.rating}
                        </span>
                      )}
                    </div>
                    {g.experienceYears > 0 && (
                      <p className="text-sm text-ink-mute mt-0.5">
                        {g.experienceYears} years experience
                      </p>
                    )}

                    {g.specialties?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {g.specialties.map((s) => (
                          <span
                            key={s}
                            className="text-xs px-2.5 py-1 rounded-full bg-blush-50 text-blush-600 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-5 pt-5 border-t border-hairline space-y-2.5">
                      {g.email && (
                        <a
                          href={`mailto:${g.email}`}
                          className="flex items-center gap-2.5 text-sm text-ink-soft hover:text-blush-500 transition-colors"
                        >
                          <Mail size={14} strokeWidth={1.9} />
                          <span className="truncate">{g.email}</span>
                        </a>
                      )}
                      {g.phone && (
                        <a
                          href={`tel:${g.phone}`}
                          className="flex items-center gap-2.5 text-sm text-ink-soft hover:text-blush-500 transition-colors"
                        >
                          <Phone size={14} strokeWidth={1.9} />
                          {g.phone}
                        </a>
                      )}
                    </div>

                    <Button to="/contact" variant="soft" size="sm" className="w-full mt-5">
                      Request a slot
                    </Button>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </Container>
      </section>

      {/* How it works */}
      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="How it works" title="Booking a slot" className="mb-14" />

          <motion.div
            variants={stagger(0, 0.1)}
            {...revealOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {STEPS.map((s) => (
              <motion.div key={s.n} variants={fadeUp} className="relative">
                <span className="text-3xl font-semibold text-blush-200 leading-none">
                  {s.n}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default Grooming;
