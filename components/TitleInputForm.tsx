import React, { useRef, memo } from 'react';
import type { ReferenceImage, ModelOption } from '../types';
import { AVAILABLE_MODELS } from '../services/geminiService';

interface TitleInputFormProps {
  title: string;
  setTitle: (title: string) => void;
  style: string;
  setStyle: (style: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  optimizeCtr: boolean;
  setOptimizeCtr: (optimize: boolean) => void;
  referenceImage: ReferenceImage | null;
  onReferenceImageChange: (file: File | null) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isOutOfCredits: boolean;
  onEnterApiKey: () => void;
}

const styles = ['Default', 'Photorealistic', 'Digital Art', 'Cartoon', 'Minimalist', 'Bold & Vibrant'];

const OptionButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
}> = ({ children, onClick, isActive = false, disabled = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
    ${isActive 
      ? 'bg-brand-accent/20 border-brand-accent text-white shadow-glow' 
      : 'bg-white/5 border-glass-border text-brand-text hover:border-brand-accent hover:shadow-glow'
    }
    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:border-glass-border`}
  >
    {children}
  </button>
);


const TitleInputForm: React.FC<TitleInputFormProps> = ({ 
  title, setTitle, 
  style, setStyle,
  selectedModel, setSelectedModel,
  optimizeCtr, setOptimizeCtr,
  referenceImage, onReferenceImageChange,
  onSubmit, isLoading,
  isOutOfCredits, onEnterApiKey
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onReferenceImageChange(file || null);
    if (e.target) {
        e.target.value = '';
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="relative bg-glass-bg backdrop-blur-lg p-4 border border-glass-border rounded-2xl shadow-glass-inset focus-within:shadow-glow-deep transition-all duration-300">
        <textarea
          id="video-title"
          rows={3}
          className="w-full bg-transparent text-brand-text focus:outline-none placeholder-brand-text/60 resize-none"
          placeholder="Enter your prompt here..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              id="style-select"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              disabled={isLoading}
              className="appearance-none bg-white/5 border border-glass-border text-brand-text text-sm font-medium rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-brand-accent focus:shadow-glow focus:ring-0 transition-all"
            >
              {styles.map(s => <option key={s} value={s} className="bg-brand-bg">{s}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-brand-text-secondary">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>

          <div className="relative">
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={isLoading}
              className="appearance-none bg-white/5 border border-glass-border text-brand-text text-sm font-medium rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-brand-accent focus:shadow-glow focus:ring-0 transition-all"
            >
              {AVAILABLE_MODELS.map(model => (
                <option key={model.id} value={model.id} className="bg-brand-bg">
                  {model.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-brand-text-secondary">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>

          <OptionButton onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {referenceImage ? 'Change Image' : 'Add Image'}
          </OptionButton>

          {referenceImage && (
            <div className="flex items-center gap-2 text-xs text-brand-text-secondary bg-white/5 pl-3 rounded-full border border-glass-border">
              <span className="truncate max-w-[120px]">{referenceImage.name}</span>
              <button 
                type="button" 
                onClick={() => onReferenceImageChange(null)}
                className="p-1.5 text-brand-text-secondary hover:text-white hover:bg-red-500/50 rounded-full transition-colors"
                aria-label="Remove reference image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}

          <input
            id="reference-image"
            type="file"
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />

          <div className="flex-grow"></div>

          <OptionButton onClick={() => setOptimizeCtr(!optimizeCtr)} isActive={optimizeCtr} disabled={isLoading}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM15 3a1 1 0 011 1v1.268a2 2 0 010 3.464V16a1 1 0 11-2 0V8.732a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>
            Enhance Prompt
          </OptionButton>
        </div>
        
        {/* Model description */}
        <div className="mt-2 text-xs text-brand-text-secondary">
          {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.description}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !title.trim() || isOutOfCredits}
        className="w-full flex items-center justify-center gap-2 bg-brand-accent text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-brand-text-secondary disabled:text-brand-bg disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 shadow-glow hover:shadow-glow-lg disabled:shadow-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h1a1 1 0 011 1v3.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-1a1 1 0 01-1-1V3.5zM3.5 9a1.5 1.5 0 013 0V10a1 1 0 001 1h1a1 1 0 011 1v3.5a1.5 1.5 0 01-3 0V15a1 1 0 00-1-1h-1a1 1 0 01-1-1V9z"/>
          <path d="M17.5 9a1.5 1.5 0 013 0V10a1 1 0 001 1h1a1 1 0 011 1v3.5a1.5 1.5 0 01-3 0V15a1 1 0 00-1-1h-1a1 1 0 01-1-1V9zM9 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h1a1 1 0 011 1v3.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1H9a1 1 0 01-1-1V3.5z"/>
        </svg>
        {isOutOfCredits ? 'Out of Credits' : isLoading ? 'Generating...' : 'Generate'}
      </button>
      {isOutOfCredits && (
        <p className="text-center text-sm text-brand-text-secondary -mt-2">
          You're out of free generations. 
          <button 
            type="button" 
            onClick={onEnterApiKey} 
            className="text-brand-accent hover:underline font-semibold ml-1 focus:outline-none"
          >
            Enter your API key
          </button>
          {' '}to continue.
        </p>
      )}
    </form>
  );
};

export default memo(TitleInputForm)
