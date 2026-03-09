import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ProductForm from '@/components/admin/ProductForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import api from '@/api';

const MAX_FEATURED_PRODUCTS = 5;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // all, in-stock, out-of-stock
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      // Ensure data is always an array
      const data = response.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Set empty array on error
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch products",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      const currentFeaturedCount = products.filter((product) => product.featured).length;
      const wasFeatured = Boolean(editingProduct?.featured);
      const wantsFeatured = Boolean(formData.featured);

      if (wantsFeatured && !wasFeatured && currentFeaturedCount >= MAX_FEATURED_PRODUCTS) {
        toast({
          title: "Featured limit reached",
          description: `Only ${MAX_FEATURED_PRODUCTS} products can be featured on the homepage.`,
          variant: "destructive"
        });
        return;
      }

      if (editingProduct) {
        await api.patch(`/products/${editingProduct._id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      fetchProducts();
      setIsDialogOpen(false);
      setEditingProduct(null);
      toast({
        title: "Success",
        description: `Product ${editingProduct ? 'updated' : 'created'} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      // 1. Delete image from Cloudinary if exists
      if (productToDelete.imageUrl && productToDelete.imageUrl.includes('cloudinary.com')) {
        try {
          const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
          const match = productToDelete.imageUrl.match(regex);
          if (match && match[1]) {
            const publicId = match[1];
            await api.post('/cloudinary/delete', { public_id: publicId });
          }
        } catch (err) {
          console.error("Failed to delete product image from cloud", err);
        }
      }

      // 2. Delete product from database
      await api.delete(`/products/${productToDelete._id}`);
      fetchProducts();
      toast({
        title: "Success",
        description: "Product deleted successfully"
      });
      setIsDeleteConfirmOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  // Determine effective stock status (considering variants)
  const isOutOfStock = (product) => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.every(v => v.stock_available === false);
    }
    return product.stock_available === false;
  };

  const filteredProducts = (Array.isArray(products) ? products : []).filter(product => {
    const matchesSearch = product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    const outOfStock = isOutOfStock(product);
    let matchesStock = true;
    if (stockFilter === 'in-stock') {
      matchesStock = !outOfStock;
    } else if (stockFilter === 'out-of-stock') {
      matchesStock = outOfStock;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  const featuredCount = products.filter((product) => product.featured).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory. {featuredCount}/{MAX_FEATURED_PRODUCTS} homepage featured slots used.
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Sauces">Sauces</SelectItem>
            <SelectItem value="Chutney">Chutney</SelectItem>
            <SelectItem value="Jam">Jam</SelectItem>
            <SelectItem value="Wines">Wines</SelectItem>
            <SelectItem value="Spices">Spices</SelectItem>
            <SelectItem value="Katagasma Range">Katagasma Range</SelectItem>
          </SelectContent>
        </Select>

        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Stock Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {filteredProducts.map((product) => (
          <Card key={product._id} className={`p-4 transition-all ${isOutOfStock(product) ? 'border-destructive/50 bg-destructive/5' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={product.imageUrl || "/images/milestones/Image_not_available.png"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.category} - {product.subCategory}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-primary">
                  {(() => {
                    if (product.price) {
                      return `LKR ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    } else if (product.variants && product.variants.length > 0) {
                      const prices = product.variants.map(v => v.price).filter(p => !isNaN(p));
                      if (prices.length > 0) {
                        const minPrice = Math.min(...prices);
                        const maxPrice = Math.max(...prices);
                        if (minPrice === maxPrice) {
                          return `LKR ${minPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        }
                        return `LKR ${minPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - ${maxPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                      }
                    }
                    return 'N/A';
                  })()}
                </span>
                <span className={`text-sm font-medium ${isOutOfStock(product)
                  ? 'text-destructive font-bold'
                  : 'text-green-600'
                  }`}>
                  {isOutOfStock(product) ? 'Out of Stock' : 'In Stock'}
                </span>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => handleDeleteClick(product)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            featuredCount={featuredCount}
            maxFeatured={MAX_FEATURED_PRODUCTS}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminProducts;
