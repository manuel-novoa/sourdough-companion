import React, { useState } from 'react';

interface TipsProps {
  tips: string[];
}

export const Tips: React.FC<TipsProps> = ({ tips }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8 bg-white rounded-xl shadow-sm no-print">
      {/* Header with toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <i className="ph-thin ph-lightbulb text-2xl text-bread-800"></i>
          <h2 className="text-lg font-medium text-bread-800">Pro Tips</h2>
        </div>
        <i
          className={`ph-thin ph-caret-${isOpen ? 'up' : 'down'} text-xl text-bread-800 transition-transform duration-200`}
        ></i>
      </button>

      {/* Collapsible content */}
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6">
          <ul className="space-y-3 text-gray-600 text-sm">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <i className="ph-thin ph-sparkle text-bread-600 flex-shrink-0 mt-0.5"></i>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};