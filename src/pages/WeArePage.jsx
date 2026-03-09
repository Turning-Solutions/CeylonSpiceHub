
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Target, Leaf, Heart, Globe, Users, Award, ShieldCheck } from 'lucide-react';

const spiceValues = [
  {
    letter: 'S',
    title: 'Socially and environmentally sustainable',
    icon: Globe,
  },
  {
    letter: 'P',
    title: 'Passionate about healthy, nutritious products',
    icon: Heart,
  },
  {
    letter: 'I',
    title: 'Integrity in all we do',
    icon: ShieldCheck,
  },
  {
    letter: 'C',
    title: 'Customer-centric and taste-driven',
    icon: Users,
  },
  {
    letter: 'E',
    title: 'Empowering rural women',
    icon: Award,
  },
];

const hubValues = [
  {
    letter: 'H',
    title: 'Home-garden-based supply chains',
    icon: Leaf,
  },
  {
    letter: 'U',
    title: 'Unique generational methods',
    icon: Leaf,
  },
  {
    letter: 'B',
    title: 'Bountiful wellness in every bite',
    icon: Heart,
  },
];

const WeArePage = () => {
  return (
    <div className="space-y-20 pb-12">
      {/* HEADER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <Badge variant="outline" className="px-4 py-1 text-base">Authentic Taste of Nature</Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-primary">About Us</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto italic">
          "Founded on 30th September 2022, The Ceylon Spice Hub (Pvt) Ltd is the realization of a dream that harmonizes tradition, sustainability, and flavor."
        </p>
      </motion.div>

      {/* STORY SECTION */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl"
        >
          <img
            src="https://res.cloudinary.com/dwuxumj4x/image/upload/v1769840183/PAGE_4_s7p5ko.jpg"
            alt="Pasgoda Farm"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6 text-lg text-muted-foreground leading-relaxed"
        >
          <p>
            Our 10-acre <span className="text-foreground font-semibold">Pasgoda Farm</span>, along with over 10 partner farms, stands as a living testament to eco-friendly agriculture. Every product is nurtured naturally by rain, wind, sunshine, and pure spring water, preserving the authenticity of Sri Lanka’s rich agricultural heritage.
          </p>
          <p>
            From whole spices to spice blends, pickles, jams, sauces, and wines, every product is handcrafted with care, ensuring natural color, nutrients, and taste remain untouched.
          </p>
        </motion.div>
      </section>

      {/* VISION & MISSION */}
      <section className="grid md:grid-cols-2 gap-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 space-y-4">
            <div className="bg-background p-3 w-fit rounded-full shadow-sm mb-2">
              <Eye className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Vision</h2>
            <p className="text-muted-foreground text-lg">
              To be a market leader in people- and planet-friendly food products, where every bite nurtures wellness, sustains the earth, and brings authentic Sri Lankan flavors to the world.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/5 border-secondary/20">
          <CardContent className="p-8 space-y-4">
            <div className="bg-background p-3 w-fit rounded-full shadow-sm mb-2">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Mission</h2>
            <p className="text-muted-foreground text-lg">
              To craft and deliver healthy, nutritious, and 100% natural food and spice products, grown through sustainable practices, empowered by rural communities, and rooted in generations of tradition, so our customers can taste the true goodness of nature in every bite.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CORE VALUES - SPICEHUB ACRONYM */}
      <section className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3"
        >
          <Badge variant="outline" className="px-4 py-1 text-sm">
            Core Values
          </Badge>
          <h2 className="text-3xl font-bold md:text-4xl">
            Core Values – <span className="text-primary">WE ARE SPICEHUB</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-base md:text-lg">
            Each letter in our name stands for a promise we live by, from sustainability and integrity
            to empowerment, heritage, and customer care.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {[
            {
              label: 'SPICE',
              subtitle: 'The principles behind every product we make.',
              values: spiceValues,
              accent: 'from-primary/20 via-primary/5 to-transparent',
            },
            {
              label: 'HUB',
              subtitle: 'The roots, methods, and wellbeing we champion.',
              values: hubValues,
              accent: 'from-yellow-500/20 via-primary/5 to-transparent',
            },
          ].map((group, groupIndex) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              <Card className="relative h-full overflow-hidden rounded-[2rem] border-border/60 bg-card/80 shadow-lg backdrop-blur-sm">
                <div className={`absolute inset-0 bg-gradient-to-br ${group.accent} opacity-80`} />
                <CardContent className="relative p-6 md:p-8">
                  <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
                        WE ARE
                      </p>
                      <h3 className="mt-2 text-4xl font-extrabold tracking-wide text-foreground md:text-5xl">
                        {group.label}
                      </h3>
                    </div>
                    <p className="max-w-xs text-sm leading-6 text-muted-foreground md:text-right">
                      {group.subtitle}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {group.values.map((item, index) => (
                      <motion.div
                        key={item.letter}
                        initial={{ opacity: 0, x: groupIndex === 0 ? -16 : 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * index }}
                        className="group"
                      >
                        <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-extrabold text-primary-foreground shadow-md">
                            {item.letter}
                          </div>
                          <div className="flex min-w-0 flex-1 items-start gap-3 pt-1">
                            <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <item.icon className="h-4 w-4" />
                            </div>
                            <p className="text-sm font-medium leading-6 text-foreground md:text-base">
                              {item.title}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="pt-2"
        >
          <Card className="max-w-4xl mx-auto rounded-[1.75rem] border-primary/15 bg-primary/5">
            <CardContent className="p-6 text-center md:p-8">
              <p className="text-base font-serif italic text-muted-foreground md:text-lg">
                "Eight values, one mission: <span className="text-primary font-semibold">bringing authentic Sri Lankan flavors to the world</span>"
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>


    </div>
  );
};

export default WeArePage;
