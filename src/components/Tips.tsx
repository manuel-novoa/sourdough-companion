import React, { useState } from 'react';

interface TipsProps {
  tips: string[];
}

export const Tips: React.FC<TipsProps> = ({ tips }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8 no-print">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white rounded-t-lg shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-3">
          <i className="ph-thin ph-lightbulb text-2xl text-bread-800"></i>
          <h2 className="text-xl font-semibold text-bread-800">Pro Tips</h2>
        </div>
        <i
          className={`ph-thin ph-caret-down text-xl text-bread-800 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        ></i>
      </button>
      {isOpen && (
        <div className="bg-white p-6 rounded-b-lg shadow-sm border-t border-gray-100">
          <ul className="space-y-3 text-gray-600 text-sm">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <i className="ph-thin ph-sparkle text-bread-600 flex-shrink-0 mt-0.5"></i>
                <span className="italic">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};