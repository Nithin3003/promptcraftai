
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import Spinner from './Spinner';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setImageUrl('');

    try {
      const url = await generateImage(prompt);
      setImageUrl(url);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
        Image Generator
      </h2>
      <p className="text-gray-400 mb-6 text-center">Describe the image you want to create. Powered by Imagen 4.</p>
      
      <form onSubmit={handleGenerate} className="w-full max-w-lg flex gap-3 mb-6">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A futuristic cityscape at sunset"
          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white font-bold rounded-lg px-6 py-2 disabled:bg-indigo-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors flex items-center"
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? <Spinner /> : 'Generate'}
        </button>
      </form>

      {error && <p className="text-red-400 bg-red-900/50 py-2 px-4 rounded-md">{error}</p>}
      
      <div className="w-full max-w-lg h-96 bg-gray-700/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 mt-4 overflow-hidden">
        {isLoading && (
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-400">Generating your masterpiece...</p>
          </div>
        )}
        {!isLoading && imageUrl && (
          <img src={imageUrl} alt={prompt} className="object-contain w-full h-full" />
        )}
        {!isLoading && !imageUrl && (
            <div className="text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2">Your generated image will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
