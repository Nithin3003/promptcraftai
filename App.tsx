
import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { AppView } from './types';
import Header from './components/Header';
import ChatBot from './components/ChatBot';
import ImageGenerator from './components/ImageGenerator';
// FIX: Corrected import path for ContentHumanizer.
import ContentHumanizer from './components/ContentHumanizer';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHATBOT);

  const renderView = () => {
    switch (currentView) {
      case AppView.IMAGE_GENERATOR:
        return <ImageGenerator />;
      case AppView.HUMANIZER:
        return <ContentHumanizer />;
      case AppView.CHATBOT:
      default:
        return <ChatBot />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        <main className="mt-6 bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8">
          {renderView()}
        </main>
         <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;