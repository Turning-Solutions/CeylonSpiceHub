
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, ChevronDown, ChevronRight, Package, Clock } from 'lucide-react';
import api from '@/api/index';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

import { getCachedData, setCachedData } from '@/utils/cache';

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const OurProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [catalogRef, catalogInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // 1. Check Time-Based Cache
        const cachedProducts = getCachedData();

        if (cachedProducts) {
          setProducts(cachedProducts);
          setLoading(false);
          return;
        }

        // 2. Fetch from API
        const response = await api.get('/products');
        const data = response.data;
        const productArray = Array.isArray(data) ? data : [];

        setProducts(productArray);
        setCachedData(productArray);

      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Preload category images
  useEffect(() => {
    Object.values(categoryImages).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const getCategories = (productList) => {
    const categories = [...new Set(productList.map(p => p.category).filter(Boolean))];
    return categories.sort();
  };

  const getSubCategories = (category, productList) => {
    const subCats = [...new Set(
      productList
        .filter(p => p.category === category)
        .map(p => p.subCategory || 'Other')
    )];
    return subCats.sort();
  };

  // Category images mapping
  const categoryImages = {
    'Sauces': 'https://res.cloudinary.com/dwuxumj4x/image/upload/v1771013809/WhatsApp_Image_2026-02-07_at_9.03.47_AM_1_r2nddh.jpg',
    'Chutney': 'https://res.cloudinary.com/dwuxumj4x/image/upload/v1771013796/WhatsApp_Image_2026-02-07_at_9.03.46_AM_u7l9hn.jpg',
    'Jam': 'https://res.cloudinary.com/dwuxumj4x/image/upload/v1769808438/JAM1_ip8qqy.jpg',
    'Wines': 'https://res.cloudinary.com/dwuxumj4x/image/upload/v1770493967/231b5bbd-5fb8-46bc-9f6c-fe294692597d.png',
    'Spices': 'https://res.cloudinary.com/dwuxumj4x/image/upload/v1769808573/spices_r8wkkx.jpg',
    'Katagasma Range': 'https://res.cloudinary.com/dwuxumj4x/image/upload/v1770146540/KATAGASMA_RANGE_vfqdyp.jpg'
  };

  const getCategoryImage = (category) => {
    return categoryImages[category] || 'https://images.unsplash.com/photo-1596040033229-a0b3b46fe6f1';
  };

  // Category taglines for image overlay
  const categoryTaglines = {
    'Sauces': { subtitle: 'Bold & Flavorful', title: 'Signature Sauces' },
    'Chutney': { subtitle: 'Traditional Recipe', title: 'Artisan Chutneys' },
    'Jam': { subtitle: 'Sweet & Natural', title: 'Handcrafted Jams' },
    'Wines': { subtitle: 'Premium Selection', title: 'Ceylon Wines' },
    'Spices': { subtitle: 'Pure & Aromatic', title: 'Ceylon Spices' },
    'Katagasma Range': { subtitle: 'Pre-Order Special', title: 'Katagasma Range' }
  };

  const getCategoryTagline = (category) => {
    return categoryTaglines[category] || { subtitle: 'Premium Ceylon', title: 'Authentic Flavors' };
  };

  const categories = getCategories(products);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <img
          src="/logo.png"
          alt="Ceylon Spice Hub Logo"
          className="h-24 w-24 mx-auto mb-6"
        />
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our complete collection by category. Visit our shop to purchase.
        </p>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-2 ml-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-56 mt-4" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div
          ref={catalogRef}
          initial={{ opacity: 0, y: 20 }}
          animate={catalogInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          {categories.map((category, categoryIndex) => {
            const subCategories = getSubCategories(category, products);
            const productCount = products.filter(p => p.category === category).length;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <Card className="overflow-hidden shadow-default hover:shadow-lg transition-all duration-300 border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
                  <div className={`flex flex-col ${categoryIndex % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Image Section */}
                    <div className="md:w-1/2 relative h-[400px] overflow-hidden group">
                      <motion.img
                        src={getCategoryImage(category)}
                        alt={category}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute bottom-6 left-6 right-6 md:left-8 md:bottom-8 text-white z-10">
                        <p className="text-sm md:text-base font-medium text-white/80 mb-1 uppercase tracking-wider drop-shadow-md">{getCategoryTagline(category).subtitle}</p>
                        <h2 className="text-3xl md:text-4xl font-bold font-serif text-white drop-shadow-lg">{getCategoryTagline(category).title}</h2>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-serif">
                            {category}
                          </h2>
                        </div>

                        <p className="text-muted-foreground text-base leading-relaxed">
                          Explore our premium selection of {category.toLowerCase()}. Hand-picked from the finest sources in Ceylon to bring authentic flavor to your kitchen.
                        </p>

                        {category === 'Katagasma Range' && (
                          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-4 space-y-2">
                            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm">
                              <Clock className="h-4 w-4 flex-shrink-0" />
                              Pre-Order Only — Order Conditions
                            </div>
                            <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1 ml-6 list-disc">
                              <li>Minimum order: 2 units per order</li>
                              <li>Lead time: Orders must be placed at least 7 days prior</li>
                              <li>Orders are confirmed upon full payment</li>
                            </ul>
                          </div>
                        )}

                        <div className="pt-4">
                          <Button
                            size="lg"
                            className="w-full md:w-auto shadow-xl font-bold group text-lg px-10 py-6"
                            onClick={() => navigate(`/products?category=${encodeURIComponent(category)}`)}
                          >
                            Shop {category}
                            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {!loading && products.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-lg text-muted-foreground">No products found.</p>
        </motion.div>
      )}
    </div>
  );
};

export default OurProductsPage;
