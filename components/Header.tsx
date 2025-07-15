
import React from 'react';
import { UserRole } from '../types';

interface HeaderProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  cartItemCount: number;
  onCartClick: () => void;
}

const ShoppingBagIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ userRole, onRoleChange, cartItemCount, onCartClick }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">
            Gemini Store
          </h1>
          <div className="flex items-center space-x-6">
             <div className="flex items-center space-x-2">
                <label htmlFor="role-select" className="text-sm font-medium text-slate-600">View as:</label>
                <select
                    id="role-select"
                    value={userRole}
                    onChange={(e) => onRoleChange(e.target.value as UserRole)}
                    className="block w-full rounded-md border-slate-300 py-1.5 pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
                >
                    <option>{UserRole.CUSTOMER}</option>
                    <option>{UserRole.ADMIN}</option>
                </select>
             </div>
            <button
              onClick={onCartClick}
              className="relative text-slate-600 hover:text-primary transition-colors"
              aria-label="Open shopping cart"
            >
              <ShoppingBagIcon className="w-7 h-7" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-secondary text-white text-xs font-bold rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
