const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const { Transaction } = require('./models/Transaction');

dotenv.config();

const seedDemoData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected!');

    // Dedicated public demo account
    const DEMO_EMAIL = 'demo@financeflow.com';
    const DEMO_PASSWORD = 'DemoUser@123';

    let demoUser = await User.findOne({ email: DEMO_EMAIL });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'FinanceFlow Demo',
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        currency: 'INR',
      });
      console.log(`Demo user created: ${demoUser.name} (${DEMO_EMAIL})`);
    } else {
      console.log(`Demo user already exists: ${demoUser.name} (${DEMO_EMAIL})`);
    }

    // Sample Transactions for Demo User
    const demoTransactions = [
      {
        userId: demoUser._id,
        title: 'Monthly Salary',
        type: 'income',
        amount: 55000,
        category: 'Salary',
        date: new Date(Date.now() - 86400000 * 2),
        notes: 'Monthly credited salary',
      },
      {
        userId: demoUser._id,
        title: 'Freelance Design Project',
        type: 'income',
        amount: 12500,
        category: 'Freelance',
        date: new Date(Date.now() - 86400000 * 6),
        notes: 'UI/UX redesign client payment',
      },
      {
        userId: demoUser._id,
        title: 'Apartment Rent',
        type: 'expense',
        amount: 18000,
        category: 'Rent & Housing',
        date: new Date(Date.now() - 86400000 * 3),
        notes: 'Monthly flat rent',
      },
      {
        userId: demoUser._id,
        title: 'Supermarket Grocery & Dairy',
        type: 'expense',
        amount: 3450,
        category: 'Food & Dining',
        date: new Date(Date.now() - 86400000 * 4),
        notes: 'Weekly pantry & fresh produce',
      },
      {
        userId: demoUser._id,
        title: 'High-speed Fiber & Electricity',
        type: 'expense',
        amount: 2100,
        category: 'Utilities',
        date: new Date(Date.now() - 86400000 * 7),
        notes: 'Broadband internet & power bill',
      },
      {
        userId: demoUser._id,
        title: 'Weekend Dining & Outing',
        type: 'expense',
        amount: 1850,
        category: 'Entertainment',
        date: new Date(Date.now() - 86400000 * 1),
        notes: 'Family dinner',
      },
    ];

    // Refresh demo transactions
    await Transaction.deleteMany({ userId: demoUser._id });
    const inserted = await Transaction.insertMany(demoTransactions);
    console.log(`Inserted ${inserted.length} demo transactions for ${DEMO_EMAIL}.`);

    console.log('SUCCESS: Demo data seeded safely without modifying any existing user records.');
    process.exit(0);
  } catch (error) {
    console.error('Error during demo seeding:', error);
    process.exit(1);
  }
};

seedDemoData();
