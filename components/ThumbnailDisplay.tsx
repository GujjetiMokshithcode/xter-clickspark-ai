import React, { memo } from 'react';
import type { GeneratedImage } from '../types';

interface ThumbnailDisplayProps {
  image: GeneratedImage | null;
  isLoading: boolean;
  error: string | null;
}

const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const LoadingGrid: React.FC = () => {
    const dots = Array.from({ length: 16 * 9 }); // 16:9 aspect ratio grid
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="w-48 h-auto aspect-video grid grid-cols-16 gap-1.5">
                {dots.map((_, i) => (
                    <div 
                        key={i} 
                        className="bg-brand-accent rounded-full animate-pulseGrid"
                        style={{ animationDelay: `${Math.random() * 2}s` }}
                    />
                ))}
            </div>
            <p className="text-sm text-brand-text-secondary mt-4">Generating your masterpiece...</p>
        </div>
    );
};


const ThumbnailDisplay: React.FC<ThumbnailDisplayProps> = ({ image, isLoading, error }) => {
  
  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image.src;
    const fileName = `thumbnail-${image.prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50)}.jpg`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="w-full relative flex flex-col items-center justify-center bg-glass-bg backdrop-blur-lg p-4 rounded-xl min-h-[250px] aspect-video border border-glass-border overflow-hidden">
      {isLoading && <LoadingGrid />}
      {!isLoading && error && (
        <div className="text-center text-red-400 z-10">
          <p className="font-semibold">Generation Failed</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      {!isLoading && !error && !image && (
        <div className="text-center text-brand-text-secondary z-10">
          <p className="font-semibold">Your generated thumbnail will appear here.</p>
          <p className="text-sm">Enter a prompt and click generate!</p>
        </div>
      )}
      {!isLoading && image && (
        <div className="w-full group relative z-10">
          <img src={image.src} alt={image.prompt} className="w-full h-auto rounded-lg aspect-video object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-lg">
             <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-white text-black font-bold py-2 px-4 rounded-full opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300"
            >
              <DownloadIcon className="w-5 h-5" />
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ThumbnailDisplay)