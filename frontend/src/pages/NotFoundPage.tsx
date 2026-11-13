import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Layers, Calendar, HelpCircle } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-24 text-center">
      <div className="max-w-md mx-auto">
        <span className="text-6xl sm:text-7xl font-extrabold font-mono text-[#315F69] dark:text-[#49E3D6] block mb-2">
          404
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#17252B] dark:text-[#F3FBFC] mb-3 font-serif-editorial">
          Financial Coordinate Not Found
        </h1>
        <p className="text-xs sm:text-sm text-[#526168] dark:text-[#A8C0C6] leading-relaxed mb-8">
          The page or service documentation you requested does not exist or has been relocated to another section of the catalog.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#17383F] dark:bg-[#49E3D6] text-white dark:text-[#03181E] hover:scale-105 transition-all shadow-md"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </button>

          <button
            onClick={() => navigate('/services')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/10 text-[#17252B] dark:text-[#F3FBFC] hover:bg-black/10 dark:hover:bg-white/15 transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Browse Services</span>
          </button>
        </div>
      </div>
    </div>
  );
}
