import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

// Theme modes: light, dark, oled, auto
// Accent colors with their Tailwind-like color palettes
const ACCENT_COLORS = {
    indigo: {
        50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
        400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
        800: '#3730a3', 900: '#312e81'
    },
    purple: {
        50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe',
        400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7c3aed',
        800: '#6b21a8', 900: '#581c87'
    },
    blue: {
        50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
        400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
        800: '#1e40af', 900: '#1e3a8a'
    },
    teal: {
        50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4',
        400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e',
        800: '#115e59', 900: '#134e4a'
    },
    rose: {
        50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af',
        400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c',
        800: '#9f1239', 900: '#881337'
    },
    amber: {
        50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
        400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
        800: '#92400e', 900: '#78350f'
    }
};

const ACCESSIBILITY_MODES = ['none', 'protanopia', 'deuteranopia', 'tritanopia'];

export function ThemeProvider({ children }) {
    // Theme mode: light, dark, oled, auto
    const [themeMode, setThemeModeState] = useState(() => {
        const stored = localStorage.getItem('themeMode');
        return stored || 'auto';
    });

    // Accent color
    const [accentColor, setAccentColorState] = useState(() => {
        const stored = localStorage.getItem('accentColor');
        return stored || 'indigo';
    });

    // Accessibility mode
    const [accessibilityMode, setAccessibilityModeState] = useState(() => {
        const stored = localStorage.getItem('accessibilityMode');
        return stored || 'none';
    });

    // Reading mode
    const [readingMode, setReadingMode] = useState(() => {
        const stored = localStorage.getItem('readingMode');
        return stored === 'true';
    });

    // Resolved theme (what's actually applied)
    const [resolvedTheme, setResolvedTheme] = useState('light');

    // Apply theme mode
    useEffect(() => {
        const root = document.documentElement;
        let effectiveTheme = themeMode;

        // Handle auto mode
        if (themeMode === 'auto') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            effectiveTheme = systemDark ? 'dark' : 'light';

            // Listen for system changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = (e) => {
                const newTheme = e.matches ? 'dark' : 'light';
                setResolvedTheme(newTheme);
                root.classList.remove('light', 'dark', 'oled');
                root.classList.add(newTheme);
            };
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        }

        setResolvedTheme(effectiveTheme);

        // Apply class
        root.classList.remove('light', 'dark', 'oled');
        if (effectiveTheme === 'oled') {
            root.classList.add('dark', 'oled');
        } else {
            root.classList.add(effectiveTheme);
        }

        localStorage.setItem('themeMode', themeMode);
    }, [themeMode]);

    // Apply accent color
    useEffect(() => {
        const root = document.documentElement;
        const palette = ACCENT_COLORS[accentColor] || ACCENT_COLORS.indigo;

        // Set CSS variables for accent colors
        Object.entries(palette).forEach(([shade, color]) => {
            root.style.setProperty(`--accent-${shade}`, color);
        });

        root.setAttribute('data-accent', accentColor);
        localStorage.setItem('accentColor', accentColor);
    }, [accentColor]);

    // Apply accessibility mode
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-accessibility', accessibilityMode);
        localStorage.setItem('accessibilityMode', accessibilityMode);
    }, [accessibilityMode]);

    // Apply reading mode
    useEffect(() => {
        const root = document.documentElement;
        if (readingMode) {
            root.classList.add('reading-mode');
        } else {
            root.classList.remove('reading-mode');
        }
        localStorage.setItem('readingMode', String(readingMode));
    }, [readingMode]);

    // Setters
    const setThemeMode = useCallback((mode) => {
        if (['light', 'dark', 'oled', 'auto'].includes(mode)) {
            setThemeModeState(mode);
        }
    }, []);

    const setAccentColor = useCallback((color) => {
        if (ACCENT_COLORS[color]) {
            setAccentColorState(color);
        }
    }, []);

    const setAccessibilityMode = useCallback((mode) => {
        if (ACCESSIBILITY_MODES.includes(mode)) {
            setAccessibilityModeState(mode);
        }
    }, []);

    const toggleReadingMode = useCallback(() => {
        setReadingMode(prev => !prev);
    }, []);

    // Legacy toggle for navbar button
    const toggleTheme = useCallback(() => {
        setThemeModeState(prev => {
            if (prev === 'light') return 'dark';
            if (prev === 'dark') return 'light';
            if (prev === 'oled') return 'light';
            // auto - toggle to opposite of current
            return resolvedTheme === 'dark' ? 'light' : 'dark';
        });
    }, [resolvedTheme]);

    const value = {
        // Current values
        themeMode,
        accentColor,
        accessibilityMode,
        readingMode,
        resolvedTheme,

        // Derived
        isDark: resolvedTheme === 'dark' || resolvedTheme === 'oled',
        isOled: themeMode === 'oled',

        // Setters
        setThemeMode,
        setAccentColor,
        setAccessibilityMode,
        toggleReadingMode,
        toggleTheme,

        // For backwards compatibility
        theme: resolvedTheme,
        setTheme: setThemeMode,

        // Constants for UI
        accentColors: Object.keys(ACCENT_COLORS),
        accessibilityModes: ACCESSIBILITY_MODES,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
