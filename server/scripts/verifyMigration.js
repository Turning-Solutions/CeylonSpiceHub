
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://theceylonspicehubdev:sKMIepxIdLJWDiHp@ceylonspicehubcluster.sdbzbkq.mongodb.net/ceylon-spice-hub?retryWrites=true&w=majority';

const mongooseOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    retryWrites: true,
    w: 'majority',
    dbName: 'ceylon-spice-hub'
};

const verify = async () => {
    try {
        await mongoose.connect(MONGODB_URI, mongooseOptions);
        console.log('Connected.');

        // Check specific product mentioned by user
        const specificProduct = await Product.findOne({ name: /Dessert Honey/i });
        if (specificProduct) {
            console.log('Specific Product:', specificProduct.name);
            console.log('Top Level Weight:', specificProduct.weight);
            console.log('Top Level Price:', specificProduct.price);
            console.log('Variants:', JSON.stringify(specificProduct.variants, null, 2));
        } else {
            console.log('Specific product not found.');
        }

        // Check for any remaining issues
        const problematic = await Product.countDocuments({
            weight: { $exists: true },
            'variants.0': { $exists: true }
        });
        console.log(`Products with both top-level weight and variants: ${problematic}`);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verify();
