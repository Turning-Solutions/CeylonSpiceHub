
import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import CartIcon from '@/components/CartIcon';
import { Menu, X, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/we-are', label: 'We Are' },
  { to: '/our-products', label: 'Our Products' },
  { to: '/products', label: 'Shop' },
  { to: '/accomplishments', label: 'Accomplishments' },
  { to: '/recipes', label: 'Recipes' },
  { to: '/contact-us', label: 'Contact Us' },
];

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.img
              src="/logo.png"
              alt="Ceylon Spice Hub Logo"
              className="h-14 w-14 transition-transform duration-300 group-hover:scale-105"
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            />
            <span className="text-xl md:text-2xl font-bold text-primary tracking-tight group-hover:text-primary/80 transition-colors">The Ceylon Spice Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                {isAdmin ? (
                  <>
                    <NavigationMenuItem>
                      <NavLink
                        to="/admin"
                        className={({ isActive }) => cn(
                          navigationMenuTriggerStyle(),
                          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10 hover:text-primary'
                        )}
                      >
                        Dashboard
                      </NavLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavLink
                        to="/admin/products"
                        className={({ isActive }) => cn(
                          navigationMenuTriggerStyle(),
                          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10 hover:text-primary'
                        )}
                      >
                        Products
                      </NavLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavLink
                        to="/admin/orders"
                        className={({ isActive }) => cn(
                          navigationMenuTriggerStyle(),
                          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10 hover:text-primary'
                        )}
                      >
                        Orders
                      </NavLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavLink
                        to="/admin/recipes"
                        className={({ isActive }) => cn(
                          navigationMenuTriggerStyle(),
                          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10 hover:text-primary'
                        )}
                      >
                        Recipes
                      </NavLink>
                    </NavigationMenuItem>
                  </>
                ) : (
                  navLinks.map((link) => (
                    <NavigationMenuItem key={link.to}>
                      <NavLink
                        to={link.to}
                        className={({ isActive }) => cn(
                          navigationMenuTriggerStyle(),
                          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10 hover:text-primary'
                        )}
                      >
                        {link.label}
                      </NavLink>
                    </NavigationMenuItem>
                  ))
                )}
              </NavigationMenuList>
            </NavigationMenu>
            {!isAdmin && (
              <div className="flex items-center space-x-2">
                <CartIcon />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center space-x-2">
            {!isAdmin && <CartIcon />}
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="ml-2">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden border-t bg-background"
            >
              <nav className="container py-4">
                {isAdmin ? (
                  <div className="flex flex-col space-y-2">
                    <NavLink
                      to="/admin"
                      className={({ isActive }) => cn(
                        "px-4 py-2 rounded-md",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 hover:text-primary"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/admin/products"
                      className={({ isActive }) => cn(
                        "px-4 py-2 rounded-md",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 hover:text-primary"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Products
                    </NavLink>
                    <NavLink
                      to="/admin/orders"
                      className={({ isActive }) => cn(
                        "px-4 py-2 rounded-md",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 hover:text-primary"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Orders
                    </NavLink>
                    <NavLink
                      to="/admin/recipes"
                      className={({ isActive }) => cn(
                        "px-4 py-2 rounded-md",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 hover:text-primary"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Recipes
                    </NavLink>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    {navLinks.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => cn(
                          "px-4 py-2 rounded-md",
                          isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 hover:text-primary"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex-grow container py-8"
      >
        {children}
      </motion.main>

      <footer className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground dark:text-foreground dark:from-black dark:to-neutral-950 dark:border-t dark:border-primary/20 py-16 mt-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <img
                src="/logo.png"
                alt="Ceylon Spice Hub Logo"
                className="h-20 w-20 mb-4 opacity-90"
              />
              <h3 className="text-2xl font-bold mb-2">The Ceylon Spice Hub</h3>
              <p className="text-sm opacity-80 font-light">Authentic Taste of Nature</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2.5">
                {navLinks.map(link => (
                  <li key={`footer-${link.to}`}>
                    <Link to={link.to} className="text-sm hover:text-accent transition-all duration-200 opacity-80 hover:opacity-100 hover:translate-x-1 inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-sm opacity-80">
                <p>The Ceylon Spice Hub (Pvt) Ltd.<br />233, Colombo Road, Divulpitiya,<br />Boralasgamuwa, Sri Lanka</p>
                <p className="hover:text-accent transition-colors cursor-pointer">info@ceylonspicehub.lk</p>
                <p>+94 11 251 8423</p>
              </div>
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                <div className="flex gap-4 justify-center md:justify-start">
                  <a
                    href="https://www.instagram.com/ceylon_spice.hub/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-background/10 hover:bg-background/20 p-3 rounded-full transition-all duration-300 border border-transparent hover:border-primary-foreground/20 hover:scale-110"
                    aria-label="Visit our Instagram"
                  >
                    <Instagram className="h-5 w-5 group-hover:text-white transition-colors" />
                  </a>
                  <a
                    href="https://web.facebook.com/tcsh.lk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-background/10 hover:bg-background/20 p-3 rounded-full transition-all duration-300 border border-transparent hover:border-primary-foreground/20 hover:scale-110"
                    aria-label="Visit our Facebook"
                  >
                    <Facebook className="h-5 w-5 group-hover:text-white transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm opacity-70 font-light order-2 md:order-1">
              &copy; {new Date().getFullYear()} Ceylon Spice Hub (Pvt) Ltd. All Rights Reserved.
            </p>

            <div className="flex items-center gap-3 order-1 md:order-2">
              <span className="text-[10px] uppercase tracking-widest opacity-60">Created By</span>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group bg-background/10 hover:bg-background/20 px-3 py-1.5 rounded-full transition-all duration-300 border border-transparent hover:border-primary-foreground/10"
              >
                <img
                  src="/images/milestones/tsl_logo.svg"
                  alt="Turing Solutions Ltd"
                  className="h-5 w-auto"
                />
                <span className="font-medium text-xs tracking-wide group-hover:text-white transition-colors">Turing Solutions</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
