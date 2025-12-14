import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
    Menu, X, Sun, Moon, LogIn, LogOut, User, Film, Plus, Bookmark,
    FolderOpen, Sparkles, Tv, ChevronDown, BarChart3, LayoutDashboard,
    Library, Compass, PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/helpers';
import Button from '../common/Button';
import TMDBLogo from '../common/TMDBLogo';

// Dropdown component
function NavDropdown({ label, icon: Icon, items, isOpen, onToggle, onClose }) {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={onToggle}
                className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isOpen
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
            >
                <Icon className="w-4 h-4" />
                {label}
                <ChevronDown className={cn(
                    'w-3.5 h-3.5 transition-transform duration-200',
                    isOpen && 'rotate-180'
                )} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50"
                    >
                        <div className="py-2">
                            {items.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    onClick={onClose}
                                    className={({ isActive }) => cn(
                                        'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                                        isActive
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    )}
                                >
                                    <item.icon className={cn('w-4 h-4', item.iconColor || '')} />
                                    <div>
                                        <div className="font-medium">{item.label}</div>
                                        {item.description && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                                        )}
                                    </div>
                                </NavLink>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleDropdownToggle = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const closeDropdowns = () => setOpenDropdown(null);

    // Define dropdown menus
    const browseItems = [
        { to: '/', end: true, icon: Film, label: 'Movies', description: 'Browse your movie collection' },
        { to: '/tv', icon: Tv, label: 'TV Shows', description: 'Track your TV series' },
        { to: '/stats', icon: BarChart3, label: 'Statistics', description: 'View your watching stats' },
    ];

    const libraryItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', description: 'Your personal overview' },
        { to: '/for-you', icon: Sparkles, label: 'For You', description: 'Personalized recommendations', iconColor: 'text-amber-500' },
        { to: '/watchlist', icon: Bookmark, label: 'Watchlist', description: 'Movies to watch later' },
        { to: '/collections', icon: FolderOpen, label: 'Collections', description: 'Organize your movies' },
    ];

    const addItems = [
        { to: '/add', icon: Film, label: 'Add Movie', description: 'Add a movie to your collection' },
        { to: '/tv/add', icon: Tv, label: 'Add TV Show', description: 'Add a TV show to track' },
    ];

    const mobileNavLinkClass = 'flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors';

    return (
        <nav className="sticky top-0 z-40 glass border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg shadow-primary-500/20">
                            <Film className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-display font-bold text-gray-900 dark:text-white">
                            Movie<span className="text-primary-600">Mania</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {/* Browse Dropdown */}
                        <NavDropdown
                            label="Browse"
                            icon={Compass}
                            items={browseItems}
                            isOpen={openDropdown === 'browse'}
                            onToggle={() => handleDropdownToggle('browse')}
                            onClose={closeDropdowns}
                        />

                        {/* Library Dropdown (only when authenticated) */}
                        {isAuthenticated && (
                            <>
                                <NavDropdown
                                    label="Library"
                                    icon={Library}
                                    items={libraryItems}
                                    isOpen={openDropdown === 'library'}
                                    onToggle={() => handleDropdownToggle('library')}
                                    onClose={closeDropdowns}
                                />

                                <NavDropdown
                                    label="Add New"
                                    icon={PlusCircle}
                                    items={addItems}
                                    isOpen={openDropdown === 'add'}
                                    onToggle={() => handleDropdownToggle('add')}
                                    onClose={closeDropdowns}
                                />
                            </>
                        )}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* TMDB Logo */}
                        <a
                            href="https://www.themoviedb.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mr-2 opacity-80 hover:opacity-100 transition-opacity hidden sm:block"
                        >
                            <TMDBLogo height="h-3" />
                        </a>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center gap-2">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                            <User className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {user?.username}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={logout}
                                        leftIcon={<LogOut className="w-4 h-4" />}
                                    >
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate('/login')}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => navigate('/register')}
                                    >
                                        Sign Up
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-200 dark:border-gray-800"
                    >
                        <div className="px-4 py-4 space-y-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
                            {/* Browse Section */}
                            <div className="mb-4">
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Browse
                                </div>
                                {browseItems.map(item => (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={mobileNavLinkClass}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <item.icon className="w-5 h-5 text-gray-500" />
                                        {item.label}
                                    </Link>
                                ))}
                            </div>

                            {isAuthenticated && (
                                <>
                                    {/* Library Section */}
                                    <div className="mb-4 pt-2 border-t border-gray-200 dark:border-gray-800">
                                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Your Library
                                        </div>
                                        {libraryItems.map(item => (
                                            <Link
                                                key={item.to}
                                                to={item.to}
                                                className={mobileNavLinkClass}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <item.icon className={cn('w-5 h-5', item.iconColor || 'text-gray-500')} />
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Add Section */}
                                    <div className="mb-4 pt-2 border-t border-gray-200 dark:border-gray-800">
                                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Add New
                                        </div>
                                        {addItems.map(item => (
                                            <Link
                                                key={item.to}
                                                to={item.to}
                                                className={mobileNavLinkClass}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <item.icon className="w-5 h-5 text-gray-500" />
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Logout */}
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Logout
                                        </button>
                                    </div>
                                </>
                            )}

                            {!isAuthenticated && (
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                                    <Link
                                        to="/login"
                                        className="block w-full text-center px-4 py-3 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block w-full text-center px-4 py-3 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
