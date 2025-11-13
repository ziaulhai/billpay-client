import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggler = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light'
    );

    const handleToggle = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        const html = document.documentElement;

        html.setAttribute('data-theme', theme);

    }, [theme]);

    return (
        <button
            onClick={handleToggle}
            className="btn btn-ghost btn-circle text-xl"
            aria-label="Toggle Theme"
        >

            {theme === 'dark' ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-700" />}
        </button>
    );
};

export default ThemeToggler;