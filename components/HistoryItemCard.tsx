import React from 'react';
import { type AnalysisHistoryItem } from '../types';

interface HistoryItemCardProps {
  item: AnalysisHistoryItem;
  onViewDetails: (item: AnalysisHistoryItem) => void;
  onShare: (item: AnalysisHistoryItem) => void;
}

const HistoryItemCard: React.FC<HistoryItemCardProps> = ({ item, onViewDetails, onShare }) => {
  const totalCalories = item.analysisResult.reduce((sum, food) => sum + food.calories, 0);
  const primaryFoodName = item.analysisResult.length > 0 ? item.analysisResult[0].name : 'Phân tích';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row transition-transform transform hover:scale-105">
      <img src={item.imagePreview} alt={primaryFoodName} className="w-full sm:w-1/3 h-48 sm:h-auto object-cover" />
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(item.id).toLocaleString()}</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 truncate">{primaryFoodName}</h3>
          <p className="text-teal-500 font-semibold">{totalCalories} Calories</p>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row sm:justify-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <button
              onClick={() => onShare(item)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-semibold rounded-lg shadow-sm transition-colors"
              aria-label="Chia sẻ kết quả"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.367a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Chia sẻ
            </button>
            <button
              onClick={() => onViewDetails(item)}
              className="w-full sm:w-auto px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
              Xem Chi Tiết
            </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryItemCard;