
import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';

import HomePage from './pages/HomePage';
import ClassificationPage from './pages/ClassificationPage';
import BroadcastPage from './pages/BroadcastPage';
import SelectionPage from './pages/SelectionPage';
import CraqueGalleryPage from './pages/CraqueGalleryPage';
import AdminPage from './pages/AdminPage';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-white text-black flex flex-col font-display">
    <Header />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
    <ChatBot />
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><div className="size-20 border-8 border-primary border-t-transparent animate-spin"></div></div>}>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/classificacao" element={<ClassificationPage />} />
            <Route path="/transmissoes" element={<BroadcastPage />} />
            <Route path="/selecao" element={<SelectionPage />} />
            <Route path="/galeria" element={<CraqueGalleryPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Layout>
      </Suspense>
    </Router>
  );
};

export default App;
