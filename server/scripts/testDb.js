
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

console.log('URI length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 'undefined');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected');
        const count = await Product.countDocuments();
        console.log('Product count:', count);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
