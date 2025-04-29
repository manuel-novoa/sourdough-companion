import React from 'react';
import { TimelineEntry } from '../types';
import { formatDateTime, formatTimeDiff, calculateTimeDiff, createLocalDate } from '../utils/calculations';

interface TimelineProps {
  entries: TimelineEntry[];
  onAdd: () => void;
  onRemove: (id: number) => void;
  onUpdate: (entry: TimelineEntry) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ entries, onAdd, onRemove, onUpdate }) => {
  const handleAddEntry = () => {
    const newEntry: TimelineEntry = {
      id: Date.now(),
      timestamp: createLocalDate(),
      timeDiff: 0,
      action: '',
    };

    // Calculate time difference from previous entry
    if (entries.length > 0) {
      const previousEntry = entries[entries.length - 1];
      newEntry.timeDiff = calculateTimeDiff(newEntry.timestamp, previousEntry.timestamp);
    }

    onAdd();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-xl font-semibold text-bread-800 mb-6 flex items-center gap-3">
        <i className="ph-thin ph-book-open text-2xl text-bread-800"></i>
        Baker's Journal
      </h3>
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg"
          >
            {/* Delete Button Container - Right aligned when in its own row */}
            <div className="flex justify-end sm:hidden">
              <button
                onClick={() => onRemove(entry.id)}
                className="p-2 text-bread-800 hover:text-bread-600 rounded-lg transition-all flex-shrink-0"
                title="Remove entry"
              >
                <i className="ph-thin ph-x"></i>
              </button>
            </div>

            {/* Main Content Area - Flex column on small screens, row on larger screens */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Action Row - Contains delete button and textarea */}
              <div className="flex flex-row gap-4 flex-grow min-w-0">
                {/* Delete Button - Only visible on larger screens */}
                <button
                  onClick={() => onRemove(entry.id)}
                  className="hidden sm:block p-2 text-bread-800 hover:text-bread-600 rounded-lg transition-all flex-shrink-0"
                  title="Remove entry"
                >
                  <i className="ph-thin ph-x"></i>
                </button>

                {/* Action Text Area - Takes remaining width */}
                <div className="flex-grow min-w-0">
                  <div className="relative">
                    <i className="ph-thin ph-pencil absolute left-3 top-3 text-gray-400"></i>
                    <textarea
                      placeholder="What did you do?"
                      value={entry.action}
                      rows={2}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all resize-none"
                      onChange={e => onUpdate({ ...entry, action: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Timestamp Display - Full width on small screens, auto width on large */}
              <div className="flex-shrink-0 text-sm text-bread-800">
                <div className="font-medium flex items-center gap-2">
                  <i className="ph-thin ph-clock text-bread-600"></i>
                  {formatDateTime(entry.timestamp)}
                </div>
                {index > 0 && entry.timeDiff > 0 && (
                  <div className="text-bread-600 mt-1 ml-6">
                    {formatTimeDiff(entry.timeDiff)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddEntry}
        className="mt-6 px-6 py-2 text-bread-800 rounded-lg hover:text-bread-600 transition-all flex items-center gap-2"
      >
        <i className="ph-thin ph-plus"></i>
        Add Entry
      </button>
    </div>
  );
};