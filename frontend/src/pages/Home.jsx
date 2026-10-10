import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Minus, Plus,
  PawPrint, Cat, Rabbit, Bird, Fish, Turtle,
} from 'lucide-react';

import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import PetCard from '../components/PetCard';
import ChatWidget from '../components/ChatWidget';
import { CardSkeleton } from '../components/ui/Skeleton';
import { fadeUp, stagger, EASE } from '../components/ui/motion';
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
  const [counts, setCounts] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);


  useEffect(() => {
    let alive = true;

    // One pass over the catalogue gives the fact strip, the category counts
    // and the featured dogs, so the page makes three requests instead of five.
    Promise.allSettled([
      apiService.getPetsByType(),
      apiService.getBreedsByPet(),
      apiService.getGroomers(),
    ])
      .then(([pets, breeds, groomers]) => {
        if (!alive) return;

        const all = pets.status === 'fulfilled' ? pets.value.pets || [] : [];
        setFeatured(all.filter((p) => p.type === 'Dog').slice(0, 3));

        setCategoryStats(
          CATEGORY_ORDER.map((name) => {
            const group = all.filter((p) => p.type === name);
            return {
              name,
              count: group.length,
              from: group.length ? Math.min(...group.map((p) => p.price)) : null,
            };
          })
        );

        setCounts({
          breeds: breeds.status === 'fulfilled' ? (breeds.value.breeds || []).length : null,
          groomers: groomers.status === 'fulfilled' ? (groomers.value || []).length : null,
        });
      })
      .finally(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, []);

  return (
    <div>
      {/* ---------------- Hero ---------------- */}
      {/* No stat grid here -- a row of label/number tiles reads exactly like
          the category row further down. One inline line carries the same
          facts and leaves the frame to the video. */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="absolute inset-0">
          {/* scale-105 hides the soft edge a blur leaves at the frame */}
          <video
            autoPlay loop muted playsInline
            poster="/home/hello.png"
            className="w-full h-full object-cover scale-105 blur-[3px]"
          >
            <source src="/home/HOMEE.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/80 to-transparent" />
          <div className="absolute inset-0 bg-blush-50/25" />
        </div>

        <Container className="relative py-20 sm:py-28 lg:py-32">
          <motion.div
            variants={stagger(0, 0.06)}
            initial="hidden"
            animate="show"
            className="max-w-xl"
          >
            <motion.h1
              variants={fadeUp}
              className="text-3xl sm:text-4xl leading-tight text-ink"
            >
              Find a pet, book a groomer,
              <br className="hidden sm:block" /> order their food.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-lg leading-relaxed text-ink-soft"
            >
              A pet care shop and clinic directory run out of Phagwara, Punjab.
              Every listing is priced on the page, and grooming slots are open
              seven days a week.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
              <Button to="/pet-services" size="lg">
                Browse pets
                <ArrowRight size={16} strokeWidth={2.2} />
              </Button>
              <Button to="/grooming" variant="outline" size="lg">
                Grooming prices
              </Button>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-sm text-ink-soft"
            >
              {counts?.breeds ?? 38} breeds listed
              <Dot />
              grooming from $15
              <Dot />
              free shipping over $75
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* ---------------- Categories ---------------- */}
      {/* A count and a starting price say more than six stock photos. */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <SectionHeading
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
                  className="group flex flex-col items-center justify-center gap-2.5 aspect-square rounded-xl border border-hairline bg-cream hover:border-blush-300 hover:bg-blush-50 transition-colors"
                >
                  <span className="grid place-items-center w-12 h-12 rounded-full bg-blush-50 text-blush-500 transition-colors group-hover:bg-cream">
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
                <SectionHeading title="Dogs looking for a home" />
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
              <SectionHeading title="Grooming prices" className="mb-7" />

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
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
            <SectionHeading
              title="What you can do here"
              subtitle="Four things, each on its own page."
            />

            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
              <Item
                to="/pet-services"
                title="Browse and filter pets"
                body="Six categories, every listing priced and tagged with temperament. Filter by breed or budget."
              />
              <Item
                to="/essentials"
                title="Order supplies"
                body="Food, bedding, toys, carriers and care kits. Stock status is shown per item, not guessed."
              />
              <Item
                to="/grooming"
                title="Book grooming"
                body="Pick a groomer by speciality, then a slot. Taken slots are greyed out before you commit."
              />
              <Item
                to="/disease-prediction"
                title="Check symptoms"
                body="Describe what you're seeing and get triage guidance against a reference of common conditions."
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="py-16 sm:py-20 border-t border-hairline">
        <Container>
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-20">
            <SectionHeading title="Questions people ask" />

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

const Dot = () => <span className="mx-2 text-ink-mute">·</span>;

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
