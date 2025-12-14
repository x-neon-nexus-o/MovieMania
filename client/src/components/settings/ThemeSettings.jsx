import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sun, Moon, Monitor, Smartphone, Palette, Eye, BookOpen,
    X, Check, Settings, Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Modal from '../common/Modal';

const THEME_MODES = [
    { id: 'light', label: 'Light', icon: Sun, description: 'Bright and clean' },
    { id: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { id: 'oled', label: 'OLED', icon: Smartphone, description: 'Pure black, saves battery' },
    { id: 'auto', label: 'Auto', icon: Monitor, description: 'Follow system setting' },
];

const ACCENT_COLORS = [
    { id: 'indigo', label: 'Indigo', color: '#6366f1', bg: 'bg-indigo-500' },
    { id: 'purple', label: 'Purple', color: '#a855f7', bg: 'bg-purple-500' },
    { id: 'blue', label: 'Blue', color: '#3b82f6', bg: 'bg-blue-500' },
    { id: 'teal', label: 'Teal', color: '#14b8a6', bg: 'bg-teal-500' },
    { id: 'rose', label: 'Rose', color: '#f43f5e', bg: 'bg-rose-500' },
    { id: 'amber', label: 'Amber', color: '#f59e0b', bg: 'bg-amber-500' },
];

const ACCESSIBILITY_MODES = [
    { id: 'none', label: 'None', description: 'Standard colors' },
    { id: 'protanopia', label: 'Protanopia', description: 'Red-blind friendly' },
    { id: 'deuteranopia', label: 'Deuteranopia', description: 'Green-blind friendly' },
    { id: 'tritanopia', label: 'Tritanopia', description: 'Blue-blind friendly' },
];

export default function ThemeSettings({ isOpen, onClose }) {
    const {
        themeMode, setThemeMode,
        accentColor, setAccentColor,
        accessibilityMode, setAccessibilityMode,
        readingMode, toggleReadingMode,
    } = useTheme();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Appearance Settings" size="lg">
            <div className="space-y-8">
                {/* Theme Mode */}
                <section>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Theme Mode
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {THEME_MODES.map((mode) => {
                            const Icon = mode.icon;
                            const isSelected = themeMode === mode.id;
                            return (
                                <button
                                    key={mode.id}
                                    onClick={() => setThemeMode(mode.id)}
                                    className={`relative p-4 rounded-xl border-2 transition-all ${isSelected
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className={`p-2 rounded-lg mb-2 ${isSelected
                                                ? 'bg-primary-100 dark:bg-primary-800'
                                                : 'bg-gray-100 dark:bg-gray-800'
                                            }`}>
                                            <Icon className={`w-5 h-5 ${isSelected
                                                    ? 'text-primary-600 dark:text-primary-400'
                                                    : 'text-gray-500 dark:text-gray-400'
                                                }`} />
                                        </div>
                                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                                            {mode.label}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-0.5">
                                            {mode.description}
                                        </span>
                                    </div>
                                    {isSelected && (
                                        <motion.div
                                            layoutId="theme-check"
                                            className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center"
                                        >
                                            <Check className="w-3 h-3 text-white" />
                                        </motion.div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Accent Color */}
                <section>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Accent Color
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {ACCENT_COLORS.map((color) => {
                            const isSelected = accentColor === color.id;
                            return (
                                <button
                                    key={color.id}
                                    onClick={() => setAccentColor(color.id)}
                                    className={`group relative w-12 h-12 rounded-xl transition-all ${isSelected
                                            ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-gray-100 dark:ring-offset-gray-900'
                                            : 'hover:scale-110'
                                        }`}
                                    style={{ backgroundColor: color.color }}
                                    title={color.label}
                                >
                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="absolute inset-0 flex items-center justify-center"
                                            >
                                                <Check className="w-5 h-5 text-white drop-shadow-lg" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Selected: <span className="font-medium capitalize">{accentColor}</span>
                    </p>
                </section>

                {/* Accessibility */}
                <section>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Color Vision Accessibility
                    </h3>
                    <select
                        value={accessibilityMode}
                        onChange={(e) => setAccessibilityMode(e.target.value)}
                        className="input"
                    >
                        {ACCESSIBILITY_MODES.map((mode) => (
                            <option key={mode.id} value={mode.id}>
                                {mode.label} — {mode.description}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                        Adjusts colors for better visibility with color vision deficiencies.
                    </p>
                </section>

                {/* Reading Mode */}
                <section>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Reading Mode
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Optimized typography for reviews and long text
                            </p>
                        </div>
                        <button
                            onClick={toggleReadingMode}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${readingMode
                                    ? 'bg-primary-600'
                                    : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${readingMode ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </section>

                {/* Preview */}
                <section className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Preview
                    </h3>
                    <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 space-y-3">
                        <div className="flex gap-2">
                            <div
                                className="px-4 py-2 rounded-lg text-white font-medium text-sm"
                                style={{ backgroundColor: 'var(--accent-600)' }}
                            >
                                Primary Button
                            </div>
                            <div
                                className="px-4 py-2 rounded-lg font-medium text-sm border-2"
                                style={{
                                    borderColor: 'var(--accent-600)',
                                    color: 'var(--accent-600)'
                                }}
                            >
                                Secondary
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <span
                                className="px-2 py-1 rounded-full text-xs font-medium"
                                style={{
                                    backgroundColor: 'var(--accent-100)',
                                    color: 'var(--accent-700)'
                                }}
                            >
                                Badge
                            </span>
                            <span
                                className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            >
                                Success
                            </span>
                            <span
                                className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            >
                                Error
                            </span>
                        </div>
                        <p className={`text-sm text-gray-600 dark:text-gray-400 ${readingMode ? 'text-lg leading-relaxed' : ''}`}>
                            This is how text will appear with your current settings.
                            {readingMode && ' Reading mode is enabled for better readability.'}
                        </p>
                    </div>
                </section>
            </div>
        </Modal>
    );
}

// Floating settings button component
export function ThemeSettingsButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Appearance settings"
            >
                <Settings className="w-5 h-5" />
            </button>
            <ThemeSettings isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
