import React, { useState } from 'react';
import { type AnalysisHistoryItem } from '../types';

interface ShareModalProps {
  item: AnalysisHistoryItem;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ item, onClose }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  
  const generateShareText = () => {
    let text = `📊 Phân Tích Dinh Dưỡng Bữa Ăn:\n\n`;
    item.analysisResult.forEach(food => {
      text += `--- ${food.name} ---\n`;
      text += `🔥 Calo: ${food.calories} kcal\n`;
      text += `💪 Protein: ${food.macros.protein}\n`;
      text += `🍞 Carb: ${food.macros.carbohydrates}\n`;
      text += `🥑 Chất béo: ${food.macros.fat}\n`;
      text += `📝 Ghi chú: ${food.description}\n\n`;
    });
    const totalCalories = item.analysisResult.reduce((sum, food) => sum + food.calories, 0);
    text += `Tổng cộng: ~${totalCalories} calo.\n\n`;
    text += `----------\n`;
    text += `Ứng dụng của Ryan Coach và sachfitnessviet.shop sản xuất.`;
    return text;
  };

  const handleCopyToClipboard = async () => {
    const textToCopy = generateShareText();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Không thể sao chép vào clipboard.');
    }
  };

  const primaryFoodName = item.analysisResult.length > 0 ? item.analysisResult[0].name : 'Phân tích';
  const totalCalories = item.analysisResult.reduce((sum, food) => sum + food.calories, 0);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="p-6 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Đóng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Chia sẻ kết quả</h2>
          
          <div className="space-y-4">
            <img src={item.imagePreview} alt={primaryFoodName} className="w-full h-auto max-h-64 object-contain rounded-md" />
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{primaryFoodName}</h3>
                <p className="text-teal-500 font-bold">{totalCalories} Calories</p>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {item.analysisResult.map((food, index) => (
                        <div key={index} className="mb-1">
                            <strong>{food.name}: </strong> 
                            {food.calories} kcal
                            (P: {food.macros.protein}, C: {food.macros.carbohydrates}, F: {food.macros.fat})
                        </div>
                    ))}
                </div>
            </div>

            <button
              onClick={handleCopyToClipboard}
              className="w-full flex justify-center items-center px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-sm transition-colors disabled:bg-gray-400"
              disabled={copyStatus === 'copied'}
            >
              {copyStatus === 'copied' ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Đã sao chép!
                </>
              ) : (
                <>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-6 4h.01M9 16h.01" />
                   </svg>
                  Sao chép vào Clipboard
                </>
              )}
            </button>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">Bạn có thể dán văn bản này vào bất kỳ ứng dụng nào.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;