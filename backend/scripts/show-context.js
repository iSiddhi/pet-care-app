/**
 * Prints the exact site context the chatbot is given, plus its token cost.
 *   npm run show:context
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { getSiteContext } = require('../utils/siteContext');

(async () => {
  await connectDB();
  const text = await getSiteContext();

  console.log('\n' + '='.repeat(70));
  console.log(text);
  console.log('='.repeat(70));

  const chars = text.length;
  const approxTokens = Math.ceil(chars / 4);
  console.log(`\n${chars} characters, roughly ${approxTokens} tokens.`);
  console.log('This is sent with every chatbot message that passes the topic guard.');
  console.log('It is cached for 10 minutes, so the DB is queried at most 6 times an hour.\n');

  await mongoose.connection.close();
  process.exit(0);
})();
