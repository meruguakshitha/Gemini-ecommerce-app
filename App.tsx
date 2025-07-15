
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { generateProducts } from './services/geminiService';
import { Product, CartItem, UserRole } from './types';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import ProductModal from './components/ProductModal';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [showToast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const generatedProducts = await generateProducts();
        setProducts(generatedProducts);
      } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const displayToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleAddToCart = useCallback((product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    displayToast(`${product.name} added to cart!`);
  }, []);

  const handleUpdateCartQuantity = useCallback((productId: string, quantity: number) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(item => item.id !== productId);
      }
      return prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  }, []);

  const handleRemoveFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const handleCheckout = useCallback(() => {
    if(cart.length === 0) {
        displayToast("Your cart is empty!");
        return;
    }
    displayToast("Order placed successfully! Thank you for shopping.");
    setCart([]);
    setIsCartOpen(false);
  }, [cart]);

  const handleOpenModal = (product: Product | null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleProductSubmit = (product: Product) => {
    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
      displayToast("Product updated successfully!");
    } else {
      // Add new product
      setProducts(prev => [{ ...product, id: `prod-${Date.now()}` }, ...prev]);
       displayToast("Product added successfully!");
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    displayToast("Product deleted.");
  }, []);

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-slate-600 font-semibold">Generating Amazing Products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-700">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg border border-red-200">
            <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h2>
            <p className="mb-4">{error}</p>
            <p>Please ensure your Gemini API key is correctly configured in the environment variables.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header
        userRole={userRole}
        onRoleChange={setUserRole}
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      <main className="container mx-auto px-4 py-8">
        <ProductGrid
          products={products}
          userRole={userRole}
          onAddToCart={handleAddToCart}
          onEditProduct={handleOpenModal}
          onDeleteProduct={handleDeleteProduct}
          onAddProduct={() => handleOpenModal(null)}
        />
      </main>
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
       <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleProductSubmit}
        productToEdit={editingProduct}
      />
      {showToast && (
         <div className="fixed bottom-5 right-5 bg-secondary text-white py-2 px-5 rounded-lg shadow-lg animate-fade-in">
           {showToast}
         </div>
      )}
    </div>
  );
};

export default App;
