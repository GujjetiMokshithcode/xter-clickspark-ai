import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TitleInputForm from './components/TitleInputForm';
import ThumbnailDisplay from './components/ThumbnailDisplay';
import HistoryGrid from './components/HistoryGrid';
import ApiKeyModal from './components/ApiKeyModal';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import { generateThumbnail } from './services/geminiService';
import type { GeneratedImage, ReferenceImage } from './types';

const MAX_FREE_CREDITS = 5;

// Utility to read file as Base64
const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const data = result.split(',')[1];
      resolve({ data, mimeType: file.type });
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

const App: React.FC = () => {
  // Page state
  type Page = 'main' | 'privacy' | 'terms';
  const [currentPage, setCurrentPage] = useState<Page>('main');
  
  // State for view navigation
  const [activeView, setActiveView] = useState<'create' | 'history'>('create');

  // Generation state
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('Default');
  const [selectedModel, setSelectedModel] = useState('imagen-3.0-generate-001'); // Start with older model as fallback
  const [optimizeCtr, setOptimizeCtr] = useState(true);
  const [referenceImage, setReferenceImage] = useState<ReferenceImage | null>(null);

  // User & history state
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [credits, setCredits] = useState(MAX_FREE_CREDITS);
  const [userApiKey, setUserApiKey] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isEditingApiKey, setIsEditingApiKey] = useState(false);

  // Load initial state from localStorage
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('thumbnailHistory');
      if (storedHistory) setHistory(JSON.parse(storedHistory));

      const storedKey = localStorage.getItem('userApiKey');
      if (storedKey) setUserApiKey(storedKey);

      const storedCredits = localStorage.getItem('thumbnailCredits');
      if (storedCredits !== null) {
        setCredits(parseInt(storedCredits, 10));
      } else {
        localStorage.setItem('thumbnailCredits', String(MAX_FREE_CREDITS));
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
  }, []);

  // Cursor glow effect
  useEffect(() => {
    const glow = document.querySelector('.cursor-glow');
    if (!glow) return;
    const handleMouseMove = (e: MouseEvent) => {
      glow.setAttribute('style', `transform: translate(${e.clientX - 300}px, ${e.clientY - 300}px)`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const hasUserApiKey = !!userApiKey;
  const isOutOfCredits = !hasUserApiKey && credits <= 0;

  const handleGenerate = useCallback(async () => {
    if (!title.trim() || isOutOfCredits) return;

    setIsLoading(true);
    setGeneratedImage(null);
    setError(null);

    try {
      const src = await generateThumbnail({
        title,
        style,
        optimizeCtr,
        referenceImage,
        userApiKey,
        selectedModel
      });

      const newImage: GeneratedImage = {
        id: new Date().toISOString(),
        prompt: title,
        src,
        createdAt: Date.now(),
      };

      setGeneratedImage(newImage);

      const updatedHistory = [newImage, ...history].slice(0, 20); // Keep last 20
      setHistory(updatedHistory);
      localStorage.setItem('thumbnailHistory', JSON.stringify(updatedHistory));

      if (!hasUserApiKey) {
        const newCredits = credits - 1;
        setCredits(newCredits);
        localStorage.setItem('thumbnailCredits', String(newCredits));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [title, style, selectedModel, optimizeCtr, referenceImage, userApiKey, isOutOfCredits, credits, hasUserApiKey, history]);

  const handleReferenceImageChange = async (file: File | null) => {
    if (file) {
      try {
        const { data, mimeType } = await fileToBase64(file);
        setReferenceImage({ name: file.name, data, mimeType });
      } catch (e) {
        console.error("Error reading file:", e);
        setError("Could not read the selected image file.");
      }
    } else {
      setReferenceImage(null);
    }
  };
  
  const handleSaveApiKey = (apiKey: string) => {
    if (apiKey.trim()) {
      setUserApiKey(apiKey);
      localStorage.setItem('userApiKey', apiKey);
    } else {
      // Remove API key
      setUserApiKey(null);
      localStorage.removeItem('userApiKey');
      // Reset credits when removing API key
      setCredits(MAX_FREE_CREDITS);
      localStorage.setItem('thumbnailCredits', String(MAX_FREE_CREDITS));
    }
    setIsApiKeyModalOpen(false);
    setIsEditingApiKey(false);
  };

  const handleViewToggle = () => {
    setActiveView(prev => (prev === 'history' ? 'create' : 'history'));
  };

  const handleSelectFromHistory = (image: GeneratedImage) => {
    setTitle(image.prompt);
    setGeneratedImage(image);
    setCurrentPage('main');
    // Switch back to the create view to see the selected item
    setActiveView('create');
  };
  
  const handleNavigate = (page: 'privacy' | 'terms') => {
      setCurrentPage(page);
  };
  
  const isStaticPage = currentPage === 'privacy' || currentPage === 'terms';

  return (
    <div className="min-h-screen flex flex-col antialiased">
      <Header 
        onViewToggle={handleViewToggle}
        activeView={activeView}
        credits={credits}
        hasUserApiKey={hasUserApiKey}
        onEnterApiKey={() => setIsApiKeyModalOpen(true)}
        currentPage={currentPage}
        onBackToMain={() => setCurrentPage('main')}
      />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {isStaticPage ? (
          currentPage === 'privacy' ? <PrivacyPolicy /> : <TermsOfService />
        ) : (
          <>
            {/* --- Main Content (Creation View) --- */}
            <div className={`${activeView === 'history' ? 'hidden' : 'block'}`}>
              <div className="animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                  <section className="text-center mb-12">
                      <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tighter text-white">
                          Spark stunning, <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-accent-hover to-brand-accent">click-worthy</span> thumbnails in seconds.
                      </h1>
                      <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto">
                          We give you 5 free credits to try it out. Afterward, use your own Google Gemini API key for unlimited generation.
                      </p>
                  </section>
                  <div className="max-w-4xl mx-auto">
                    <section className="space-y-6">
                        <TitleInputForm 
                          title={title}
                          setTitle={setTitle}
                          style={style}
                          setStyle={setStyle}
                          selectedModel={selectedModel}
                          setSelectedModel={setSelectedModel}
                          optimizeCtr={optimizeCtr}
                          setOptimizeCtr={setOptimizeCtr}
                          referenceImage={referenceImage}
                          onReferenceImageChange={handleReferenceImageChange}
                          onSubmit={handleGenerate}
                          isLoading={isLoading}
                          isOutOfCredits={isOutOfCredits}
                          onEnterApiKey={() => setIsApiKeyModalOpen(true)}
                        />
                        {error && <p className="text-center text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-500/50">{error}</p>}
                        <ThumbnailDisplay image={generatedImage} isLoading={isLoading} error={error} />
                    </section>
                  </div>
              </div>
            </div>

            {/* --- History View --- */}
            <div className={`${activeView === 'create' ? 'hidden' : 'block'}`}>
              <div className="animate-fadeIn">
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-6">
                    Generation History
                </h2>
                <HistoryGrid history={history} onSelect={handleSelectFromHistory} />
              </div>
            </div>
          </>
        )}
      </main>
      <Footer onNavigate={handleNavigate} />
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleSaveApiKey}
        currentApiKey={userApiKey || ''}
        isEditing={isEditingApiKey}
      />
    </div>
  );
};

export default App;