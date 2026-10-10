import { motion } from 'framer-motion';
import {
  Cpu, Stethoscope, HeartHandshake, ShieldCheck,
  FileText, CalendarCheck, BellRing, BookOpen, Check,
} from 'lucide-react';

import Container from '../components/ui/Container';
import PageHeader from '../components/ui/PageHeader';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import { stagger, fadeUp, revealOnce, EASE } from '../components/ui/motion';

const pillars = [
  {
    icon: Cpu,
    title: 'Technology-driven',
    body: 'We use machine learning to surface health insights and recommendations that fit your specific pet, not a generic average.',
  },
  {
    icon: Stethoscope,
    title: 'Veterinary partnership',
    body: 'Licensed vets and care professionals review what we publish, and you can book them through the same platform.',
  },
];

const offerings = [
  { icon: FileText, label: 'Pet health record management' },
  { icon: CalendarCheck, label: 'Veterinary appointment scheduling' },
  { icon: Stethoscope, label: 'AI-assisted symptom guidance' },
  { icon: BellRing, label: 'Vaccination and medication reminders' },
  { icon: BookOpen, label: 'Educational resources and care tips' },
  { icon: ShieldCheck, label: 'Health-screened pet listings' },
];

// This is a student project. The catalogue figures are real (they come from
// the database); the usage figures are sample data and labelled as such below.
const stats = [
  ['6', 'Pet categories'],
  ['38', 'Breeds listed'],
  ['20', 'Products stocked'],
  ['3', 'Groomers on staff'],
];

const About = () => (
  <div className="min-h-screen pb-24 bg-blush-50">
    <PageHeader
      eyebrow="About"
      title="About Pet Care Hub"
      subtitle="A pet shop, grooming service and health reference, built as one site so you are not juggling three of them."
    />

    {/* Mission with image */}
    <Container className="pt-10">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div variants={fadeUp} {...revealOnce} className="relative">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-mist">
            <img
              src="/about/about.png"
              alt="A pet being cared for"
              className="w-full h-full object-cover"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="absolute -bottom-6 -right-2 sm:right-6 px-6 py-5 rounded-3xl bg-cream shadow-lift border border-hairline"
          >
            <span className="grid place-items-center w-10 h-10 rounded-2xl bg-blush-100 text-blush-600 mb-3">
              <HeartHandshake size={19} strokeWidth={1.9} />
            </span>
            <p className="text-lg font-semibold text-ink">Since 2024</p>
            <p className="text-xs text-ink-mute mt-0.5">Built in Punjab, India</p>
          </motion.div>
        </motion.div>

        <motion.div variants={stagger(0, 0.1)} {...revealOnce}>
          <motion.span
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-blush-500"
          >
            Our mission
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-4 text-2xl sm:text-3xl leading-tight text-ink"
          >
            Why we built it
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-base sm:text-lg text-ink-soft leading-relaxed"
          >
            Our platform combines modern technology with veterinary expertise to
            give pet owners the tools they need — finding the right companion,
            keeping them healthy, and knowing who to call when something seems off.
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-base text-ink-soft leading-relaxed"
          >
            No upsells disguised as advice. No hidden fees at pickup. Just the
            information and services you actually need.
          </motion.p>
        </motion.div>
      </div>
    </Container>

    {/* Stats band */}
    <Container className="pt-24">
      <motion.div
        variants={stagger(0, 0.08)}
        {...revealOnce}
        className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden bg-hairline"
      >
        {stats.map(([value, label]) => (
          <motion.div key={label} variants={fadeUp} className="bg-cream px-6 py-10 text-center">
            <p className="text-2xl font-semibold text-ink">{value}</p>
            <p className="text-sm text-ink-soft mt-2">{label}</p>
          </motion.div>
        ))}
      </motion.div>
    </Container>

    {/* Pillars */}
    <section className="py-24">
      <Container>
        <motion.div
          variants={stagger(0, 0.1)}
          {...revealOnce}
          className="grid md:grid-cols-2 gap-6"
        >
          {pillars.map(({ icon: Icon, title, body }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="p-8 sm:p-10 rounded-2xl bg-cream border border-hairline"
            >
              <span className="grid place-items-center w-12 h-12 rounded-2xl bg-blush-100 text-blush-600 mb-7">
                <Icon size={21} strokeWidth={1.9} />
              </span>
              <h3 className="text-lg font-semibold text-ink mb-3">{title}</h3>
              <p className="text-[0.95rem] text-ink-soft leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>

    {/* What we offer */}
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="What we offer"
          title="What the site does"
          className="mb-14"
        />

        <motion.div
          variants={stagger(0, 0.06)}
          {...revealOnce}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
        >
          {offerings.map(({ icon: Icon, label }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="flex items-center gap-4 p-5 rounded-2xl bg-cream border border-hairline"
            >
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-blush-50 text-blush-500 shrink-0">
                <Icon size={18} strokeWidth={1.9} />
              </span>
              <span className="text-sm font-medium text-ink leading-snug">{label}</span>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <Button to="/pet-services" size="lg">Browse pets</Button>
          <Button to="/contact" variant="outline" size="lg">Talk to us</Button>
        </div>
      </Container>
    </section>
  </div>
);

export default About;
