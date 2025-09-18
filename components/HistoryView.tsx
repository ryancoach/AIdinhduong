import React from 'react';
import { type AnalysisHistoryItem } from '../types';
import HistoryItemCard from './HistoryItemCard';

interface HistoryViewProps {
  history: AnalysisHistoryItem[];
  onViewDetails: (item: AnalysisHistoryItem) => void;
  onClearHistory: () => void;
  onShare: (item: AnalysisHistoryItem) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onViewDetails, onClearHistory, onShare }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="mt-4 text-2xl font-bold">Lịch sử trống</h2>
        <p className="text-gray-500 dark:text-gray-400">Chưa có phân tích nào được lưu lại.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">Lịch Sử Phân Tích</h2>
        <button
          onClick={onClearHistory}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm"
        >
          Xóa Lịch Sử
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {history.map((item) => (
          <HistoryItemCard key={item.id} item={item} onViewDetails={onViewDetails} onShare={onShare} />
        ))}
      </div>
    </div>
  );
};

export default HistoryView;