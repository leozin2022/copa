
import React from 'react';

// Este arquivo é mantido para compatibilidade de tipos, 
// mas o roteamento agora é gerenciado pelo Next.js na pasta /pages
const App: React.FC<{children?: React.ReactNode}> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

export default App;
