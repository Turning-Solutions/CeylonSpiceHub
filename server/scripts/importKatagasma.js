import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://theceylonspicehubdev:sKMIepxIdLJWDiHp@ceylonspicehubcluster.sdbzbkq.mongodb.net/ceylon-spice-hub?retryWrites=true&w=majority';

const katagasmaProducts = [
  {
    name: 'Brinjal Moju',
    subCategory: 'Moju',
    weight: '300g',
    price: 1500,
    description: `A spoonful to change your meal.

A beloved Sri Lankan classic, Brinjal Moju (Wambotu Moju) is a vibrant pickle made from deep-fried eggplant strips, crunchy shallots, and green chilies, all gently pickled in a tangy mustard-vinegar blend. The result is a beautifully balanced bite — sweet, sour, and just the right touch of heat.

Every spoonful delivers a medley of textures and flavors: the crisp of fried shallots, the silkiness of eggplant, and a lingering spice that lifts any meal.

Best enjoyed with: steamed white rice, Sri Lankan yellow rice or ghee rice, fried rice or biryani, or as a zesty side to grilled meats or lentil curries.

All Natural | 100% Vegetarian | No MSG | 300g`
  },
  {
    name: 'Brinjal Moju with Fried Sprats',
    subCategory: 'Moju',
    weight: '275g',
    price: 1600,
    description: `Just a spoonful and enjoyable difference.

Crispy, spicy, and full of character — this pickle is made for those who crave a bold bite. Featuring crunchy fried sprats, golden brinjal strips, shallots, and green chilies, it's all brought together in a tangy, spiced blend of mustard, vinegar, garlic, and ginger.

Fermented to perfection, this chunky, flavor-packed relish adds an exciting mix of texture and taste to every meal. Whether you're looking to elevate your rice or just enjoy it straight from the jar, this one's a gamechanger.

Best enjoyed with: steamed white rice, yellow rice, ghee rice, or any savory rice dish.

All Natural | No MSG | 275g`
  },
  {
    name: 'Brinjal Moju with Fried Fish',
    subCategory: 'Moju',
    weight: '275g',
    price: 1900,
    description: `The best booster for fussy eaters.

A delightful twist on a beloved Sri Lankan classic, Brinjal Moju with Fried Fish brings together deep-fried cubes of marinated small fish with fresh, farm-grown eggplants in a rich, tangy-sweet blend of vinegar, sugar, green chilies, and spices.

It's a mouthwatering fusion of texture and flavor — crispy, juicy, and packed with bold, balanced taste. Even the fussiest eaters will be reaching for another spoonful.

Best enjoyed with: steamed white rice, Sri Lankan yellow or ghee rice, fried rice, biryani, or savoury grain bowls.

All Natural | No MSG | 275g`
  },
  {
    name: 'Fried Fish Moju',
    subCategory: 'Moju',
    weight: '300g',
    price: 2400,
    description: `A timeless Sri Lankan classic.

Bursting with bold flavor and heritage, Fried Fish Moju is a true celebration of tradition. Tender cubes of deep-fried fish are blended with shallots and green chilies, then marinated in a rich, spicy base of ground ginger, garlic, and mustard, all soaked in natural coconut vinegar.

A warming blend of red chili flakes, black pepper, and authentic Ceylon spices gives this moju its savory depth, while a delicate touch of sugar and salt strikes the perfect balance.

Best enjoyed with: steamed white or red rice, ghee rice, yellow rice, or biryani, as a bold, zesty side to meat or vegetarian dishes.

All Natural | No MSG | 300g`
  },
  {
    name: 'Sinhala Achcharu',
    subCategory: 'Pickle & Achcharu',
    weight: '300g',
    price: 1000,
    description: `Traditional Sri Lankan pickle with a tantalizing taste.

The word "Achcharu" means pickle, but for Sri Lankans, it means so much more — it's tradition, celebration, and unforgettable flavor in every spoonful.

This beloved side dish brings together a mix of peppers, shallots, semi-ripe papaya, carrots, and other regionally inspired vegetables, lightly boiled and then tossed in a rich, creamy mustard-based sauce that's both tangy and vibrant.

Whether it's a party, almsgiving, or a special family lunch, you'll always find Sinhala Achcharu on the table.

Best enjoyed with: yellow rice, biriyani, or fried rice, festive Sri Lankan lunch spreads, or as a bright, flavorful side to any rice and curry meal.

100% Vegetarian | All Natural | No MSG | 300g`
  },
  {
    name: 'Malay Pickle',
    subCategory: 'Pickle & Achcharu',
    weight: '325g',
    price: 1200,
    description: `Add a dash and bring life to your biriyani.

A sweet, spicy, and tangy classic, Malay Pickle is a treasured Sri Lankan condiment rooted in the culinary heritage of the Malay community. This vibrant pickle is a must-have with biriyani — its bold flavor perfectly complements rich rice dishes.

Crafted from a traditional recipe passed down through generations, this pickle is made by marinating big onions, shallots, capsicums, carrots, green chilies, and dates in a zesty blend of vinegar, mustard, ginger, and sugar.

Best enjoyed with: biriyani or chicken kabsa, yellow rice, ghee rice, or pilaf, or as a zesty side to any rice and curry plate.

100% Vegetarian | All Natural | No MSG | 325g`
  },
  {
    name: 'Baby Jack Fruit Pickle',
    subCategory: 'Pickle & Achcharu',
    weight: '300g',
    price: 850,
    description: `A village favorite, now on every table.

Once a well-kept secret of rural Sri Lankan kitchens, this Tender Jackfruit Pickle has made its way into homes across the country — and for good reason. Made with young jackfruit rich in fiber, vitamins, protein, and minerals, it's a nutritious side dish that's as bold as it is flavorful.

Fermented in a zesty blend of mustard, vinegar, Sri Lankan spices, herbs, shallots, and green chilies, this pickle strikes a beautiful balance — spicy (but not too hot), sour, with a touch of natural sweetness.

Best enjoyed with: classic Sri Lankan rice and curry, milk rice, pittu, or string hoppers, or as a flavorful vegetarian side to everyday meals.

100% Vegetarian | All Natural | No MSG | 300g`
  },
  {
    name: 'Chillie Oil',
    subCategory: 'Condiments',
    weight: '300g',
    price: 1750,
    description: `Too hot to handle, too delicious to resist.

Deliciously crunchy, irresistibly punchy — our Chili Oil is a fiery flavored bomb that brings the heat and the crave-worthy taste. Infused for over 48 hours, this oil is packed with red chilies, crispy garlic, and our signature Ceylon Spice Hub's spice blend, delivering deep, savory notes with every spoonful.

More oil-forward than a chili paste, it's perfect for adding a glossy kick to your favorite dishes. Whether it's drizzled over noodles, stirred into soup, tossed with fried rice, or used as a dip — this bold condiment transforms everything it touches.

Best enjoyed with: noodles, fried rice, or dumplings, soups, stews, and stir-fries, or even as a daring dip for bread and snacks.

100% Vegetarian | All Natural | No MSG | 300g`
  },
  {
    name: 'Chillie Paste',
    subCategory: 'Condiments',
    weight: '300g',
    price: 2100,
    description: `Each bite is flavorful.

Spicy, savory, and packed with umami — this Chili Paste with Shrimps is the perfect way to fire up your favorite dishes. A beloved staple on many condiment counters, it's made with a bold blend of fried shrimp, chili flakes, celery, garlic, and ginger for a mouthwatering punch of flavor.

Whether you're stirring it into Chinese fried rice, nasi goreng, or using it as a spicy substitute for lunumiris with milk rice, coconut roti, or pittu — this paste brings a whole new energy to your meals.

Best enjoyed with: fried rice, noodles, and stir-fries, milk rice, roti, or pittu, or as a fiery dip or topping for seafood and fried dishes.

All Natural | No MSG | 300g`
  },
  {
    name: 'Seeni Sambol',
    subCategory: 'Condiments',
    weight: '300g',
    price: 2100,
    description: `Experience the magic of Asian taste.

Sweet, spicy, and deeply savory — Seeni Sambol is a beloved Sri Lankan onion relish that transforms every bite into something special. Made with slow-cooked onions, Maldive fish chips, chili flakes, and a blend of aromatic spices, this caramelized sambol is rich, bold, and bursting with authentic island flavor.

Whether you're layering it on toast, spooning it over rice, or pairing it with your favorite curry, Seeni Sambol adds a touch of magic to every meal.

Best enjoyed with: hoppers, string hoppers, coconut roti, or milk rice, as a topping for toast, burgers, or tacos, with crackers, cheese dips, or even fried eggs, or as a delicious sidekick to almost any rice or savory dish.

All Natural | No MSG | 300g`
  },
  {
    name: 'Veg & Cashew Baduma',
    subCategory: 'Baduma',
    weight: '125g',
    price: 2500,
    description: `Vegetable, Onion & Cashew Baduma

A timeless southern delicacy, this savory mix of crispy fried vegetables, onions, and cashews delivers a mouthful of texture and taste. Traditionally prepared during celebrations and almsgivings, this baduma is perfect with Kiribath (milk rice), any rice dish, or even as a flavorful filling in buttered bread. One spoonful, and you'll be hooked.

100% Vegetarian | All Natural | No MSG | 125g`
  },
  {
    name: 'Sprats Baduma',
    subCategory: 'Baduma',
    weight: '125g',
    price: 2250,
    description: `Sprats Baduma (Halmasso Baduma)

Tiny sprats, fried to crispy perfection and tossed with onions and Sri Lankan spices, make this baduma an addictive powerhouse of umami. A beloved household favorite, it pairs beautifully with rice, pol sambol, or as a crunchy protein-packed snack straight from the jar.

All Natural | No MSG | 125g`
  },
  {
    name: 'Dry Fish Baduma',
    subCategory: 'Baduma',
    weight: '125g',
    price: 2500,
    description: `Dry Fish Baduma (Katta Karawala Baduma)

This bold and savory baduma features dried fish deep fried with onions, chilies, and spices, delivering an intense hit of flavor that pairs exquisitely with plain rice or hearty village meals. Its smoky, spicy edge is for true lovers of deep traditional taste.

All Natural | No MSG | 125g`
  },
  {
    name: 'Bitter Gourd & Cashew Baduma',
    subCategory: 'Baduma',
    weight: '150g',
    price: 1500,
    description: `Bitter Gourd & Cashew Baduma

A beautifully balanced combination of crispy fried bitter gourd and buttery cashews, this baduma delivers a contrast of earthy bitterness and rich crunch. Perfect for those who appreciate bold, complex flavors — and a delightful match for milk rice, yellow rice, or plain bread.

100% Vegetarian | All Natural | No MSG | 150g`
  }
];

async function importKatagasmaProducts() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'ceylon-spice-hub' });
    console.log('Connected to MongoDB');

    let inserted = 0;
    let skipped = 0;

    for (const p of katagasmaProducts) {
      const existing = await Product.findOne({ name: p.name, category: 'Katagasma Range' });
      if (existing) {
        console.log(`  SKIP (already exists): ${p.name}`);
        skipped++;
        continue;
      }

      await Product.create({
        category: 'Katagasma Range',
        subCategory: p.subCategory,
        name: p.name,
        description: p.description,
        variants: [{
          type: 'glass-bottle',
          weight: p.weight,
          price: p.price,
          stock_available: true
        }],
        stock_available: true,
        featured: false
      });

      console.log(`  INSERTED: ${p.name} (${p.weight}, LKR ${p.price})`);
      inserted++;
    }

    console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Import failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

importKatagasmaProducts();
