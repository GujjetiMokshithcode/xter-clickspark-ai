import React, { useState, memo } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentApiKey?: string;
  isEditing?: boolean;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentApiKey = '', 
  isEditing = false 
}) => {
  const [apiKey, setApiKey] = useState(currentApiKey);

  // Update local state when currentApiKey changes
  React.useEffect(() => {
    setApiKey(currentApiKey);
  }, [currentApiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-brand-bg/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-modalFadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-glass-bg backdrop-blur-2xl border border-glass-border rounded-2xl w-full max-w-lg p-8 relative animate-modalContentShow text-center"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-brand-text-secondary hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="py-8">
            <h2 className="text-3xl font-black text-white">
              {isEditing ? 'Edit API Key' : 'Unlock Unlimited Generations'}
            </h2>
            <p className="mt-4 text-brand-text-secondary max-w-md mx-auto">
              {isEditing 
                ? 'Update your Google Gemini API key below. Your key is stored securely in your browser.'
                : "You've used your 5 free trial credits. To continue creating, please provide your own Google Gemini API key. Google's API has a free tier, but usage beyond that is subject to their standard pricing."
              }
            </p>

             {!isEditing && (
               <div className="text-left mt-6 space-y-4 text-brand-text-secondary text-sm">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-accent/20 text-brand-accent font-bold">1</div>
                  <p>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-accent-hover hover:underline">Google AI Studio</a> and click "Create API key".</p>
                </div>
                 <div className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-accent/20 text-brand-accent font-bold">2</div>
                  <p>Copy your new API key.</p>
                </div>
                 <div className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-accent/20 text-brand-accent font-bold">3</div>
                  <p>Paste the key in the field below. It will be saved securely in your browser.</p>
                </div>
               </div>
             )}

            <div className="mt-6">
              <input
                type={isEditing ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={isEditing ? "Update your API key" : "Enter your API key here"}
                className="w-full bg-white/5 border border-glass-border text-brand-text rounded-lg px-4 py-3 focus:outline-none focus:border-brand-accent focus:shadow-glow transition-all"
                aria-label="Gemini API Key"
              />
            </div>
             <p className="mt-3 text-xs text-brand-text-secondary">
              Your key is stored only in your browser's local storage and is never sent to our servers.
            </p>
            <div className="mt-8">
               <button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-brand-text-secondary disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 shadow-glow hover:shadow-glow-lg disabled:shadow-none"
              >
                {isEditing ? 'Update API Key' : 'Save & Continue'}
              </button>
             {isEditing && (
               <button
                 type="button"
                 onClick={() => {
                   if (confirm('Are you sure you want to remove your API key? You will go back to using free credits.')) {
                     onSave('');
                   }
                 }}
                 className="w-full mt-3 bg-red-500/20 border border-red-500/50 text-red-400 font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:bg-red-500/30 hover:border-red-500/70"
               >
                 Remove API Key
               </button>
             )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ApiKeyModal);