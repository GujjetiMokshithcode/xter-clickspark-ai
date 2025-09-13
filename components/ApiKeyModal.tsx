import React, { useState, memo } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groqApiKey: string, hfToken: string) => void;
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
  const [groqApiKey, setGroqApiKey] = useState('');
  const [hfToken, setHfToken] = useState('');

  // Update local state when currentApiKey changes
  React.useEffect(() => {
    // For backward compatibility, treat currentApiKey as Groq key
    setGroqApiKey(currentApiKey);
    // Try to load HF token from localStorage
    const storedHfToken = localStorage.getItem('hfApiToken') || '';
    setHfToken(storedHfToken);
  }, [currentApiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (groqApiKey.trim() && hfToken.trim()) {
      onSave(groqApiKey.trim(), hfToken.trim());
    } else if (!groqApiKey.trim() && !hfToken.trim()) {
      // Remove both keys
      onSave('', '');
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
              {isEditing ? 'Edit API Keys' : 'Unlock Unlimited Generations'}
            </h2>
            <p className="mt-4 text-brand-text-secondary max-w-md mx-auto">
              {isEditing 
                ? 'Update your API keys below. Your keys are stored securely in your browser.'
                : "You've used your 5 free trial credits. To continue creating, please provide your own API keys. Both services offer free tiers!"
              }
            </p>

             {!isEditing && (
               <div className="text-left mt-6 space-y-4 text-brand-text-secondary text-sm">
                <h3 className="font-semibold text-white">Setup Instructions:</h3>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-accent/20 text-brand-accent font-bold">1</div>
                  <p>Get a <strong>Groq API key</strong> from <a href="https://console.groq.com/keys" target=\"_blank" rel="noopener noreferrer\" className="font-semibold text-brand-accent-hover hover:underline">Groq Console</a> (free tier available)</p>
                </div>
                 <div className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-accent/20 text-brand-accent font-bold">2</div>
                  <p>Get a <strong>Hugging Face token</strong> from <a href="https://huggingface.co/settings/tokens" target=\"_blank" rel="noopener noreferrer\" className="font-semibold text-brand-accent-hover hover:underline">HF Settings</a> (completely free)</p>
                </div>
                 <div className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-accent/20 text-brand-accent font-bold">3</div>
                  <p>Paste both keys below. They'll be saved securely in your browser.</p>
                </div>
               </div>
             )}

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">
                  Groq API Key (for prompt enhancement & analysis)
                </label>
                <input
                  type={isEditing ? "text" : "password"}
                  value={groqApiKey}
                  onChange={(e) => setGroqApiKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full bg-white/5 border border-glass-border text-brand-text rounded-lg px-4 py-3 focus:outline-none focus:border-brand-accent focus:shadow-glow transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">
                  Hugging Face Token (for image generation)
                </label>
              <input
                  type={isEditing ? "text" : "password"}
                  value={hfToken}
                  onChange={(e) => setHfToken(e.target.value)}
                  placeholder="hf_..."
                className="w-full bg-white/5 border border-glass-border text-brand-text rounded-lg px-4 py-3 focus:outline-none focus:border-brand-accent focus:shadow-glow transition-all"
              />
              </div>
            </div>
             <p className="mt-3 text-xs text-brand-text-secondary">
              Your keys are stored only in your browser's local storage and are never sent to our servers.
            </p>
            <div className="mt-8">
               <button
                onClick={handleSave}
                disabled={(!groqApiKey.trim() || !hfToken.trim()) && (groqApiKey.trim() || hfToken.trim())}
                className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-brand-text-secondary disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 shadow-glow hover:shadow-glow-lg disabled:shadow-none"
              >
                {isEditing ? 'Update API Keys' : 'Save & Continue'}
              </button>
             {isEditing && (
               <button
                 type="button"
                 onClick={() => {
                   if (confirm('Are you sure you want to remove your API keys? You will go back to using free credits.')) {
                     onSave('', '');
                   }
                 }}
                 className="w-full mt-3 bg-red-500/20 border border-red-500/50 text-red-400 font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:bg-red-500/30 hover:border-red-500/70"
               >
                 Remove API Keys
               </button>
             )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ApiKeyModal);