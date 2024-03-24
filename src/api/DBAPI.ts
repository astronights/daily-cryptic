'use server';

import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log('Already Connected to MongoDB');
    } else {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB');
    }
  } catch (error) {
    console.error(error);
  }
}