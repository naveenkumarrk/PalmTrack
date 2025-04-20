import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, CreditCard, Menu, X, LogOut, LogIn, UserPlus, Box, ListPlus, Clipboard, PackageOpen, ChevronDown, User } from "lucide-react";
import { useAuth } from '../auth/useAuth';

const Navbar = () => {
  const { user, logout, loading, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!user);
    
    const token = localStorage.getItem('token');
    if (token && !user) {
      updateUser();
    }
  }, [user, loading, updateUser]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsAuthenticated(false);
  };

  // Check if user is an employee
  const isEmployee = user?.role === 'employee';
  
  // Check if current route is active
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="relative z-50">
      <nav className="px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg rounded-lg mx-4 my-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full flex items-center justify-center shadow-md">
                <img src="/vite.svg" alt="" srcSet="" />
              </div>
              <span className="font-bold text-xl text-white">PalmSugar</span> 
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {loading ? (
              <div className="px-3 py-1.5 text-gray-300 text-sm flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </div>
            ) : isAuthenticated ? (
              <>
                <NavLinkDesktop to="/dashboard" icon={<Home size={16} />} text="Dashboard" isActive={isActiveRoute('/dashboard')} />
                <NavLinkDesktop to="/neera" icon={<CreditCard size={16} />} text="Add Neera" isActive={isActiveRoute('/neera')} />
                <NavLinkDesktop to="/neera/list" icon={<ListPlus size={16} />} text="Neera List" isActive={isActiveRoute('/neera/list')} />
                <NavLinkDesktop to="/processing/create" icon={<Clipboard size={16} />} text="Process" isActive={isActiveRoute('/processing/create')} />
                
                {/* Only show these routes if not an employee */}
                {!isEmployee && (
                  <>
                    <NavLinkDesktop to="/inventory" icon={<PackageOpen size={16} />} text="Inventory" isActive={isActiveRoute('/inventory')} />
                    <NavLinkDesktop to="/inventory/list" icon={<Box size={16} />} text="Stock" isActive={isActiveRoute('/inventory/list')} />
                    <NavLinkDesktop to="/manager" icon={<UserPlus size={16} />} text="Manager" isActive={isActiveRoute('/manager')} />
                  </>
                )}
                
                {/* Profile dropdown */}
                <div className="relative ml-4">
                  <button 
                    onClick={toggleProfile}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
                  >
                    <div className="h-6 w-6 bg-gray-700 rounded-full flex items-center justify-center text-xs text-white font-medium">
                      {user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm">{user?.name || user?.username}</span>
                    <ChevronDown size={14} className={`transition-transform ${isProfileOpen ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name || user?.username}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <div className="mt-1 px-2 py-0.5 bg-gray-100 rounded text-xs inline-block text-gray-700">{user?.role}</div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut size={16} className="mr-2 text-gray-500" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login"
                  className="px-4 py-2 text-sm text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                >
                  <div className="flex items-center">
                    <LogIn size={16} className="mr-2" />
                    <span>Sign in</span>
                  </div>
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 text-sm text-gray-900 bg-white hover:bg-gray-100 rounded-md transition-colors"
                >
                  <div className="flex items-center">
                    <UserPlus size={16} className="mr-2" />
                    <span>Sign up</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {isAuthenticated && (
              <div className="mr-3 h-8 w-8 bg-gray-800 rounded-full flex items-center justify-center text-xs font-medium text-white">
                {user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <button 
              className="flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mx-4 mt-1 py-2 bg-white rounded-lg shadow-xl border border-gray-100 z-40">
          {loading ? (
            <div className="px-4 py-3 flex items-center text-gray-700">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
              Loading...
            </div>
          ) : isAuthenticated ? (
            <>
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name || user?.username}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <div className="mt-1 px-2 py-0.5 bg-gray-100 rounded text-xs inline-block text-gray-700">{user?.role}</div>
              </div>
              
              <NavLinkMobile to="/dashboard" icon={<Home size={18} />} text="Dashboard" onClick={toggleMenu} isActive={isActiveRoute('/dashboard')} />
              <NavLinkMobile to="/neera" icon={<CreditCard size={18} />} text="Add Neera" onClick={toggleMenu} isActive={isActiveRoute('/neera')} />
              <NavLinkMobile to="/neera/list" icon={<ListPlus size={18} />} text="Neera List" onClick={toggleMenu} isActive={isActiveRoute('/neera/list')} />
              <NavLinkMobile to="/processing/create" icon={<Clipboard size={18} />} text="Process" onClick={toggleMenu} isActive={isActiveRoute('/processing/create')} />
              
              {/* Only show these routes if not an employee */}
              {!isEmployee && (
                <>
                  <NavLinkMobile to="/inventory" icon={<PackageOpen size={18} />} text="Inventory" onClick={toggleMenu} isActive={isActiveRoute('/inventory')} />
                  <NavLinkMobile to="/inventory/list" icon={<Box size={18} />} text="Stock" onClick={toggleMenu} isActive={isActiveRoute('/inventory/list')} />
                  <NavLinkMobile to="/manager" icon={<UserPlus size={18} />} text="Manager" onClick={toggleMenu} isActive={isActiveRoute('/manager')} />
                </>
              )}
              
              <div className="px-4 py-2 border-t border-gray-100 mt-1">
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <LogOut size={18} className="mr-3 text-gray-500" />
                  <span className="text-sm font-medium">Sign out</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 grid grid-cols-2 gap-2">
                <Link to="/login" onClick={toggleMenu} className="flex items-center justify-center px-4 py-2 text-sm text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors">
                  <LogIn size={16} className="mr-2" />
                  <span>Sign in</span>
                </Link>
                <Link to="/register" onClick={toggleMenu} className="flex items-center justify-center px-4 py-2 text-sm text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                  <UserPlus size={16} className="mr-2" />
                  <span>Sign up</span>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const NavLinkDesktop = ({ to, icon, text, isActive }) => (
  <Link to={to} className={`px-3 py-1.5 rounded-md transition-colors ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}>
    <div className="flex items-center space-x-1.5">
      <span>{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  </Link>
);

const NavLinkMobile = ({ to, icon, text, onClick, isActive }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`block px-4 py-2.5 ${isActive ? 'bg-gray-50 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
  >
    <div className="flex items-center">
      <span className={`mr-3 ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  </Link>
);

export default Navbar;