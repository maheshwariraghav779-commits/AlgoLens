import React from 'react';

interface HeaderProps {
  activeModule: 'dsa' | 'filesystem';
  onSelectModule: (mod: 'dsa' | 'filesystem') => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onSelectModule,
  theme,
  onToggleTheme
}) => {
  return (
    <header>
      <div className="brand">
        <h1>
          Algo<b>Lens</b>
        </h1>
        <span className="subtitle">see algorithms think</span>
      </div>

      <div className="header-actions">
        {/* Module Switcher Tabs */}
        <div className="module-switcher">
          <button
            className={`module-btn ${activeModule === 'dsa' ? 'active' : ''}`}
            onClick={() => onSelectModule('dsa')}
          >
            📊 Module A: DSA Analyser
          </button>
          <button
            className={`module-btn ${activeModule === 'filesystem' ? 'active' : ''}`}
            onClick={() => onSelectModule('filesystem')}
          >
            📁 Module B: File System Tree
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          className="theme-btn"
          onClick={onToggleTheme}
          title="Toggle Light/Dark Theme"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </header>
  );
};
