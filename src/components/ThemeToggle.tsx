import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: `2px solid ${colors.border}`,
        backgroundColor: colors.cardBackground,
        color: colors.text,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        boxShadow: `0 2px 8px ${colors.shadow}`,
        transition: 'all 0.3s ease',
        zIndex: 1000
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
      }}
      title={isDarkMode ? 'Light Mode\'a geç' : 'Dark Mode\'a geç'}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;