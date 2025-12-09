import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogIn, LogOut, User, Film, Plus, Bookmark, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/helpers';
import Button from '../common/Button';

import TMDBLogo from '../common/TMDBLogo';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const navLinkClass = ({ isActive }) =>
        cn(
            'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            isActive
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        );

    return (
        <nav className="sticky top-0 z-40 glass border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center transform group-hover:scale-105 transition-transform">
                            <Film className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-display font-bold text-gray-900 dark:text-white">
                            Movie<span className="text-primary-600">Mania</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/" end className={navLinkClass}>
                            Movies
                        </NavLink>
                        <NavLink to="/stats" className={navLinkClass}>
                            Stats
                        </NavLink>
                        {isAuthenticated && (
                            <>
                                <NavLink to="/dashboard" className={navLinkClass}>
                                    Dashboard
                                </NavLink>
                                <NavLink to="/watchlist" className={navLinkClass}>
                                    <Bookmark className="w-4 h-4 inline mr-1" />
                                    Watchlist
                                </NavLink>
                                <NavLink to="/collections" className={navLinkClass}>
                                    <FolderOpen className="w-4 h-4 inline mr-1" />
                                    Collections
                                </NavLink>
                                <NavLink to="/add" className={navLinkClass}>
                                    <Plus className="w-4 h-4 inline mr-1" />
                                    Add Movie
                                </NavLink>
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
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Hi, <span className="font-medium text-gray-900 dark:text-white">{user?.username}</span>
                                    </span>
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
                        <div className="px-4 py-4 space-y-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
                            <NavLink
                                to="/"
                                end
                                className={navLinkClass}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Movies
                            </NavLink>
                            <NavLink
                                to="/stats"
                                className={navLinkClass}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Stats
                            </NavLink>
                            {isAuthenticated ? (
                                <>
                                    <NavLink
                                        to="/dashboard"
                                        className={navLinkClass}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </NavLink>
                                    <NavLink
                                        to="/watchlist"
                                        className={navLinkClass}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Bookmark className="w-4 h-4 inline mr-1" />
                                        Watchlist
                                    </NavLink>
                                    <NavLink
                                        to="/collections"
                                        className={navLinkClass}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <FolderOpen className="w-4 h-4 inline mr-1" />
                                        Collections
                                    </NavLink>
                                    <NavLink
                                        to="/add"
                                        className={navLinkClass}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Add Movie
                                    </NavLink>
                                    <hr className="border-gray-200 dark:border-gray-700" />
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <LogOut className="w-4 h-4 inline mr-2" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <hr className="border-gray-200 dark:border-gray-700" />
                                    <Link
                                        to="/login"
                                        className="block w-full text-center px-3 py-2 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block w-full text-center px-3 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
