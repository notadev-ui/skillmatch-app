import React from 'react';

const Layout = ({ children }) => {
  return (
    <main className="min-h-[calc(100vh-160px)]">{/* reserve space for header/footer visually */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
};

export default Layout;
