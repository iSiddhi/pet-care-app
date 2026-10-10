import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Minus, Plus,
  PawPrint, Cat, Rabbit, Bird, Fish, Turtle,
  ShoppingBag, Scissors, Stethoscope,
} from 'lucide-react';

import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import PetCard from '../components/PetCard';
import ChatWidget from '../components/ChatWidget';
import { CardSkeleton } from '../components/ui/Skeleton';
import { EASE } from '../components/ui/motion';
import { apiService } from '../services/api';

const CATEGORIES = [
  { name: 'Dog', icon: PawPrint },
  { name: 'Cat', icon: Cat },
  { name: 'Rabbit', icon: Rabbit },
  { name: 'Birds', icon: Bird },
  { name: 'Fish', icon: Fish },
  { name: 'Turtle', icon: Turtle },
];

const CATEGORY_ORDER = CATEGORIES.map((c) => c.name);

// Mirrors backend/utils/upi.js and the grooming page. Kept here rather than
// behind an icon card because a price list is the thing people actually want.
const GROOMING = [
  ['Nail trimming', '$15–25', '30 min'],
  ['Dental care', '$25–40', '45 min'],
  ['Basic grooming', '$35–50', '1–2 hrs'],
  ['Flea treatment', '$30–45', '1 hr'],
  ['Premium spa', '$60–80', '2–3 hrs'],
  ['Full package', '$80–120', '3–4 hrs'],
];

const FAQS = [
  {
    q: 'How does payment work?',
    a: 'UPI only. At checkout you get a QR code that goes straight to our UPI ID. After paying you enter the 12-digit reference number from your app, and we match it against our statement before dispatch. Shipping is $4.99, free over $75.',
  },
  {
    q: 'Is the health check a diagnosis?',
    a: 'No. It reads your description against a reference of 15 common conditions and tells you what to look into and when to see a vet. It is triage guidance, not a diagnosis, and it says so on every result.',
  },
  {
    q: 'What happens to my cart if I am not signed in?',
    a: 'It is kept in your browser. When you sign in, it merges into your account rather than being replaced, so nothing you added is lost.',
  },
  {
    q: 'Can I cancel a grooming booking?',
    a: 'Yes, from your account page, any time before the slot. Slots run 9am to 5pm, eight a day, seven days a week.',
  },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);


  useEffect(() => {
    let alive = true;

    // One pass over the catalogue covers both the featured dogs and the
    // per-category counts, so the page makes a single request.
    apiService
      .getPetsByType()
      .then((res) => {
        if (!alive) return;
        const all = res.pets || [];

        setFeatured(all.filter((p) => p.type === 'Dog').slice(0, 3));
        setCategoryStats(
          CATEGORY_ORDER.map((name) => ({
            name,
            count: all.filter((p) => p.type === name).length,
          }))
        );
      })
      .catch(() => {
        if (alive) setFeatured([]);
      })
      .finally(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, []);

  return (
    <div>
      {/* ---------------- Hero ---------------- */}
      {/* Soft lavender-to-pink wash: enough colour to be its own band,
          light enough to keep ink text. */}
      <section className="relative overflow-hidden min-h-[57vh] lg:min-h-[64vh] flex items-center">
        {/* Masked rather than covered by a gradient: a cream overlay still
            leaves the video's own hard edge. The mask dissolves the whole
            layer — footage and wash together — into the page below. */}
        <div
          className="absolute inset-0"
          style={{
            maskImage:
              'linear-gradient(to bottom, #000 0%, #000 55%, rgba(0,0,0,0.6) 78%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, #000 0%, #000 55%, rgba(0,0,0,0.6) 78%, transparent 100%)',
          }}
        >
          <video
            autoPlay loop muted playsInline
            poster="/home/hello.png"
            className="w-full h-full object-cover scale-[1.03] blur-[2px]"
          >
            <source src="/home/HOMEE.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-br from-blush-200/75 via-blush-100/70 to-lilac-100/70" />
        </div>

        <Container className="relative w-full pt-20 pb-28 sm:pt-24 sm:pb-32 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight text-ink">
            Welcome to Pet Care Hub
          </h1>

          <p className="mt-5 text-lg text-ink-soft leading-relaxed max-w-2xl mx-auto">
            Find a pet, book a groomer and order their supplies — all priced on
            the page, all in one place.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button to="/pet-services" size="lg">
              Explore Services
              <ArrowRight size={16} strokeWidth={2.2} />
            </Button>
            <Button to="/grooming" variant="outline" size="lg">
              Grooming prices
            </Button>
          </div>
        </Container>
      </section>

      {/* ---------------- Categories ---------------- */}
      {/* A count and a starting price say more than six stock photos. */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <SectionHeading
              align="left"
              title="Browse by kind"
              subtitle="Filter by breed and budget on the next page."
            />
            <Link
              to="/pet-services"
              className="text-sm font-medium text-ink hover:text-blush-500 transition-colors"
            >
              All pets →
            </Link>
          </div>

          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORIES.map(({ name, icon: Icon }) => {
              const stat = categoryStats.find((c) => c.name === name);
              return (
                <Link
                  key={name}
                  to="/pet-services"
                  className="group flex flex-col items-center justify-center gap-2.5 aspect-square rounded-xl border border-hairline bg-cream transition-shadow duration-200 hover:shadow-soft"
                >
                  <span className="grid place-items-center w-12 h-12 rounded-full bg-mist text-ink-soft transition-colors group-hover:text-ink">
                    <Icon size={22} strokeWidth={1.8} />
                  </span>
                  <span className="text-sm font-medium text-ink">{name}</span>
                  <span className="text-xs text-ink-mute tabular-nums">
                    {stat ? `${stat.count} listed` : '\u00a0'}
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ---------------- Featured + grooming prices, side by side ---------------- */}
      <section className="py-16 sm:py-20 border-y border-hairline bg-shell">
        <Container>
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-16">
            {/* Pets */}
            <div>
              <div className="flex items-end justify-between gap-4 mb-7">
                <SectionHeading align="left" title="Dogs looking for a home" />
                <Link
                  to="/pet-services"
                  className="text-sm font-medium text-ink hover:text-blush-500 transition-colors shrink-0"
                >
                  See all →
                </Link>
              </div>

              {loading ? (
                <div className="grid sm:grid-cols-3 gap-5">
                  {[0, 1, 2].map((i) => <CardSkeleton key={i} />)}
                </div>
              ) : featured.length > 0 ? (
                <div className="grid sm:grid-cols-3 gap-5">
                  {featured.map((pet, i) => (
                    <Link key={pet._id || i} to="/pet-services">
                      <PetCard pet={pet} index={i} />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-soft rounded-2xl border border-dashed border-hairline py-12 text-center">
                  Listings load once the API is reachable.
                </p>
              )}
            </div>

            {/* Price list — plain table, no cards */}
            <div>
              <SectionHeading align="left" title="Grooming prices" className="mb-7" />

              <table className="w-full text-sm">
                <tbody>
                  {GROOMING.map(([name, price, time]) => (
                    <tr key={name} className="border-b border-hairline last:border-0">
                      <td className="py-3 pr-3 text-ink">{name}</td>
                      <td className="py-3 pr-3 text-ink-mute text-xs whitespace-nowrap">{time}</td>
                      <td className="py-3 text-right font-medium text-ink tabular-nums whitespace-nowrap">
                        {price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-xs text-ink-mute mt-4 leading-relaxed">
                Range covers small to large breeds. The price is confirmed before
                we start — nothing is added at pickup.
              </p>

              <Button to="/grooming" variant="outline" size="sm" className="mt-5">
                Book a slot
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- What's here ---------------- */}
      {/* Card grid on a tinted band — the FAQ below already uses the
          heading-left / content-right split, so repeating it here made the
          two sections read as one. */}
      <section className="py-16 sm:py-20 bg-shell border-y border-hairline">
        <Container>
          <SectionHeading
            title="What you can do here"
            subtitle="Four things, each on its own page."
            className="mb-10"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                to: '/pet-services',
                icon: PawPrint,
                title: 'Browse and filter pets',
                body: 'Six categories, every listing priced and tagged with temperament.',
              },
              {
                to: '/essentials',
                icon: ShoppingBag,
                title: 'Order supplies',
                body: 'Food, bedding, toys, carriers and care kits, with stock shown per item.',
              },
              {
                to: '/grooming',
                icon: Scissors,
                title: 'Book grooming',
                body: 'Pick a groomer by speciality, then a slot. Taken slots are greyed out.',
              },
              {
                to: '/disease-prediction',
                icon: Stethoscope,
                title: 'Check symptoms',
                body: 'Describe what you are seeing and get guidance on what to look into.',
              },
            ].map(({ to, icon: Icon, title, body }) => (
              <Link
                key={to}
                to={to}
                className="group flex flex-col p-6 rounded-lg bg-cream border border-hairline shadow-soft transition-shadow duration-200 hover:shadow-lift"
              >
                <span className="grid place-items-center w-11 h-11 rounded-lg bg-blush-100 text-blush-600 mb-4">
                  <Icon size={20} strokeWidth={1.9} />
                </span>
                <h3 className="text-[0.95rem] font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blush-600">
                  Open
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="py-16 sm:py-20 border-t border-hairline">
        <Container>
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-20">
            <SectionHeading align="left" title="Questions people ask" />

            <div>
              {FAQS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={f.q} className="border-b border-hairline first:border-t">
                    <button
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      className="flex items-start justify-between gap-6 w-full py-5 text-left group"
                      aria-expanded={open}
                    >
                      <span className="text-[0.95rem] font-medium text-ink group-hover:text-blush-500 transition-colors">
                        {f.q}
                      </span>
                      <span className="shrink-0 mt-0.5 text-ink-mute">
                        {open ? <Minus size={16} /> : <Plus size={16} />}
                      </span>
                    </button>

                    <motion.div
                      initial={false}
                      animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                      transition={{ duration: 0.22, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-10 text-sm text-ink-soft leading-relaxed">
                        {f.a}
                      </p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- Closing ---------------- */}
      <section className="border-t border-hairline bg-shell">
        <Container className="py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-xl sm:text-2xl leading-snug text-ink">
                Not sure which pet suits your flat?
              </h2>
              <p className="mt-3 text-ink-soft leading-relaxed">
                Answer three questions — type, breed and budget — and we'll
                shortlist what fits.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button to="/pet-finder" size="lg">Try the pet finder</Button>
              <Button to="/contact" variant="outline" size="lg">Contact us</Button>
            </div>
          </div>
        </Container>
      </section>

      <ChatWidget />
    </div>
  );
};

const Item = ({ to, title, body }) => (
  <Link to={to} className="group block">
    <h3 className="text-[0.95rem] font-semibold text-ink flex items-center gap-1.5">
      {title}
      <ArrowRight
        size={14}
        className="text-blush-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
      />
    </h3>
    <p className="mt-2 text-sm text-ink-soft leading-relaxed">{body}</p>
  </Link>
);

export default Home;
