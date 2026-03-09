import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { addToCart } from '@/lib/cartStore';

const ProductCard = ({ product }) => {
  const { toast } = useToast();

  const handleAddToCart = () => {
    let productToAdd = product;
    let description = `${product.name} has been added to your cart.`;

    // If product has variants, select the first one (lowest price)
    if (product.variants && product.variants.length > 0) {
      // Sort variants by price to ensure we get the lowest one
      const sortedVariants = [...product.variants].sort((a, b) => (a.price || 0) - (b.price || 0));
      const selectedVariant = sortedVariants[0];

      // Create a product object with variant info
      productToAdd = {
        ...product,
        price: selectedVariant.price || product.price || 0,
        stock: selectedVariant.stock,
        weight: selectedVariant.weight,
        variantType: selectedVariant.type,
        variantWeight: selectedVariant.weight,
        variantId: `${selectedVariant.type}-${selectedVariant.weight}`
      };

      description = `${product.name} (${selectedVariant.weight}) has been added to your cart.`;
    }

    // Add the product to cart with quantity 1
    addToCart(productToAdd, 1);

    // Show a toast notification
    toast({
      title: "Added to Cart",
      description: description,
    });
  };

  const isOutOfStock = () => {
    if (product.variants && product.variants.length > 0) {
      // If variants exist, product is out of stock only if ALL variants are out of stock
      return product.variants.every(v => v.stock_available === false);
    }
    // Otherwise rely on the main flag
    return product.stock_available === false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card className="group h-full flex flex-col overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300 bg-card border-border/50 hover:border-primary/30">
        {/* Image Container */}
        <div className={`relative aspect-square overflow-hidden flex items-center justify-center ${(product.imageUrl || product.image) ? 'bg-white' : 'bg-muted/30'}`}>
          <img
            className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-110 object-contain"
            alt={product.alt || product.name}
            loading="lazy"
            src={product.imageUrl || product.image || "/images/milestones/Image_not_available.png"}
          />

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick view button */}
          <Link
            to={`/product/${product._id || product.id}`}
            state={{ product }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-white/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
            >
              <Eye className="w-4 h-4 mr-2" />
              Quick View
            </Button>
          </Link>

          {/* Pre-Order badge */}
          {product.category === 'Katagasma Range' && !isOutOfStock() && (
            <div className="absolute top-2 left-2 z-10">
              <span className="flex items-center gap-1 bg-amber-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded shadow-md">
                <Clock className="h-3 w-3" />
                Pre-Order
              </span>
            </div>
          )}

          {/* Out of stock badge */}
          {isOutOfStock() && (
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-destructive text-destructive-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider rounded shadow-md">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 h-[3.5rem]">
            {product.name}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {(() => {
              if (product.variants && product.variants.length > 0) {
                // Sort variants by price (ascending) to typically put smallest weights first
                const sortedVariants = [...product.variants].sort((a, b) => (a.price || 0) - (b.price || 0));

                const weights = [...new Set(sortedVariants.map(v => v.weight).filter(w => w))];
                return weights.length > 0 ? weights.join(', ') : (product.category || "");
              }
              return product.category || "";
            })()}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-grow pb-3">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-primary">
              {(() => {
                if (product.variants && product.variants.length > 0) {
                  // Use same sorted logic to get lowest price
                  const sortedVariants = [...product.variants].sort((a, b) => (a.price || 0) - (b.price || 0));
                  const firstPrice = sortedVariants[0].price;

                  if (firstPrice && !isNaN(firstPrice)) {
                    return `LKR ${firstPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                  }
                }

                // Fallback for legacy (though theoretically removed/hidden)
                if (product.price) {
                  return `LKR ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                }

                return 'LKR N/A';
              })()}
            </p>
          </div>
        </CardContent>

        {/* Actions */}
        <CardFooter className="pt-0 pb-4 px-4 gap-2">
          <Button
            onClick={handleAddToCart}
            className={`flex-1 shadow-sm hover:shadow-md transition-all duration-200 group/button ${product.category === 'Katagasma Range' && !isOutOfStock() ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}`}
            disabled={isOutOfStock()}
          >
            <ShoppingCart className="w-4 h-4 mr-2 group-hover/button:scale-110 transition-transform" />
            {isOutOfStock() ? 'Out of Stock' : product.category === 'Katagasma Range' ? 'Pre-Order' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
