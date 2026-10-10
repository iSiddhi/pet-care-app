import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  PawPrint, ShoppingBag, Scissors, Search, Stethoscope, Images,
  ArrowRight, ShieldCheck, Clock, HeartHandshake, Star,
} from 'lucide-react';

import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import PetCard from '../components/PetCard';
import ChatWidget from '../components/ChatWidget';
import { CardSkeleton } from '../components/ui/Skeleton';
import { fadeUp, stagger, revealOnce, EASE } from '../components/ui/motion';
import { apiService } from '../services/api';

const categories = [
  { name: 'Dog', image: '/PetServices/Dog1.png', count: '12 breeds' },
  { name: 'Cat', image: '/PetServices/cat1.png', count: '9 breeds' },
  { name: 'Rabbit', image: '/PetServices/rabbit1.png', count: '6 breeds' },
  { name: 'Birds', image: '/PetServices/birds1.png', count: '8 breeds' },
  { name: 'Fish', image: '/PetServices/fish1.png', count: '7 breeds' },
  { name: 'Turtle', image: '/PetServices/turtle1.png', count: '5 breeds' },
];

const services = [
  { to: '/pet-services', label: 'Pet Services', desc: 'Browse pets by category, breed and budget.', icon: PawPrint },
  { to: '/essentials', label: 'Essentials', desc: 'Food, toys, bedding and care kits.', icon: ShoppingBag },
  { to: '/grooming', label: 'Grooming', desc: 'Book a vetted groomer near you.', icon: Scissors },
  { to: '/pet-finder', label: 'Pet Finder', desc: 'Match with a pet that fits your life.', icon: Search },
  { to: '/disease-prediction', label: 'Health Check', desc: 'Describe symptoms, get guidance.', icon: Stethoscope },
  { to: '/gallery', label: 'Gallery', desc: 'Moments from our community.', icon: Images },
];

const promises = [
  { icon: ShieldCheck, title: 'Vet-checked', body: 'Every pet listed is health-screened and documented before it appears here.' },
  { icon: Clock, title: 'Same-week booking', body: 'Grooming slots open eight times a day, seven days a week.' },
  { icon: HeartHandshake, title: 'Care after adoption', body: 'Free follow-up guidance for the first six months. No upsell.' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();

  // Gentle parallax on the hero video
  const videoY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 420], [1, 0]);

  useEffect(() => {
    let alive = true;
    apiService
      .getPetsByType('Dog')
      .then((res) => { if (alive) setFeatured((res.pets || []).slice(0, 3)); })
      .catch(() => { if (alive) setFeatured([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ---------------- Hero ---------------- */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <motion.div style={{ y: videoY }} className="absolute inset-0 -top-20 -bottom-20">
          <video
            autoPlay loop muted playsInline
            poster="/home/hello.png"
            className="w-full h-full object-cover"
          >
            <source src="/home/HOMEE.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Pastel wash instead of a hard dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blush-100/85 via-lilac-100/70 to-sage-100/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/20 to-transparent" />

        <Container className="relative z-10 py-24">
          <motion.div
            variants={stagger(0.1, 0.1)}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cream/60 text-xs font-semibold tracking-wide text-ink mb-7"
            >
              <Star size={13} className="fill-blush-400 text-blush-400" />
              Trusted by 2,000+ pet parents
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-[2.75rem] sm:text-6xl lg:text-[4.25rem] leading-[1.03] text-ink"
            >
              Everything your pet
              <br />
              needs, in one
              <span className="relative inline-block ml-3">
                <span className="relative z-10">place.</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
                  style={{ originX: 0 }}
                  className="absolute left-0 right-0 bottom-1.5 h-3 sm:h-4 bg-blush-200/80 rounded-full -z-0"
                />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-7 text-lg sm:text-xl leading-relaxed text-ink-soft max-w-xl"
            >
              Find a companion, book grooming, shop essentials and check
              symptoms — without juggling five different apps.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-3">
              <Button to="/pet-services" size="lg">
                Explore pets
                <ArrowRight size={17} strokeWidth={2.2} />
              </Button>
              <Button to="/grooming" variant="outline" size="lg">
                Book grooming
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-14 flex flex-wrap gap-x-10 gap-y-5"
            >
              {[
                ['2,000+', 'Happy families'],
                ['47', 'Breeds listed'],
                ['4.9', 'Average rating'],
              ].map(([stat, label]) => (
                <div key={label}>
                  <p className="font-display text-2xl font-semibold text-ink">{stat}</p>
                  <p className="text-sm text-ink-soft mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </Container>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-ink/25 flex justify-center pt-2"
          >
            <span className="w-1 h-1.5 rounded-full bg-ink/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ---------------- Categories ---------------- */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <SectionHeading
              align="left"
              eyebrow="Browse"
              title="Find them by kind"
              subtitle="Six categories, every one vet-checked before it reaches this page."
              className="mx-0"
            />
            <Link
              to="/pet-services"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-blush-500 transition-colors group"
            >
              View all
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <motion.div
            variants={stagger(0, 0.07)}
            {...revealOnce}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5"
          >
            {categories.map((cat) => (
              <motion.div key={cat.name} variants={fadeUp}>
                <Link
                  to="/pet-services"
                  className="group block relative aspect-[3/4] rounded-3xl overflow-hidden bg-mist"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-cream font-semibold leading-tight">{cat.name}</p>
                    <p className="text-cream/70 text-xs mt-0.5">{cat.count}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ---------------- Services ---------------- */}
      <section className="py-20 sm:py-28 bg-shell">
        <Container>
          <SectionHeading
            eyebrow="What we do"
            title="Care that covers the whole journey"
            subtitle="From the first meeting to the thousandth walk — the tools you need, none you don't."
            className="mb-16"
          />

          <motion.div
            variants={stagger(0, 0.07)}
            {...revealOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {services.map(({ to, label, desc, icon: Icon }) => (
              <motion.div key={to} variants={fadeUp}>
                <Link
                  to={to}
                  className="group block h-full p-7 rounded-3xl bg-cream border border-hairline hover:border-blush-200 hover:shadow-lift transition-all duration-300"
                >
                  <span className="grid place-items-center w-12 h-12 rounded-2xl bg-blush-50 text-blush-500 mb-6 transition-colors group-hover:bg-blush-100">
                    <Icon size={21} strokeWidth={1.9} />
                  </span>
                  <h3 className="text-lg font-semibold text-ink mb-2">{label}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed mb-5">{desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blush-500">
                    Explore
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ---------------- Featured pets (live from the API) ---------------- */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <SectionHeading
              align="left"
              eyebrow="Looking for a home"
              title="Meet a few of them"
              className="mx-0"
            />
            <Link
              to="/pet-services"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-blush-500 transition-colors group"
            >
              See everyone
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[0, 1, 2].map((i) => <CardSkeleton key={i} />)}
            </div>
          ) : featured.length > 0 ? (
            <motion.div
              variants={stagger(0, 0.1)}
              {...revealOnce}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {featured.map((pet, i) => (
                <Link key={pet._id || i} to="/pet-services">
                  <PetCard pet={pet} index={i} />
                </Link>
              ))}
            </motion.div>
          ) : (
            <div className="rounded-3xl border border-dashed border-hairline py-16 text-center">
              <p className="text-ink-soft">
                Pets will appear here once the API is reachable.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* ---------------- Promises ---------------- */}
      <section className="py-20 sm:py-28 bg-shell">
        <Container>
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <motion.div variants={fadeUp} {...revealOnce} className="relative">
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-blush-50">
                <img
                  src="/illustrations/pets-at-home.svg"
                  alt="A dog and a cat resting together at home"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
                className="absolute -bottom-6 -right-2 sm:right-6 px-6 py-5 rounded-3xl bg-cream shadow-lift border border-hairline"
              >
                <div className="flex items-center gap-1 mb-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="fill-blush-400 text-blush-400" />
                  ))}
                </div>
                <p className="font-display text-xl font-semibold text-ink">4.9 out of 5</p>
                <p className="text-xs text-ink-mute mt-0.5">from 1,240 reviews</p>
              </motion.div>
            </motion.div>

            <motion.div variants={stagger(0, 0.1)} {...revealOnce}>
              <motion.span
                variants={fadeUp}
                className="text-xs font-semibold uppercase tracking-[0.18em] text-blush-500"
              >
                Why us
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="mt-4 text-3xl sm:text-4xl leading-[1.12] text-ink"
              >
                Three things we refuse to cut corners on
              </motion.h2>

              <div className="mt-10 space-y-7">
                {promises.map(({ icon: Icon, title, body }) => (
                  <motion.div key={title} variants={fadeUp} className="flex gap-4">
                    <span className="grid place-items-center w-11 h-11 rounded-2xl bg-blush-100 text-blush-600 shrink-0">
                      <Icon size={19} strokeWidth={1.9} />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-ink">{title}</h3>
                      <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">{body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section className="py-20 sm:py-28">
        <Container>
          <motion.div
            variants={fadeUp}
            {...revealOnce}
            className="relative rounded-[2.5rem] overflow-hidden px-7 py-20 sm:px-16 sm:py-24 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blush-100 via-lilac-100 to-sage-100" />
            <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-blush-200/50 blur-3xl" />
            <div className="absolute -bottom-20 -left-12 w-72 h-72 rounded-full bg-lilac-200/50 blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl sm:text-5xl leading-[1.1] text-ink max-w-2xl mx-auto">
                Ready to meet your next best friend?
              </h2>
              <p className="mt-6 text-base sm:text-lg text-ink-soft max-w-xl mx-auto leading-relaxed">
                Answer a few questions and we'll shortlist pets that suit your
                home, your schedule and your budget.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Button to="/pet-finder" size="lg">
                  Start the quiz
                  <ArrowRight size={17} strokeWidth={2.2} />
                </Button>
                <Button to="/contact" variant="outline" size="lg">
                  Talk to us
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      <ChatWidget />
    </div>
  );
};

export default Home;
