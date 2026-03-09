
import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['pouch', 'glass-bottle']
  },
  weight: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock_available: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    required: false
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Sauces', 'Chutney', 'Jam', 'Wines', 'Spices', 'Katagasma Range']
  },
  subCategory: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  // Legacy fields for backward compatibility / API ease
  price: {
    type: Number,
    // Made optional to support variant-only products
  },
  weight: {
    type: String,
    // Made optional to support variant-only products
  },
  stock_available: {
    type: Boolean,
    default: true
  },
  // New variants array
  variants: {
    type: [variantSchema],
    default: []
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: String,
  imageDescription: String,
  alt: String,
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);
