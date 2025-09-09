import React, { memo } from 'react';
import type { GeneratedImage } from '../types';

interface HistoryGridProps {
  history: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
}

const HistoryGrid: React.FC<HistoryGridProps> = ({ history, onSelect }) => {
  return (
    <>
      {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-96 bg-glass-bg border border-glass-border rounded-2xl p-4">
              <p className="text-lg font-semibold text-brand-text">Your creations will appear here</p>
              <p className="mt-2 text-brand-text-secondary">Start by entering a prompt in the create view to generate your first thumbnail.</p>
          </div>
      ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.map((image) => (
                  <div 
                      key={image.id} 
                      className="group relative cursor-pointer overflow-hidden rounded-lg aspect-video border-2 border-glass-border hover:border-brand-accent focus-within:border-brand-accent hover:shadow-glow focus-within:shadow-glow transition-all duration-300"
                      onClick={() => onSelect(image)}
                      onKeyPress={(e) => e.key === 'Enter' && onSelect(image)}
                      tabIndex={0}
                      aria-label={`Select thumbnail with prompt: ${image.prompt}`}
                  >
                      <img 
                          src={image.src} 
                          alt={image.prompt} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="font-bold text-sm line-clamp-2" title={image.prompt}>
                              {image.prompt}
                          </p>
                      </div>
                  </div>
              ))}
          </div>
      )}
    </>
  );
};

export default memo(HistoryGrid)