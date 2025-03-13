
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import ProductsToolbar from '@/components/Admin/Products/ProductsToolbar';
import ProductTabs from '@/components/Admin/Products/ProductTabs';
import ProductFormDialog from '@/components/Admin/Products/ProductFormDialog';

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleProductSaved = () => {
    // Product saved successfully
    // ProductList will automatically update via real-time subscription
  };

  return (
    <>
      <Helmet>
        <title>Products Management | Admin Panel</title>
      </Helmet>
      
      <div className="flex flex-col gap-6">
        <ProductsToolbar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCreateProduct={handleCreateProduct}
        />
        
        <ProductTabs onEditProduct={handleEditProduct} />
      </div>
      
      {/* Product Form Dialog */}
      <ProductFormDialog 
        open={showProductForm}
        onOpenChange={setShowProductForm}
        editingProduct={editingProduct}
        onProductSaved={handleProductSaved}
      />
    </>
  );
};

export default ProductsPage;
