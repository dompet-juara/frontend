import React from 'react';

type SecondaryLayoutProps = {
  children: React.ReactNode;
};

const SecondaryLayout: React.FC<SecondaryLayoutProps> = ({ children }) => {
  return (
    <div className="secondary-layout-container">
      <header className="p-4 bg-gray-700 text-white text-center">
        <h1>Dompet Juara - Auth</h1>
      </header>
      <main className="p-4">
        {children}
      </main>
      <footer className="p-4 bg-gray-200 text-center text-sm">
        &copy; {new Date().getFullYear()} Dompet Juara
      </footer>
    </div>
  );
};

export default SecondaryLayout;