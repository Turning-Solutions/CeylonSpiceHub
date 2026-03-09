
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Leaf,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const slideVariants = {
  initial: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};

const CustomSlideshow = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const heroPillars = [
    { label: 'Ethically Sourced', icon: Sparkles },
    { label: 'Freshly Packed', icon: ShieldCheck },
    { label: '100% Natural', icon: Leaf },
  ];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setTimeout(handleNext, 7000);
    return () => clearTimeout(timer);
  }, [currentIndex, slides.length]);

  // Preload all slider images on initial mount
  useEffect(() => {
    if (slides && slides.length > 0) {
      const createdLinks = [];

      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://res.cloudinary.com';
      document.head.appendChild(preconnect);
      createdLinks.push(preconnect);

      slides.forEach((slide) => {
        if (slide?.image) {
          const img = new Image();
          img.src = slide.image;
          img.decoding = 'async';

          const preload = document.createElement('link');
          preload.rel = 'preload';
          preload.as = 'image';
          preload.href = slide.image;
          document.head.appendChild(preload);
          createdLinks.push(preload);
        }
      });

      return () => {
        createdLinks.forEach((link) => {
          if (document.head.contains(link)) {
            document.head.removeChild(link);
          }
        });
      };
    }
  }, [slides]);

  if (!slides || slides.length === 0) {
    return <div>No slides to display.</div>;
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full min-h-[520px] overflow-hidden rounded-[2rem] shadow-2xl md:h-[620px] lg:h-[720px]">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          <img
            className="w-full h-full object-cover"
            alt={currentSlide.alt}
            src={currentSlide.image}
            loading="eager"
            fetchPriority="high"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.12),transparent_28%)]" />

          <div className="absolute inset-0 px-5 pb-24 pt-8 md:px-10 md:pb-24 md:pt-10 lg:px-16 lg:pb-28">
            <div className="flex h-full items-end">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="w-full"
              >
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="max-w-xl rounded-[1.75rem] border border-white/20 bg-black/15 p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm md:max-w-2xl md:p-7 lg:p-8"
                >
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/95">
                      The Ceylon Spice Hub
                    </span>
                    <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">
                      {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                    </span>
                  </div>

                  <h2 className="text-3xl font-extrabold leading-tight text-balance md:text-5xl lg:text-6xl">
                    {currentSlide.title}
                  </h2>

                  <p className="mt-3 max-w-xl text-base font-semibold text-yellow-200 md:text-xl lg:text-2xl">
                    {currentSlide.tagline}
                  </p>

                  {currentSlide.imageDescription && (
                    <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 md:text-base">
                      {currentSlide.imageDescription}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap gap-3">
                    {heroPillars.map((item) => (
                      <span
                        key={item.label}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-white/90"
                      >
                        <item.icon className="h-3.5 w-3.5 text-yellow-200" />
                        {item.label}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button
                      asChild
                      size="lg"
                      className="bg-primary px-7 text-base font-semibold shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-primary/90"
                    >
                      <Link to="/products">
                        Shop Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="border-white/25 bg-white/10 px-7 text-base font-semibold text-white backdrop-blur hover:bg-white/20 hover:text-white"
                    >
                      <Link to="/we-are">Our Story</Link>
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 rounded-full border-white/20 bg-black/15 text-white backdrop-blur-sm transition-all hover:bg-black/25 md:flex"
        onClick={handlePrevious}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 rounded-full border-white/20 bg-black/15 text-white backdrop-blur-sm transition-all hover:bg-black/25 md:flex"
        onClick={handleNext}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute inset-x-0 bottom-4 z-10 px-4 md:bottom-6 md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 rounded-2xl border border-white/10 bg-black/18 px-4 py-3 backdrop-blur-sm md:flex-row md:items-center md:justify-between md:px-5">
          <div className="flex items-center gap-3 text-white/85">
            <span className="text-sm font-semibold">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <div className="h-px w-8 bg-white/30" />
            <p className="truncate text-sm text-white/70">{currentSlide.alt}</p>
          </div>

          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={cn(
                  'h-2.5 rounded-full transition-all duration-300',
                  currentIndex === index
                    ? 'w-10 bg-primary'
                    : 'w-2.5 bg-white/45 hover:bg-white/80'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              onClick={handlePrevious}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              onClick={handleNext}
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSlideshow;
