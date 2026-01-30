
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import HomePage from './pages/HomePage';
import ClassificationPage from './pages/ClassificationPage';
import AdminPage from './pages/AdminPage';
import BroadcastPage from './pages/BroadcastPage';
import SelectionPage from './pages/SelectionPage';
import CraqueGalleryPage from './pages/CraqueGalleryPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-white text-black flex flex-col font-display">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/classificacao" element={<ClassificationPage />} />
            <Route path="/transmissoes" element={<BroadcastPage />} />
            <Route path="/selecao" element={<SelectionPage />} />
            <Route path="/galeria" element={<CraqueGalleryPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
        <ChatBot />
      </div>
    </HashRouter>
  );
};

export default App;
