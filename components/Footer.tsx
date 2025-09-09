import React, { memo } from 'react';

interface FooterProps {
  onNavigate: (page: 'privacy' | 'terms') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full mt-12 mb-6">
      <div className="container mx-auto px-4">
        <div className="bg-glass-bg backdrop-blur-lg border border-glass-border rounded-2xl flex flex-col sm:flex-row items-center justify-between p-4 max-w-4xl mx-auto">
          <p className="text-sm text-brand-text-secondary mb-2 sm:mb-0">
            &copy; {new Date().getFullYear()} ClickSpark AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('terms')} 
              className="text-sm text-brand-text-secondary hover:text-brand-accent transition-colors"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => onNavigate('privacy')}
              className="text-sm text-brand-text-secondary hover:text-brand-accent transition-colors"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);