const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./model/admin');

mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

(async () => {
  try {
    const hashedPassword = await bcrypt.hash('7400377777', 10); // Hash actual password

    const admin = new Admin({
      email: 'dhananjay.monga.2226@gmail.com',
      password: hashedPassword,
    });

    await admin.save();
    console.log('✅ Admin created successfully!');
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
})();
