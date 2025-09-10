import React, { memo } from 'react';

interface HeaderProps {
  onViewToggle: () => void;
  activeView: 'create' | 'history';
  credits: number;
  hasUserApiKey: boolean;
  onEnterApiKey: () => void;
  onEditApiKey: () => void;
  currentPage: 'main' | 'history' | 'privacy' | 'terms';
  onBackToMain: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onViewToggle, 
  activeView,
  credits, 
  hasUserApiKey, 
  onEnterApiKey,
  onEditApiKey,
  currentPage,
  onBackToMain,
}) => {
  const isMainPage = currentPage === 'main' || currentPage === 'history';

  return (
    <header className="sticky top-0 z-50 h-28 flex items-center px-4">
      <div className="container mx-auto relative z-0 bg-glass-bg backdrop-blur-lg flex items-center justify-between p-4 header-glow rounded-4xl border border-glass-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {/* Icon: a stylized 'play' button merged with a sparkle/crafting element */}
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-accent">
                <path d="M15.58 11.5L9.62998 8.02002C9.20998 7.76002 8.66998 8.10002 8.66998 8.55002V15.45C8.66998 15.9 9.20998 16.24 9.62998 15.98L15.58 12.5C15.95 12.28 15.95 11.72 15.58 11.5Z" fill="currentColor"/>
                <path d="M4.19995 18.2C5.35995 19.36 6.89995 20.17 8.59995 20.51L9.62995 15.98C8.94995 15.82 8.31995 15.52 7.79995 15.1L4.19995 18.2Z" fill="currentColor"/>
                <path d="M19.8 5.80005C18.64 4.64005 17.1 3.83005 15.4 3.49005L14.37 8.02005C15.05 8.18005 15.68 8.48005 16.2 8.90005L19.8 5.80005Z" fill="currentColor" opacity="0.4"/>
            </svg>
            <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tighter">
                Click<span className="text-brand-accent">Spark</span>
            </span>
          </div>
          <span className="bg-white/10 border border-glass-border text-brand-accent text-xs font-bold px-2.5 py-1 rounded-full hidden sm:inline-block">
            AI
          </span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          {isMainPage ? (
            <>
              {!hasUserApiKey && (
                <div className="hidden md:flex items-center gap-2 bg-glass-bg border border-glass-border rounded-full p-1.5 pr-4 text-sm shadow-glass-inset">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-brand-accent-hover to-brand-accent shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="font-bold text-white tracking-wider">{credits}</span>
                  <span className="text-brand-text-secondary">Credits</span>
                </div>
              )}
              <button
                onClick={onViewToggle}
                className="flex items-center gap-2 text-sm bg-white/10 border border-glass-border text-brand-text font-medium px-4 py-2.5 rounded-full hover:border-brand-accent hover:text-white transition-colors"
                aria-label={activeView === 'history' ? 'Go back to create' : 'View generation history'}
              >
                {activeView === 'history' ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Create</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>History</span>
                  </>
                )}
              </button>
              {hasUserApiKey ? (
                <button 
                  onClick={onEditApiKey}
                  className="flex items-center gap-2 text-sm bg-white/10 border border-glass-border text-brand-text font-medium px-4 py-2.5 rounded-full hover:border-brand-accent hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit API Key
                </button>
              ) : (
                <button 
                  onClick={onEnterApiKey}
                  className="bg-brand-accent text-white font-bold py-2.5 px-5 rounded-full text-sm hover:bg-brand-accent-hover transition-colors animate-button-pulse"
                >
                  Enter API Key
                </button>
              )}
            </>
          ) : (
             <button 
                onClick={onBackToMain}
                className="flex items-center gap-2 bg-brand-accent text-white font-bold py-2.5 px-5 rounded-full text-sm hover:bg-brand-accent-hover transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to App
              </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default memo(Header);