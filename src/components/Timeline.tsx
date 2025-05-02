import React, { useState } from 'react';
import { TimelineEntry } from '../types';
import { formatTimeDiff, calculateTimeDiff, createLocalDate } from '../utils/calculations';

interface TimelineProps {
  entries: TimelineEntry[];
  onAdd: () => void;
  onRemove: (id: number) => void;
  onUpdate: (entry: TimelineEntry) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ entries, onAdd, onRemove, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleDateTimeChange = (entry: TimelineEntry, newDateTime: string) => {
    // Convert the input datetime string to a local Date object
    const localDate = new Date(newDateTime);
    const updatedEntry = {
      ...entry,
      timestamp: localDate,
    };

    // Recalculate time differences for this entry and the next entry
    const entryIndex = entries.findIndex(e => e.id === entry.id);
    
    // Calculate time diff from previous entry
    if (entryIndex > 0) {
      const previousEntry = entries[entryIndex - 1];
      updatedEntry.timeDiff = calculateTimeDiff(updatedEntry.timestamp, previousEntry.timestamp);
    }

    // Update the next entry's time diff if it exists
    if (entryIndex < entries.length - 1) {
      const nextEntry = entries[entryIndex + 1];
      const updatedNextEntry = {
        ...nextEntry,
        timeDiff: calculateTimeDiff(nextEntry.timestamp, updatedEntry.timestamp),
      };
      onUpdate(updatedNextEntry);
    }

    onUpdate(updatedEntry);
  };

  // Helper function to format date for datetime-local input
  const formatDateForInput = (date: Date): string => {
    // Get local ISO string
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="mb-8 bg-white rounded-xl shadow-sm">
      {/* Header with toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <i className="ph-thin ph-book-open text-2xl text-bread-800"></i>
          <h2 className="text-lg font-medium text-bread-800">Baker's Journal</h2>
        </div>
        <div className="flex items-center gap-4 text-bread-600">
          <span className="text-sm font-bold">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </span>
          <i className={`ph-thin ph-caret-${isExpanded ? 'up' : 'down'} text-xl transition-transform duration-200`}></i>
        </div>
      </button>

      {/* Collapsible content */}
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6">
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className="flex flex-col gap-4 p-4 bg-bread-50 rounded-lg"
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

                  {/* Timestamp Edit and Time Delta - Full width on small screens, auto width on large */}
                  <div className="flex-shrink-0 text-sm text-bread-800">
                    <div className="font-medium flex items-center gap-2">
                      <i className="ph-thin ph-clock text-bread-600"></i>
                      <input
                        type="datetime-local"
                        value={formatDateForInput(entry.timestamp)}
                        onChange={(e) => handleDateTimeChange(entry, e.target.value)}
                        className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:ring-2 focus:ring-bread-500 focus:border-transparent transition-all"
                      />
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
      </div>
    </div>
  );
};