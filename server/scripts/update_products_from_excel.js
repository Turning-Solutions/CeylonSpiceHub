import mongoose from 'mongoose';
import xlsx from 'xlsx';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from root .env 
// Assuming the script is run from the root directory or we explicitly point to it.
// server/scripts/ -> root is ../../
const envPath = path.resolve(__dirname, '../../.env');
console.log(`Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found in .env');
    console.log('Current process.env:', process.env);
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: 'ceylon-spice-hub'
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

const updateProducts = async () => {
    await connectDB();

    const excelFilePath = path.join(__dirname, '../../product_list_final_latest.xlsx');
    console.log(`Reading Excel file from: ${excelFilePath}`);

    try {
        const workbook = xlsx.readFile(excelFilePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Use header:1 to get array of arrays
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        // Skip the first row (headers)
        const rows = data.slice(1);

        console.log(`Found ${rows.length} rows to process.`);

        let updatedCount = 0;
        let notFoundCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const row of rows) {
            // Row format: [Product Name, Description]
            const name = row[0];
            const description = row[1];

            if (!name) continue; // Skip empty rows

            // Trim name to avoid whitespace issues
            const cleanedName = String(name).trim();

            try {
                // Try exact match first
                let product = await Product.findOne({ name: cleanedName });

                // If not found, try case-insensitive match
                if (!product) {
                    product = await Product.findOne({ name: { $regex: new RegExp(`^${cleanedName}$`, 'i') } });
                }

                if (product) {
                    if (description) {
                        // Only update if description is different? Or always update?
                        // Ideally check if different to save write ops, but always update is safer to ensure consistency.
                        const cleanedDescription = String(description).trim();

                        if (product.description !== cleanedDescription) {
                            product.description = cleanedDescription;
                            await product.save();
                            console.log(`Updated: "${cleanedName}"`);
                            updatedCount++;
                        } else {
                            console.log(`Skipped (No Change): "${cleanedName}"`);
                            skippedCount++;
                        }
                    } else {
                        console.log(`Skipping "${cleanedName}": No description provided in Excel.`);
                        skippedCount++;
                    }
                } else {
                    console.log(`Product not found: "${cleanedName}"`);
                    notFoundCount++;
                }
            } catch (err) {
                console.error(`Error updating "${cleanedName}":`, err.message);
                errorCount++;
            }
        }

        console.log('\n--- Summary ---');
        console.log(`Updated: ${updatedCount}`);
        console.log(`Skipped/No Change: ${skippedCount}`);
        console.log(`Not Found: ${notFoundCount}`);
        console.log(`Errors: ${errorCount}`);

    } catch (error) {
        console.error('Error processing Excel file:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
};

updateProducts();
