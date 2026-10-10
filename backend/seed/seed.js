require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Pet = require('../models/Pet');
const Breed = require('../models/Breed');
const Product = require('../models/Product');
const Groomer = require('../models/Groomer');
const TeamMember = require('../models/TeamMember');
const GalleryImage = require('../models/GalleryImage');
const Disease = require('../models/Disease');
const User = require('../models/User');

const data = require('./data');

const destroy = async () => {
  await Promise.all([
    Pet.deleteMany(), Breed.deleteMany(), Product.deleteMany(),
    Groomer.deleteMany(), TeamMember.deleteMany(), GalleryImage.deleteMany(),
    Disease.deleteMany(),
  ]);
  console.log('Catalogue collections cleared (users, orders and bookings untouched)');
};

const importData = async () => {
  await destroy();

  const breedDocs = Object.entries(data.breeds).flatMap(([petType, names]) =>
    names.map((name) => ({ name, petType }))
  );

  const [pets, breeds, products, groomers, team, gallery, diseases] = await Promise.all([
    Pet.insertMany(data.pets),
    Breed.insertMany(breedDocs),
    Product.insertMany(data.products),
    Groomer.insertMany(data.groomers),
    TeamMember.insertMany(data.team),
    GalleryImage.insertMany(data.gallery),
    Disease.insertMany(data.diseases),
  ]);

  // A default admin so the protected routes are testable straight away.
  // Change this password before deploying anywhere public.
  const adminEmail = 'admin@petcare.com';
  if (!(await User.findOne({ email: adminEmail }))) {
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: 'admin123',
      phone: '+91-9000000000',
      role: 'admin',
    });
    console.log(`Admin created -> ${adminEmail} / admin123  (change this)`);
  }

  console.table({
    pets: pets.length,
    breeds: breeds.length,
    products: products.length,
    groomers: groomers.length,
    team: team.length,
    gallery: gallery.length,
    diseases: diseases.length,
  });
  // Chatbot caches a snapshot of the catalogue -- drop it so the next
  // message reflects what we just inserted.
  try {
    require('../utils/siteContext').invalidateSiteContext();
  } catch { /* not fatal */ }

  console.log('Seed complete');
};

(async () => {
  await connectDB();
  try {
    if (process.argv.includes('--destroy')) await destroy();
    else await importData();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
})();
