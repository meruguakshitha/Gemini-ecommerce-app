
import React, { useState, useMemo } from 'react';
import { Product, UserRole } from '../types';

// --- Icons ---
const PlusIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
    </svg>
);
const EditIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.886 1.343Z" />
    </svg>
);
const TrashIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
    </svg>
);


// --- Product Card Component (defined inside ProductGrid) ---
interface ProductCardProps {
  product: Product;
  userRole: UserRole;
  onAddToCart: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, userRole, onAddToCart, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative">
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                <div className="absolute top-2 right-2 bg-secondary/80 text-white text-xs font-bold px-2 py-1 rounded-full">{product.category}</div>
                {userRole === UserRole.ADMIN && (
                    <div className="absolute top-2 left-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(product)} className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"><EditIcon className="w-4 h-4" /></button>
                        <button onClick={() => onDelete(product.id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-slate-800 mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-slate-500 mb-4 flex-grow">{product.description}</p>
                <div className="flex justify-between items-center mt-auto">
                    <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
                    <button onClick={() => onAddToCart(product)} className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors flex items-center space-x-2">
                        <PlusIcon className="w-5 h-5"/>
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main ProductGrid Component ---
interface ProductGridProps {
  products: Product[];
  userRole: UserRole;
  onAddToCart: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: () => void;
}

const ITEMS_PER_PAGE = 8;

const ProductGrid: React.FC<ProductGridProps> = ({ products, userRole, onAddToCart, onEditProduct, onDeleteProduct, onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-full focus:ring-2 focus:ring-primary focus:outline-none"
          />
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
        {userRole === UserRole.ADMIN && (
          <button onClick={onAddProduct} className="bg-secondary text-white font-bold py-2 px-6 rounded-full hover:bg-green-600 transition-colors flex items-center space-x-2 whitespace-nowrap">
             <PlusIcon className="w-5 h-5"/>
             <span>Add New Product</span>
          </button>
        )}
      </div>

      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map(product => (
            <ProductCard
                key={product.id}
                product={product}
                userRole={userRole}
                onAddToCart={onAddToCart}
                onEdit={onEditProduct}
                onDelete={onDeleteProduct}
            />
            ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-slate-600">No Products Found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search term.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Previous
          </button>
          <span className="text-slate-600">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
