import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

const NavButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  // Fix: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactElement;
}> = ({ label, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base font-medium rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-lg'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
    
  const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
    </svg>
  );

  const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
  );

  const HumanizerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
  );

  return (
    <header className="w-full flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600 mb-6">
        Gemini Creative Suite
      </h1>
      <nav className="flex space-x-2 sm:space-x-4 p-1.5 bg-gray-900/50 rounded-xl backdrop-blur-sm">
        <NavButton
          label="Chat Bot"
          isActive={currentView === AppView.CHATBOT}
          onClick={() => setCurrentView(AppView.CHATBOT)}
          icon={<ChatIcon />}
        />
        <NavButton
          label="Image Gen"
          isActive={currentView === AppView.IMAGE_GENERATOR}
          // Fix: Corrected typo `AppVw` to `AppView`.
          onClick={() => setCurrentView(AppView.IMAGE_GENERATOR)}
          icon={<ImageIcon />}
        />
        <NavButton
          label="Humanizer"
          isActive={currentView === AppView.HUMANIZER}
          onClick={() => setCurrentView(AppView.HUMANIZER)}
          icon={<HumanizerIcon />}
        />
      </nav>
    </header>
  );
};

export default Header;