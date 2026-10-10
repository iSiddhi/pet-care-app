/**
 * Builds the "what this website is" block that goes into the chatbot's
 * system prompt.
 *
 * The numbers come from the live DB rather than being hardcoded, so the
 * bot never claims we stock something we don't. It's cached because this
 * would otherwise run six queries on every single chat message.
 */
const Pet = require('../models/Pet');
const Breed = require('../models/Breed');
const Product = require('../models/Product');
const Groomer = require('../models/Groomer');

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
let cache = { text: null, builtAt: 0 };

// Static facts that don't live in the DB
const STATIC = `
WEBSITE: Pet Care Hub (petcarehub.com) — an Indian pet care platform based in Phagwara, Punjab.
It brings four things into one place: browsing pets for adoption/purchase, buying pet
essentials, booking grooming, and checking symptoms with an AI health assistant.

PAGES AND WHAT THEY DO:
- Home (/) — overview, featured pets, and you (the chat assistant).
- Pet Services (/pet-services) — browse pets by category and breed, filter by price.
- Pet Finder (/pet-finder) — pick pet type, breed and budget to get a shortlist.
- Essentials (/essentials) — shop food, toys, bedding, grooming kits, habitat gear.
- Grooming (/grooming) — see groomers and services, request a slot.
- Health Check (/disease-prediction) — describe symptoms, get guidance. Not a diagnosis.
- Gallery (/gallery) — photos from the community.
- Our Team (/team), About (/about), Contact (/contact).
- Consultant (/consult-adii-jain) — free 15-20 min call with Adii Jain, our store consultant.
- Account (/account) — orders and grooming bookings. Requires signing in.

HOW ORDERING WORKS: add items to the bag from Essentials, sign in, then check out.
Shipping is $4.99, free over $75. Payment options are cash on delivery, UPI or card.
Carts are saved to the account, so they follow you between devices.

GROOMING SERVICES AND PRICES:
- Basic Grooming $35-50 (1-2 hrs) — bath, blow-dry, brush-out, tidy trim
- Premium Spa $60-80 (2-3 hrs) — deep conditioning, de-shed, massage
- Nail Trimming $15-25 (30 min)
- Dental Care $25-40 (45 min)
- Flea Treatment $30-45 (1 hr)
- Full Package $80-120 (3-4 hrs)
Slots run 9am-5pm, eight a day, seven days a week.

CONTACT: support@petcarehub.com, +91 98765 43210, Mon-Sat 10am-7pm IST.
`.trim();

const buildLive = async () => {
  const [petsByType, breedCount, products, groomers] = await Promise.all([
    Pet.aggregate([
      { $match: { available: true } },
      { $group: { _id: '$type', count: { $sum: 1 }, min: { $min: '$price' }, max: { $max: '$price' } } },
      { $sort: { _id: 1 } },
    ]),
    Breed.countDocuments(),
    Product.find().select('petType category price inStock'),
    Groomer.find({ active: true }).select('name specialties experienceYears rating'),
  ]);

  const petLines = petsByType.length
    ? petsByType
        .map((p) => `- ${p._id}: ${p.count} listed, $${p.min}-$${p.max}`)
        .join('\n')
    : '- No pets currently listed.';

  const categories = [...new Set(products.map((p) => p.category))].sort();
  const inStock = products.filter((p) => p.inStock).length;
  const prices = products.map((p) => p.price);
  const productLine = products.length
    ? `${products.length} products (${inStock} in stock) across: ${categories.join(', ')}. ` +
      `Prices $${Math.min(...prices).toFixed(2)}-$${Math.max(...prices).toFixed(2)}.`
    : 'No products currently listed.';

  const groomerLines = groomers.length
    ? groomers
        .map(
          (g) =>
            `- ${g.name}${g.experienceYears ? ` (${g.experienceYears} yrs` : ''}` +
            `${g.rating ? `, ${g.rating}★)` : g.experienceYears ? ')' : ''} — ${g.specialties.join(', ')}`
        )
        .join('\n')
    : '- No groomers currently listed.';

  return `
CURRENT STOCK (live, do not invent anything beyond this):
${petLines}
We list ${breedCount} breeds in total across these categories.

ESSENTIALS: ${productLine}

GROOMERS ON STAFF:
${groomerLines}
`.trim();
};

/**
 * Returns the full context string. Falls back to the static half if the
 * DB is unreachable, so the bot degrades instead of breaking.
 */
const getSiteContext = async () => {
  const fresh = cache.text && Date.now() - cache.builtAt < CACHE_TTL_MS;
  if (fresh) return cache.text;

  try {
    const live = await buildLive();
    cache = { text: `${STATIC}\n\n${live}`, builtAt: Date.now() };
  } catch (err) {
    console.error('Site context build failed, using static only:', err.message);
    cache = { text: STATIC, builtAt: Date.now() };
  }

  return cache.text;
};

// Call after seeding or any catalogue change so the bot picks it up at once
const invalidateSiteContext = () => { cache = { text: null, builtAt: 0 }; };

module.exports = { getSiteContext, invalidateSiteContext };
