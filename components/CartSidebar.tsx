
import React, { useMemo } from 'react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId:string) => void;
  onCheckout: () => void;
}

const PlusIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className}><path d="M8.75 3.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>
);
const MinusIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className}><path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" /></svg>
);
const XMarkIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
);

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}>
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><XMarkIcon className="w-6 h-6"/></button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <img src="https://picsum.photos/seed/cart/200/200" alt="Empty cart" className="w-40 h-40 rounded-full mb-4 opacity-50"/>
            <h3 className="text-xl font-semibold text-slate-700">Your cart is empty</h3>
            <p className="text-slate-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4">
            <ul className="space-y-4">
              {cartItems.map(item => (
                <li key={item.id} className="flex items-start space-x-4">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-md object-cover"/>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-slate-800">{item.name}</h4>
                    <p className="text-sm text-slate-500">${item.price.toFixed(2)}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 border rounded-md hover:bg-slate-100"><MinusIcon className="w-4 h-4"/></button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 border rounded-md hover:bg-slate-100"><PlusIcon className="w-4 h-4"/></button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => onRemoveItem(item.id)} className="text-xs text-red-500 hover:underline mt-2">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {cartItems.length > 0 && (
            <div className="p-4 border-t bg-slate-50">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium">Subtotal</span>
                    <span className="text-2xl font-bold text-primary">${subtotal.toFixed(2)}</span>
                </div>
                <button 
                    onClick={onCheckout}
                    className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-hover transition-colors"
                >
                    Place Order
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default CartSidebar;
