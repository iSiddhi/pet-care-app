import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Users, AlertCircle } from 'lucide-react';

import Container from '../components/ui/Container';
import PageHeader from '../components/ui/PageHeader';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { stagger, fadeUp, revealOnce } from '../components/ui/motion';
import { apiService } from '../services/api';

const VALUES = [
  { title: 'Animals first', body: 'If a decision is good for the business but bad for the animal, we do not make it.' },
  { title: 'Say the real price', body: 'Every fee is on the page before you commit. No add-ons at pickup.' },
  { title: 'Stay reachable', body: 'A person answers. Not a form, not a bot pretending to be one.' },
];

const OurTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    apiService
      .getTeam()
      .then((list) => setTeam(Array.isArray(list) ? list : []))
      .catch(() => {
        setTeam([]);
        setError("We couldn't load the team. Make sure the server is running.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div className="min-h-screen pb-24 bg-lilac-50">
      <PageHeader
        eyebrow="Our Team"
        title="Who runs this"
        subtitle="Two founders, working out of Phagwara, Punjab."
      />

      {/* Team grid */}
      <Container className="pt-10">
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-3xl bg-cream border border-hairline overflow-hidden">
                <div className="aspect-[4/5] shimmer" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-1/2 rounded-full shimmer" />
                  <div className="h-4 w-1/3 rounded-full shimmer" />
                  <div className="h-4 w-full rounded-full shimmer" />
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
        ) : team.length === 0 ? (
          <EmptyState icon={Users} title="No team members listed yet" />
        ) : (
          <motion.div
            variants={stagger(0, 0.1)}
            initial="hidden"
            animate="show"
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl"
          >
            {team.map((m) => (
              <motion.article
                key={m._id || m.id}
                variants={fadeUp}
                className="h-full flex flex-col bg-cream rounded-lg border border-hairline shadow-soft overflow-hidden transition-shadow duration-200 hover:shadow-lift"
              >
                <div className="aspect-[4/3] bg-mist">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col p-5">
                  <h3 className="text-base font-semibold text-ink">{m.name}</h3>
                  <p className="text-sm text-blush-600 font-medium mt-0.5">{m.role}</p>

                  {m.bio && (
                    <p className="mt-3 text-sm text-ink-soft leading-relaxed">{m.bio}</p>
                  )}

                  {m.email && (
                    <a
                      href={`mailto:${m.email}`}
                      className="inline-flex items-center gap-2 mt-4 pt-4 border-t border-hairline text-sm text-ink-soft hover:text-blush-500 transition-colors"
                    >
                      <Mail size={14} strokeWidth={1.9} />
                      <span className="truncate">{m.email}</span>
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </Container>

      {/* Values */}
      <section className="py-20 mt-16 border-t border-hairline">
        <Container>
          <SectionHeading
            eyebrow=""
            title="How we work"
            className="mb-14"
          />

          <motion.div
            variants={stagger(0, 0.1)}
            {...revealOnce}
            className="grid gap-8 md:grid-cols-3"
          >
            {VALUES.map((v, i) => (
              <motion.div key={v.title} variants={fadeUp}>
                <span className="text-3xl font-semibold text-blush-200 leading-none">
                  0{i + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-14 text-center">
            <Button to="/contact" size="lg">Get in touch</Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default OurTeam;
