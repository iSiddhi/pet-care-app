// Seed data lifted from the hardcoded arrays inside the frontend pages,
// so the DB mirrors what the UI used to fake.

const PET_TYPES = ['Dog', 'Cat', 'Rabbit', 'Birds', 'Fish', 'Turtle'];

const breeds = {
  Dog: ['Golden Retriever', 'Labrador', 'German Shepherd', 'Bulldog', 'Poodle', 'Beagle', 'Rottweiler'],
  Cat: ['Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Ragdoll', 'Abyssinian', 'Russian Blue'],
  Rabbit: ['Holland Lop', 'Netherland Dwarf', 'Flemish Giant', 'Mini Rex', 'Lionhead'],
  Birds: ['Canary', 'Parakeet', 'Cockatiel', 'Lovebird', 'Finch', 'Parrot', 'African Grey', 'Budgerigar'],
  Fish: ['Goldfish', 'Betta', 'Angelfish', 'Guppy', 'Neon Tetra', 'Discus'],
  Turtle: ['Red-eared Slider', 'Box Turtle', 'Russian Tortoise', "Hermann's Tortoise", 'Snapping Turtle'],
};

const petImages = {
  Dog: ['/PetServices/Dog1.png', '/PetServices/Dog2.png', '/PetServices/Dog3.png'],
  Cat: ['/PetServices/cat1.png', '/PetServices/cat2.png', '/PetServices/cat3.png'],
  Rabbit: ['/PetServices/rabbit1.png', '/PetServices/rabbit2.png', '/PetServices/rabbit3.png'],
  Birds: ['/PetServices/birds1.png', '/PetServices/birds2.png', '/PetServices/birds3.png'],
  Fish: ['/PetServices/fish1.png', '/PetServices/fish2.png', '/PetServices/fish3.png'],
  Turtle: ['/PetServices/turtle1.png', '/PetServices/turtle2.png', '/PetServices/turtle3.png'],
};

const basePrice = { Dog: 500, Cat: 450, Rabbit: 200, Birds: 150, Fish: 50, Turtle: 100 };

const traits = {
  Dog: ['Friendly', 'Loyal', 'Active'],
  Cat: ['Calm', 'Independent', 'Affectionate'],
  Rabbit: ['Gentle', 'Quiet', 'Small'],
  Birds: ['Musical', 'Colorful', 'Social'],
  Fish: ['Peaceful', 'Easy Care', 'Low Maintenance'],
  Turtle: ['Quiet', 'Long-lived', 'Hardy'],
};

// Three listings per pet type, matching the images that exist in /public
const pets = PET_TYPES.flatMap((type) =>
  petImages[type].map((image, i) => ({
    name: `${breeds[type][i]} ${i + 1}`,
    type,
    breed: breeds[type][i],
    characteristics: traits[type],
    image,
    price: basePrice[type] + i * 150,
    age: ['6 months', '1 year', '2 years'][i],
    description: `A healthy, vet-checked ${breeds[type][i]} looking for a loving home.`,
    available: true,
  }))
);

const products = [
  // Dog
  { name: 'Premium Dog Food', petType: 'Dog', category: 'Food', price: 45.99, image: '/essentials/dog-food.png', description: 'High-quality nutrition for adult dogs', inStock: true, stockCount: 40 },
  { name: 'Dog Leash & Collar Set', petType: 'Dog', category: 'Accessories', price: 29.99, image: '/essentials/leash.png', description: 'Durable leash and collar combo', inStock: true, stockCount: 25 },
  { name: 'Dog Toys Bundle', petType: 'Dog', category: 'Toys', price: 24.99, image: '/essentials/toys.png', description: 'Interactive toys for active play', inStock: false, stockCount: 0 },
  { name: 'Dog Bed - Large', petType: 'Dog', category: 'Comfort', price: 79.99, image: '/essentials/bed.png', description: 'Comfortable orthopedic dog bed', inStock: true, stockCount: 12 },
  { name: 'Dog Grooming Kit', petType: 'Dog', category: 'Grooming', price: 39.99, image: '/essentials/kit.png', description: 'Complete grooming set for dogs', inStock: true, stockCount: 18 },
  { name: 'Dog Training Treats', petType: 'Dog', category: 'Food', price: 15.99, image: '/essentials/training-treats.png', description: 'Reward treats for training sessions', inStock: true, stockCount: 60 },
  // Cat
  { name: 'Premium Cat Food', petType: 'Cat', category: 'Food', price: 42.99, image: '/essentials/cat-food.png', description: 'Balanced nutrition for adult cats', inStock: true, stockCount: 35 },
  { name: 'Cat Litter Box', petType: 'Cat', category: 'Hygiene', price: 34.99, image: '/essentials/litter-box.png', description: 'Easy-clean covered litter box', inStock: true, stockCount: 20 },
  { name: 'Cat Scratching Post', petType: 'Cat', category: 'Furniture', price: 49.99, image: '/essentials/scratch-post.png', description: 'Sturdy sisal scratching post', inStock: true, stockCount: 15 },
  { name: 'Cat Toy Collection', petType: 'Cat', category: 'Toys', price: 19.99, image: '/essentials/cat-toys.png', description: 'Assorted toys to keep cats busy', inStock: false, stockCount: 0 },
  { name: 'Cat Carrier', petType: 'Cat', category: 'Travel', price: 54.99, image: '/essentials/cat-carrier.png', description: 'Ventilated carrier for safe travel', inStock: true, stockCount: 10 },
  { name: 'Cat Treats - Salmon', petType: 'Cat', category: 'Food', price: 12.99, image: '/essentials/cat-treat.png', description: 'Salmon-flavoured training treats', inStock: true, stockCount: 50 },
  // Rabbit / Birds / Fish / Turtle
  { name: 'Rabbit Hay Feeder', petType: 'Rabbit', category: 'Habitat', price: 22.99, image: '/essentials/kit.png', description: 'Keeps hay clean and accessible', inStock: true, stockCount: 14 },
  { name: 'Rabbit Timothy Hay 2kg', petType: 'Rabbit', category: 'Food', price: 18.49, image: '/essentials/cat-food.png', description: 'Fibre-rich hay for daily feeding', inStock: true, stockCount: 30 },
  { name: 'Bird Cage - Medium', petType: 'Birds', category: 'Habitat', price: 89.99, image: '/essentials/kit.png', description: 'Spacious cage with perches', inStock: true, stockCount: 8 },
  { name: 'Bird Seed Mix 1kg', petType: 'Birds', category: 'Food', price: 14.99, image: '/essentials/cat-food.png', description: 'Balanced seed mix for small birds', inStock: true, stockCount: 45 },
  { name: 'Aquarium Starter Kit 20L', petType: 'Fish', category: 'Habitat', price: 74.99, image: '/essentials/kit.png', description: 'Tank, filter and light included', inStock: true, stockCount: 6 },
  { name: 'Tropical Fish Flakes', petType: 'Fish', category: 'Food', price: 9.99, image: '/essentials/cat-food.png', description: 'Daily flake food for tropical fish', inStock: true, stockCount: 70 },
  { name: 'Turtle Basking Platform', petType: 'Turtle', category: 'Habitat', price: 32.99, image: '/essentials/kit.png', description: 'Floating dock with ramp', inStock: true, stockCount: 11 },
  { name: 'Turtle Pellets 500g', petType: 'Turtle', category: 'Food', price: 16.99, image: '/essentials/cat-food.png', description: 'Calcium-enriched turtle pellets', inStock: true, stockCount: 28 },
];

const groomers = [
  { name: 'Nikhil Sharma', avatar: '/groomers/Nikhil.png', email: 'nikhil@gmail.com', phone: '+91-9876543210', specialties: ['Dog Grooming', 'Spa Treatments', 'Puppy Care'], experienceYears: 6, rating: 4.8 },
  { name: 'Kunal Sharma', avatar: '/groomers/Kunal.png', email: 'kunal@gmail.com', phone: '+91-9876501234', specialties: ['Nail Trimming', 'Cat Grooming', 'Ear Cleaning'], experienceYears: 4, rating: 4.6 },
  { name: 'Nikky Singh', avatar: '/groomers/Nikky.png', email: 'nikky@gmail.com', phone: '+91-9876567890', specialties: ['Full Grooming', 'Dental Care', 'Flea Treatment'], experienceYears: 7, rating: 4.9 },
];

const team = [
  { name: 'Samiksha', role: 'Co-Founder', email: 'samiksha@petcare.com', avatar: '/Ourteam/Samiksha.png', bio: 'Leads product and partnerships, with a focus on making quality pet care affordable.', order: 1 },
  { name: 'Siddhi', role: 'Co-Founder', email: 'siddhi@petcare.com', avatar: '/Ourteam/siddhi.png', bio: 'Heads engineering and keeps the platform fast, reliable and easy to use.', order: 2 },
];

const galleryFiles = {
  Dog: ['innocent-dog.png', 'bad-dog.png', 'good-dog.png', 'happydog.png', 'cutedog.png', 'cutie-dog.png'],
  Cat: ['cat1.jpg', 'cat2.jpg', 'cat3.jpg', 'cat4.jpg', 'cat5.jpg', 'cat6.jpg', 'cat7.jpg', 'sleepingcat.png'],
  Rabbit: ['1rabbit.jpg', '2rabbit.jpg', '3.rabbit.jpg', '4rabbit.jpg', '5rabbit.jpg', 'rabbit.png'],
  Birds: ['1.bird.jpg', '2bird.jpg', '3bird.jpg', '4.bird.jpg', '5bird.jpg', '6bird.jpg', '7bird.jpg', 'birdy.png'],
  Fish: ['fish1.jpg', 'fish2.jpg', 'fish3.jpg', 'fish4.jpg', 'fish5.jpg', 'fish6.jpg', 'fish7.jpg', 'fishbowl.png'],
  Turtle: ['turtle1.jpg', 'turtle2.jpg', 'turtle3.jpg', 'turtle4.jpg', 'turtle5.jpg', 'turtle6.jpg', 'turtle7.jpg', 'turtle.png'],
};

const gallery = Object.entries(galleryFiles).flatMap(([category, files]) =>
  files.map((f, i) => ({ url: `/gallery/${f}`, caption: `${category} ${i + 1}`, category }))
);

// Knowledge base for /api/predict-disease. Gemini is grounded on these rows;
// keyword matching is the fallback when AI is off or fails.
const diseases = [
  {
    name: 'Canine Parvovirus',
    petTypes: ['Dog'],
    symptomKeywords: ['vomiting', 'bloody diarrhea', 'diarrhea', 'lethargy', 'not eating', 'fever', 'dehydration'],
    severity: 'Critical',
    description: 'A highly contagious viral infection affecting the gastrointestinal tract, most dangerous in unvaccinated puppies.',
    recommendations: ['Isolate from other dogs immediately', 'Seek emergency veterinary care without delay', 'Keep the pet hydrated under vet guidance', 'Disinfect bedding and bowls thoroughly'],
    seeVetIf: 'Immediately. Parvo is life-threatening without prompt treatment.',
  },
  {
    name: 'Kennel Cough',
    petTypes: ['Dog'],
    symptomKeywords: ['dry cough', 'honking cough', 'cough', 'sneezing', 'runny nose', 'retching'],
    severity: 'Moderate',
    description: 'A contagious respiratory infection causing a persistent, harsh cough. Usually mild in healthy adult dogs.',
    recommendations: ['Rest and avoid contact with other dogs', 'Use a harness instead of a collar', 'Keep air humid and dust-free', 'Ask your vet about cough suppressants'],
    seeVetIf: 'The cough lasts more than a week, or breathing becomes laboured.',
  },
  {
    name: 'Atopic Dermatitis (Skin Allergy)',
    petTypes: ['Dog', 'Cat'],
    symptomKeywords: ['itching', 'scratching', 'red skin', 'hair loss', 'licking paws', 'rash', 'hot spots'],
    severity: 'Low',
    description: 'An allergic skin reaction to food, fleas or environmental triggers, causing persistent itching and inflammation.',
    recommendations: ['Check for fleas and treat if present', 'Try a limited-ingredient diet for 6-8 weeks', 'Bathe with a vet-recommended hypoallergenic shampoo', 'Keep a diary of flare-ups and triggers'],
    seeVetIf: 'Skin is broken, bleeding, or there is a foul smell suggesting infection.',
  },
  {
    name: 'Feline Upper Respiratory Infection',
    petTypes: ['Cat'],
    symptomKeywords: ['sneezing', 'runny nose', 'watery eyes', 'congestion', 'not eating', 'fever'],
    severity: 'Moderate',
    description: 'A common viral or bacterial infection of the nose, throat and sinuses, similar to a cold in humans.',
    recommendations: ['Keep the cat warm and in a low-stress environment', 'Wipe discharge from eyes and nose gently', 'Offer warm, aromatic food to encourage eating', 'Ensure constant access to fresh water'],
    seeVetIf: 'The cat stops eating for more than 24 hours or struggles to breathe.',
  },
  {
    name: 'Feline Lower Urinary Tract Disease',
    petTypes: ['Cat'],
    symptomKeywords: ['straining to urinate', 'blood in urine', 'frequent urination', 'crying', 'litter box', 'licking genitals'],
    severity: 'High',
    description: 'A group of conditions affecting the bladder and urethra. Blockage in male cats is a medical emergency.',
    recommendations: ['Increase water intake with wet food or a fountain', 'Keep litter boxes clean and accessible', 'Reduce household stress', 'Seek veterinary assessment promptly'],
    seeVetIf: 'Your cat strains without producing urine. That is an emergency.',
  },
  {
    name: 'Rabbit GI Stasis',
    petTypes: ['Rabbit'],
    symptomKeywords: ['not eating', 'no droppings', 'small droppings', 'bloating', 'hunched', 'lethargy', 'teeth grinding'],
    severity: 'Critical',
    description: 'The digestive system slows or stops, often triggered by stress, pain or a low-fibre diet. Rapidly fatal if untreated.',
    recommendations: ['Offer unlimited fresh hay immediately', 'Gently encourage movement', 'Do not withhold food', 'Contact a rabbit-savvy vet urgently'],
    seeVetIf: 'Immediately. A rabbit not eating for 12 hours is an emergency.',
  },
  {
    name: 'Rabbit Dental Malocclusion',
    petTypes: ['Rabbit'],
    symptomKeywords: ['drooling', 'not eating', 'weight loss', 'overgrown teeth', 'wet chin', 'dropping food'],
    severity: 'Moderate',
    description: 'Misaligned or overgrown teeth make chewing painful, leading to weight loss and secondary problems.',
    recommendations: ['Provide unlimited hay to wear teeth naturally', 'Offer safe chew toys', 'Monitor weight weekly', 'Book a dental check with an exotics vet'],
    seeVetIf: 'The rabbit drops food, drools, or loses weight.',
  },
  {
    name: 'Psittacosis (Parrot Fever)',
    petTypes: ['Birds'],
    symptomKeywords: ['ruffled feathers', 'lethargy', 'green droppings', 'discharge', 'not eating', 'breathing difficulty'],
    severity: 'High',
    description: 'A bacterial infection affecting birds that can also spread to humans, causing respiratory and digestive signs.',
    recommendations: ['Isolate the bird from other birds', 'Wash hands thoroughly after handling', 'Keep the cage warm and clean', 'Seek avian veterinary care'],
    seeVetIf: 'Promptly. This condition can spread to humans and needs antibiotics.',
  },
  {
    name: 'Feather Plucking',
    petTypes: ['Birds'],
    symptomKeywords: ['feather loss', 'plucking', 'bald patches', 'screaming', 'self-mutilation'],
    severity: 'Moderate',
    description: 'A behavioural or medical condition where a bird pulls out its own feathers, often linked to boredom or stress.',
    recommendations: ['Increase foraging toys and enrichment', 'Keep a consistent 10-12 hour sleep schedule', 'Rule out mites and skin infection with a vet', 'Avoid sudden changes to the environment'],
    seeVetIf: 'Skin is broken or the behaviour began suddenly.',
  },
  {
    name: 'Ich (White Spot Disease)',
    petTypes: ['Fish'],
    symptomKeywords: ['white spots', 'scratching', 'rubbing', 'clamped fins', 'rapid gill movement', 'lethargy'],
    severity: 'Moderate',
    description: 'A parasitic infection showing as salt-like white spots on the body and fins. Spreads quickly in a tank.',
    recommendations: ['Raise tank temperature gradually as advised', 'Use a proven ich treatment', 'Perform partial water changes', 'Quarantine new fish for 2 weeks'],
    seeVetIf: 'Spots spread despite treatment, or fish stop eating.',
  },
  {
    name: 'Fin Rot',
    petTypes: ['Fish'],
    symptomKeywords: ['ragged fins', 'torn fins', 'fin loss', 'discoloured edges', 'lethargy'],
    severity: 'Moderate',
    description: 'A bacterial infection of the fins, almost always triggered by poor water quality or stress.',
    recommendations: ['Test and correct ammonia, nitrite and nitrate levels', 'Do a 25% water change', 'Remove sharp decorations', 'Use an antibacterial treatment if it persists'],
    seeVetIf: 'Rot reaches the body of the fish.',
  },
  {
    name: 'Turtle Shell Rot',
    petTypes: ['Turtle'],
    symptomKeywords: ['soft shell', 'pitting', 'foul smell', 'discoloured shell', 'flaking', 'white patches'],
    severity: 'High',
    description: 'A bacterial or fungal infection of the shell, usually caused by unclean water or an inadequate basking area.',
    recommendations: ['Clean and fully dry the basking area', 'Improve water filtration and change water', 'Ensure correct UVB lighting', 'Dry-dock the turtle as advised by a vet'],
    seeVetIf: 'The shell is soft, smells, or has open lesions.',
  },
  {
    name: 'Metabolic Bone Disease',
    petTypes: ['Turtle', 'Birds'],
    symptomKeywords: ['soft shell', 'weakness', 'deformity', 'lethargy', 'swollen limbs', 'tremors'],
    severity: 'High',
    description: 'A calcium and vitamin D3 deficiency causing weakened bones and shell, usually from poor lighting or diet.',
    recommendations: ['Install a proper UVB lamp and replace it every 6 months', 'Add a calcium supplement to the diet', 'Offer calcium-rich greens', 'Increase basking time'],
    seeVetIf: 'There is visible deformity, tremors or difficulty moving.',
  },
  {
    name: 'Intestinal Worms',
    petTypes: ['Dog', 'Cat', 'Rabbit'],
    symptomKeywords: ['weight loss', 'pot belly', 'worms in stool', 'diarrhea', 'scooting', 'dull coat', 'vomiting'],
    severity: 'Moderate',
    description: 'Parasitic worms in the digestive tract, common in young animals and those with outdoor access.',
    recommendations: ['Collect a stool sample for your vet', 'Follow a vet-prescribed deworming schedule', 'Clean bedding and litter areas thoroughly', 'Treat all pets in the household together'],
    seeVetIf: 'You see worms, or there is weight loss despite normal eating.',
  },
  {
    name: 'Ear Infection (Otitis Externa)',
    petTypes: ['Dog', 'Cat'],
    symptomKeywords: ['head shaking', 'ear scratching', 'bad smell', 'discharge', 'red ear', 'tilting head'],
    severity: 'Moderate',
    description: 'Inflammation of the outer ear canal from bacteria, yeast or ear mites. Common in floppy-eared breeds.',
    recommendations: ['Do not insert cotton swabs into the ear canal', 'Keep ears dry after baths and swimming', 'Use only vet-prescribed ear drops', 'Check for mites if more than one pet is affected'],
    seeVetIf: 'There is discharge, a strong smell, or a persistent head tilt.',
  },
];

module.exports = { PET_TYPES, breeds, pets, products, groomers, team, gallery, diseases };
