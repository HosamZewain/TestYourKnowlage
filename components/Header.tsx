import React from 'react';

interface HeaderProps {
  t: {
    title: string;
    headerSubtitle: string;
  };
}

const Header: React.FC<HeaderProps> = ({ t }) => {
  return (
    <header className="w-full max-w-5xl mx-auto pt-4 pb-2 px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
        {t.title}
      </h1>
      <p className="text-sm text-gray-400 mt-1">{t.headerSubtitle}</p>
    </header>
  );
};

export default Header;
