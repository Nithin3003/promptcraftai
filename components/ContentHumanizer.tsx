import React, { useState } from 'react';
import { humanizeText } from '../services/geminiService';
import Spinner from './Spinner';

const TONES = ['Friendly', 'Professional', 'Casual', 'Enthusiastic', 'Formal'];

const ContentHumanizer: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [humanizedText, setHumanizedText] = useState('');
    const [selectedTone, setSelectedTone] = useState(TONES[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleHumanize = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || isLoading) return;

        setIsLoading(true);
        setError('');
        setHumanizedText('');

        try {
            const result = await humanizeText(inputText, selectedTone);
            setHumanizedText(result);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred while humanizing the text.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                Content Humanizer
            </h2>
            <p className="text-gray-400 mb-6 text-center">
                Make your text sound more natural and less robotic.
            </p>

            <form onSubmit={handleHumanize} className="w-full max-w-2xl flex flex-col gap-4">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text to humanize..."
                    className="w-full h-36 bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white resize-none"
                    disabled={isLoading}
                />
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <select
                            value={selectedTone}
                            onChange={(e) => setSelectedTone(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                            disabled={isLoading}
                        >
                            {TONES.map(tone => (
                                <option key={tone} value={tone}>{tone}</option>
                            ))}
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white font-bold rounded-lg px-6 py-2 disabled:bg-indigo-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors flex items-center justify-center min-w-[120px]"
                        disabled={isLoading || !inputText.trim()}
                    >
                        {isLoading ? <Spinner /> : 'Humanize'}
                    </button>
                </div>
            </form>

            {error && <p className="mt-4 text-red-400 bg-red-900/50 py-2 px-4 rounded-md">{error}</p>}

            {(isLoading || humanizedText) && (
                 <div className="w-full max-w-2xl mt-6">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Result:</h3>
                    <div className="w-full min-h-[144px] bg-gray-700/50 rounded-lg p-4 border border-gray-600 text-gray-200">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <Spinner size="md" />
                            </div>
                        ) : (
                            <p className="whitespace-pre-wrap">{humanizedText}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentHumanizer;
