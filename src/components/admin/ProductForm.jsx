import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, X, Image as ImageIcon, Package, DollarSign } from 'lucide-react';
import api from '@/api';

const CATEGORY_STRUCTURE = {
  'Sauces': ['Hot Sauces', 'Classic Sauces'],
  'Chutney': ['Chutney'],
  'Jam': ['Fruit Jam'],
  'Wines': ['Fruit Wine'],
  'Spices': ['Whole Spices', 'Spice Mixtures', 'Spice Blends'],
  'Katagasma Range': ['Moju', 'Pickle & Achcharu', 'Condiments', 'Baduma']
};

const ProductForm = ({ initialData, onSubmit, onCancel, featuredCount = 0, maxFeatured = 5 }) => {
  const { toast } = useToast();
  const isAlreadyFeatured = Boolean(initialData?.featured);
  const featuredLimitReached = featuredCount >= maxFeatured && !isAlreadyFeatured;

  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    subCategory: initialData?.subCategory || '',
    description: initialData?.description || '',
    featured: initialData?.featured || false,
    imageUrl: initialData?.imageUrl || '',
    alt: initialData?.alt || '',
    // Legacy single product fields
    price: initialData?.price || '',
    weight: initialData?.weight || '',
    stock_available: initialData?.stock_available !== undefined ? initialData.stock_available : true,
    // Variants
    variants: initialData?.variants || []
  });

  // Simplified mode toggle: Does this product have multiple options?
  const [hasVariants, setHasVariants] = React.useState(
    initialData ? (initialData.variants && initialData.variants.length > 0) : false
  );

  const [isUploading, setIsUploading] = React.useState(false);

  // Initialize form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value,
      subCategory: '' // Reset subcategory
    }));
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), {
        type: 'glass-bottle', // Default to common type
        price: '',
        stock_available: true,
        image: ''
      }]
    }));
  };

  const handleRemoveVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => i === index ? { ...v, [field]: value } : v)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare data submission
      const submitData = {
        name: formData.name,
        category: formData.category,
        subCategory: formData.subCategory,
        description: formData.description,
        featured: formData.featured,
        imageUrl: formData.imageUrl,
        alt: formData.alt,
      };

      if (formData.featured && featuredLimitReached) {
        throw new Error(`Only ${maxFeatured} products can be featured on the homepage.`);
      }

      if (hasVariants) {
        // Validate variants
        if (!formData.variants || formData.variants.length === 0) {
          throw new Error("Please add at least one product option (variant).");
        }

        submitData.variants = formData.variants.map((v, i) => {
          if (!v.weight || !v.price) throw new Error(`Option ${i + 1} is missing size or price.`);
          return {
            type: v.type,
            weight: v.weight,
            price: parseFloat(v.price),
            stock_available: v.stock_available !== false,
            image: v.image
          };
        });
      } else {
        // Single product mode - Convert to single variant
        if (!formData.price) throw new Error("Price is required.");

        submitData.variants = [{
          type: 'glass-bottle', // Default type for simple mode
          weight: formData.weight,
          price: parseFloat(formData.price),
          stock_available: formData.stock_available !== false
        }];

        // Clear top-level legacy fields just in case
        submitData.price = undefined;
        submitData.weight = undefined;
        submitData.stock_available = formData.stock_available; // keep top level stock for quick check? Or relies on variant? 
        // Actually, schema `stock_available` at top level is fine to keep as a summary, 
        // but `ProductCard` logic checks `variants.every(...)`.
        // Let's keep top level stock_available loosely synced or just rely on variants. 
        // My ProductCard update relies on variants first.
      }

      await onSubmit(submitData);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <form onSubmit={handleSubmit}>

        {/* SECTION 1: BASIC INFO */}
        <Card className="mb-6 border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle>1. Basic Information</CardTitle>
            <CardDescription>What is this product properly called and categorized?</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Label>Product Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Grandma's Hot Chili Sauce"
                className="text-lg"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(CATEGORY_STRUCTURE).map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sub-Category</Label>
                {formData.category && CATEGORY_STRUCTURE[formData.category] ? (
                  <Select value={formData.subCategory} onValueChange={(v) => setFormData(prev => ({ ...prev, subCategory: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sub-Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_STRUCTURE[formData.category].map(sub => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    placeholder={formData.category ? "Enter Sub-Category" : "Select Category first"}
                    disabled={!formData.category}
                  />
                )}
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the taste, ingredients, and story..."
                className="h-24"
              />
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: PRICING & VARIANTS */}
        <Card className="mb-6 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle>2. Pricing & Sizes</CardTitle>
            <CardDescription>Does this product come in different sizes (e.g. 100g vs 500g)?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6 p-4 bg-muted rounded-lg">
              <Switch
                checked={hasVariants}
                onCheckedChange={(checked) => {
                  setHasVariants(checked);
                  // Setup one empty variant if switching on
                  if (checked && (!formData.variants || formData.variants.length === 0)) {
                    handleAddVariant();
                  }
                }}
              />
              <Label className="font-medium">Yes, this product has multiple options (sizes/types)</Label>
            </div>

            {hasVariants ? (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm">
                    <div className="col-span-3">Type (Container)</div>
                    <div className="col-span-2">Size/Weight</div>
                    <div className="col-span-3">Price (LKR)</div>
                    <div className="col-span-2 text-center">In Stock?</div>
                    <div className="col-span-1"></div>
                  </div>
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 p-4 border-t items-center">
                      <div className="col-span-3">
                        <Select value={variant.type} onValueChange={(v) => handleVariantChange(index, 'type', v)}>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="glass-bottle">Glass Bottle</SelectItem>
                            <SelectItem value="pouch">Pouch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3">
                        <Input
                          placeholder="e.g. 350g"
                          value={variant.weight}
                          onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="col-span-2 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">LKR</span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          className="pl-12 h-9 font-mono"
                        />
                      </div>

                      <div className="col-span-2 flex justify-center">
                        <Switch
                          checked={variant.stock_available !== false}
                          onCheckedChange={(c) => handleVariantChange(index, 'stock_available', c)}
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveVariant(index)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" onClick={handleAddVariant} className="w-full border-dashed border-2">
                  <Plus className="mr-2 h-4 w-4" /> Add Another Option
                </Button>
              </div>
            ) : (
              // SIMPLE MODE
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div>
                  <Label>Price (LKR)</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="pl-9 text-lg"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <Label>Size / Weight</Label>
                  <div className="relative mt-1">
                    <Package className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="pl-9"
                      placeholder="e.g. 250g"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 flex items-center space-x-2 border p-3 rounded bg-background">
                  <Switch
                    checked={formData.stock_available}
                    onCheckedChange={(c) => setFormData(prev => ({ ...prev, stock_available: c }))}
                  />
                  <Label>Is this product currently in stock?</Label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SECTION 3: MEDIA */}
        <Card className="mb-6 border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle>3. Product Image</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Upload Image</Label>
                <div className="flex gap-2 items-center mt-1">
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      setIsUploading(true);

                      try {
                        const loadingToast = toast({
                          title: "Uploading...",
                          description: "Signing and uploading image...",
                        });

                        // 1. Get Signature from Backend
                        const signResponse = await api.post('/cloudinary/sign');
                        const { signature, timestamp, apiKey, folder } = signResponse.data;

                        // 2. Prepare Upload Data
                        const uploadData = new FormData();
                        uploadData.append('file', file);
                        uploadData.append('api_key', apiKey);
                        uploadData.append('timestamp', timestamp);
                        uploadData.append('signature', signature);
                        uploadData.append('folder', folder); // Must include folder in upload request
                        // Note: upload_preset is NOT sent for signed uploads unless using a signed preset

                        // 3. DELETE OLD IMAGE FIRST (Requested by user)
                        // Capture old image url to delete
                        // Note: We use component state 'formData.imageUrl' (which is the old image at this point)
                        const oldImageUrl = formData.imageUrl;

                        if (oldImageUrl && oldImageUrl.includes('cloudinary.com')) {
                          try {
                            // Extract public_id from URL
                            const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
                            const match = oldImageUrl.match(regex);
                            if (match && match[1]) {
                              const publicId = match[1];

                              // Await deletion before upload
                              await api.post('/cloudinary/delete', { public_id: publicId });
                            }
                          } catch (err) {
                            console.error("Failed to delete old image", err);
                            // We proceed with upload even if delete fails, otherwise user is stuck
                            toast({
                              title: "Warning",
                              description: "Could not delete old image, continuing with upload.",
                              variant: "warning"
                            });
                          }
                        }

                        // 4. Upload to Cloudinary

                        const response = await fetch(
                          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                          {
                            method: 'POST',
                            body: uploadData,
                          }
                        );

                        if (!response.ok) {
                          const errData = await response.json();
                          console.error("Cloudinary error response:", errData);
                          throw new Error(errData.error?.message || 'Upload failed');
                        }

                        const data = await response.json();

                        // Check if secure_url is present
                        if (data.secure_url) {
                          setFormData(prev => ({ ...prev, imageUrl: data.secure_url }));
                          toast({
                            title: "Success",
                            description: "Image uploaded successfully",
                          });
                        } else {
                          console.warn("No secure_url in response:", data);
                          toast({
                            title: "Warning",
                            description: "Upload succeeded but no URL returned.",
                            variant: "warning"
                          });
                        }
                      } catch (error) {
                        console.error("Upload Error:", error);
                        toast({
                          title: "Error",
                          description: `Failed to upload image: ${error.message}`,
                          variant: "destructive"
                        });
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                    className="cursor-pointer"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Select an image to auto-upload to Cloudinary.</p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or Use URL</span>
                </div>
              </div>

              <div>
                <Label>Image URL (Direct Link)</Label>
                <div className="flex gap-2">
                  <Input
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    disabled={isUploading}
                  />
                </div>
              </div>
              <div>
                <Label>Alt Text (for SEO)</Label>
                <Input name="alt" value={formData.alt} onChange={handleChange} placeholder="Describe image" />
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <Switch
                  checked={formData.featured}
                  disabled={!formData.featured && featuredLimitReached}
                  onCheckedChange={(c) => setFormData(prev => ({ ...prev, featured: c }))}
                />
                <Label>Feature this product on homepage?</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                {featuredLimitReached
                  ? `Featured limit reached. Unfeature one of the current ${maxFeatured} products before adding another.`
                  : `${featuredCount} of ${maxFeatured} homepage featured slots are currently in use.`}
              </p>
            </div>

            <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg p-4 min-h-[200px]">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="max-h-48 object-contain rounded shadow-sm"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <span>Image Preview</span>
                </div>
              )}
            </div>
          </CardContent>

          {hasVariants && formData.variants && formData.variants.length > 0 && (
            <div className="border-t p-6">
              <h4 className="font-semibold mb-4 text-base">Variant Specific Images</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-card space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{variant.type}</p>
                        <p className="text-xs text-muted-foreground">{variant.weight} - LKR {variant.price}</p>
                      </div>
                      {variant.image && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => handleVariantChange(index, 'image', '')}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    {variant.image ? (
                      <div className="aspect-square relative bg-muted rounded overflow-hidden">
                        <img src={variant.image} alt="Variant" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="aspect-square bg-muted/50 rounded flex flex-col items-center justify-center p-4 border-2 border-dashed hover:bg-muted/80 transition-colors">
                          <label className="cursor-pointer flex flex-col items-center gap-2 text-center w-full">
                            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                            <span className="text-xs text-muted-foreground">Upload Image</span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                try {
                                  toast({ title: "Uploading...", description: `Uploading image for ${variant.type} ${variant.weight}...` });
                                  // 1. Sign
                                  const signResponse = await api.post('/cloudinary/sign');
                                  const { signature, timestamp, apiKey, folder } = signResponse.data;

                                  // 2. Upload
                                  const uploadData = new FormData();
                                  uploadData.append('file', file);
                                  uploadData.append('api_key', apiKey);
                                  uploadData.append('timestamp', timestamp);
                                  uploadData.append('signature', signature);
                                  uploadData.append('folder', folder);

                                  const response = await fetch(
                                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                                    { method: 'POST', body: uploadData }
                                  );

                                  if (!response.ok) throw new Error('Upload failed');
                                  const data = await response.json();

                                  // 3. Update State
                                  handleVariantChange(index, 'image', data.secure_url);
                                  toast({ title: "Success", description: "Image uploaded" });
                                } catch (error) {
                                  console.error(error);
                                  toast({ title: "Error", description: "Upload failed", variant: "destructive" });
                                }
                              }}
                            />
                          </label>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or</span>
                          </div>
                        </div>

                        <Input
                          placeholder="Paste Image URL"
                          className="text-xs h-8"
                          value={variant.image || ''}
                          onChange={(e) => handleVariantChange(index, 'image', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 border-t">
          <Button type="button" variant="secondary" onClick={onCancel} className="px-6" disabled={isUploading}>
            Cancel
          </Button>
          <Button type="submit" size="lg" className="px-8 font-semibold" disabled={isUploading}>
            {isUploading ? 'Uploading...' : (initialData ? 'Save Changes' : 'Create Product')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
