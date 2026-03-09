
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import CustomSlideshow from '@/components/CustomSlideshow';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getFeaturedProducts } from '@/api/index';

const slideshowData = [
  {
    title: "Ethically Sourced",
    tagline: "Grown with Love, Preserving Mother Nature's Best",
    imageDescription: "Every product tells a story from the hands of rural Ceylon farmers to your kitchen.",
    alt: "Ethically sourced spices",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/w_1920,q_auto,f_auto/v1770492351/wslide_1_jgehwm.png",
  },
  {
    title: "Farm to You, Pure and True",
    tagline: "From Our Family Farm to Your Table",
    imageDescription: "Handcrafted with care, grown with love, experience the untouched purity of Pasgoda's finest.",
    alt: "Farm to table spices",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/w_1920,q_auto,f_auto/v1770493804/e6689702-61f6-42e7-bd36-f371fc99bdd3_c5co8b.png",
  },
  {
    title: "Quality You Can Taste",
    tagline: "Taste So Tantalizing, Quality So Unmatched",
    imageDescription: "Hygienically packed and carefully processed.",
    alt: "Quality spices",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/w_1920,q_auto,f_auto/v1770581096/wslide_5_n1pdfe.png",
  },
  {
    title: "Pure & Natural",
    tagline: "100% Natural, 0% Compromise",
    imageDescription: "Free from preservatives, full of nature's goodness, just the way it's meant to be.",
    alt: "Pure spices",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/w_1920,q_auto,f_auto/v1770493967/231b5bbd-5fb8-46bc-9f6c-fe294692597d.png",
  },
  {
    title: "Clean Ingredients",
    tagline: "Nothing Added, Everything Real",
    imageDescription: "Pure ingredients you can trust, free from artificial additives and preservatives.",
    alt: "Clean ingredients",
    image: "https://res.cloudinary.com/dwuxumj4x/image/upload/w_1920,q_auto,f_auto/v1770581089/wslide_4_oaqjwu.png",
  },
];

const featuredCategories = [
  {
    title: 'Ceylon Spices',
    description: "The purest form of Ceylon's legendary spices, from fragrant cinnamon to fiery peppercorns.",
    image: 'https://res.cloudinary.com/dwuxumj4x/image/upload/v1769839858/SPICES_1_seeh3o.jpg',
    link: '/products?category=Spices',
  },
  {
    title: 'Sauce Range',
    description: 'Traditional sauces made from family recipes and layered with bold, home-style flavor.',
    image: 'https://res.cloudinary.com/dwuxumj4x/image/upload/v1769841368/sauces1_gd7rug.jpg',
    link: '/products?category=Sauces',
  },
  {
    title: 'Fruitopia Range',
    description: 'Unique fruit wines and beverages fermented to perfection with a distinct tropical character.',
    image: 'https://res.cloudinary.com/dwuxumj4x/image/upload/v1769839983/WINE_5_vgjktj.jpg',
    link: '/products?category=Wines',
  },
];

const brandHighlights = [
  { label: 'Farm-grown ingredients', value: '90%+' },
  { label: 'Handcrafted ranges', value: '5' },
  { label: 'Family-farm heritage', value: 'Generations' },
];

const benefits = [
  {
    title: 'Uncompromising Quality',
    desc: 'Small-batch processing preserves the authentic taste, aroma, and freshness of every ingredient.',
    img: 'https://res.cloudinary.com/dwuxumj4x/image/upload/v1771014420/WhatsApp_Image_2026-02-07_at_9.03.46_AM_1_nlaqky.jpg',
    icon: ShieldCheck,
  },
  {
    title: 'Ethically Sourced',
    desc: 'We support rural farmers and sustainable growing practices that respect people, land, and tradition.',
    img: 'https://res.cloudinary.com/dwuxumj4x/image/upload/v1770149702/Pineapple_jam_4_ttxaje.jpg',
    icon: HeartHandshake,
  },
  {
    title: 'Freshness Guaranteed',
    desc: 'Every pack is prepared with care to deliver vibrant flavor from our home in Sri Lanka to yours.',
    img: 'https://res.cloudinary.com/dwuxumj4x/image/upload/v1770149677/Pepper_c44hmg.jpg',
    icon: Leaf,
  },
];

const HomePage = () => {
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const featuredProducts = await getFeaturedProducts();
        setNewArrivals(featuredProducts.slice(0, 5));
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setNewArrivals([]);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      <CustomSlideshow slides={slideshowData} />

      <section className="container mx-auto px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Authentic flavors from rural Sri Lanka
            </div>

            <div className="space-y-4 text-center lg:text-left">
              <div>
                <h2 className="text-4xl font-extrabold leading-tight text-balance text-foreground md:text-7xl">
                  ආයුබෝවේවා!
                </h2>
                <p className="mt-3 text-xl font-semibold text-foreground md:text-3xl">
                  May you live long.
                </p>
              </div>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                Welcome to The Ceylon Spice Hub, where every jar, bottle, and blend carries the warmth of
                Pasgoda, the care of a family-run farm, and the bold character of Sri Lankan ingredients.
              </p>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                From aromatic spices and handcrafted chutneys to vibrant jams, sauces, and fruit wines,
                our range is made to bring honest flavor, sustainability, and heritage into everyday meals.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {brandHighlights.map((item) => (
                <Card
                  key={item.label}
                  className="rounded-2xl border-border/60 bg-card/80 px-5 py-4 text-center shadow-sm backdrop-blur"
                >
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                </Card>
              ))}
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Button asChild size="lg" className="px-8 shadow-lg hover:shadow-xl transition-all">
                <Link to="/products">
                  Shop Bestsellers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8">
                <Link to="/we-are">Discover Our Story</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 group">
              <img
                src="https://res.cloudinary.com/dwuxumj4x/image/upload/v1769840185/RANGE_a5xpht.png"
                alt="Ceylon Spice Hub Product Range"
                className="w-full h-auto object-contain drop-shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:-rotate-2 group-hover:drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)]"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-primary/10 blur-3xl -z-10" />
            <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-yellow-500/10 blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Explore by range
            </p>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Discover our signature collections
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Each collection is built around authentic Sri Lankan ingredients, handcrafted character, and everyday versatility.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              <Link to={category.link} className="group block h-full">
                <Card className="h-full overflow-hidden rounded-[1.75rem] border-border/60 bg-card/80 shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                        Curated range
                      </p>
                      <h3 className="text-2xl font-bold">{category.title}</h3>
                    </div>
                  </div>
                  <div className="space-y-4 p-6">
                    <p className="leading-7 text-muted-foreground">{category.description}</p>
                    <div className="inline-flex items-center text-sm font-semibold text-primary">
                      Browse collection
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Featured picks
            </p>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Start with customer favorites
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Handpicked products across our most-loved categories so first-time visitors can shop with confidence.
            </p>
          </div>
          <Button asChild variant="outline" className="hidden md:flex">
            <Link to="/products">View All Products</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {newArrivals.length > 0 ? (
            newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-[400px] animate-pulse rounded-xl bg-muted/20" />
            ))
          )}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Button asChild size="lg" className="px-12 py-6 text-lg font-bold shadow-xl transition-transform hover:scale-105">
            <Link to="/products">Shop All Products</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Why choose us
          </p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Built on quality, care, and provenance
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-lg text-muted-foreground">
            We combine family-farm roots, responsible sourcing, and handcrafted production to create ingredients you can trust.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="h-full overflow-hidden rounded-[1.75rem] border-border/60 bg-card/80 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-primary/40 group-hover:shadow-2xl">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg">
                    <item.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-3 p-6 text-center md:text-left">
                  <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="leading-7 text-muted-foreground">{item.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-yellow-500/10 p-8 shadow-lg md:p-12"
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                Bring Ceylon home
              </p>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Ready to stock your kitchen with bold, natural flavor?
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Explore our full range of spices, sauces, jams, chutneys, and wines, or learn more about the story behind the farm.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="px-8 shadow-lg">
                <Link to="/products">
                  Shop now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8">
                <Link to="/we-are">Meet the makers</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
