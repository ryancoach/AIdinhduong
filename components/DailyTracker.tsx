import React from 'react';
import { type DailyIntake } from '../types';

interface DailyTrackerProps {
  dailyIntake: DailyIntake | null;
  dailyCalorieGoal: number;
}

const DailyTracker: React.FC<DailyTrackerProps> = ({ dailyIntake, dailyCalorieGoal }) => {
  if (dailyCalorieGoal <= 0) {
    return (
      <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 rounded-md mb-6 text-center">
        <p>Vui lòng vào tab <strong>Cài Đặt</strong> để thiết lập "Mục tiêu Calo Hàng Ngày" của bạn để bắt đầu theo dõi!</p>
      </div>
    );
  }

  const consumed = dailyIntake?.consumedCalories ?? 0;
  const goal = dailyCalorieGoal;
  const remaining = Math.max(0, goal - consumed);
  const percentage = goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0;
  const overLimit = consumed > goal;
  
  let progressBarColor = 'bg-green-500';
  if (percentage > 75) progressBarColor = 'bg-yellow-500';
  if (overLimit) progressBarColor = 'bg-red-500';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border-t-4 border-blue-500">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">Theo Dõi Dinh Dưỡng Hôm Nay</h2>
      <div className="grid grid-cols-3 gap-4 text-center mb-4">
        <div>
          <p className="text-2xl font-bold text-green-500">{consumed.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Đã Nạp</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{goal.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Mục Tiêu</p>
        </div>
        <div>
           <p className={`text-2xl font-bold ${overLimit ? 'text-red-500' : 'text-blue-500'}`}>{remaining.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Còn Lại</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
        <div
          className={`h-4 rounded-full transition-all duration-500 ${progressBarColor}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={consumed}
          aria-valuemin={0}
          aria-valuemax={goal}
          aria-label={`Đã nạp ${consumed} trên ${goal} calo`}
        ></div>
      </div>
      {overLimit && (
        <p className="text-center text-sm text-red-500 mt-3 font-semibold">
          Bạn đã vượt mục tiêu {Math.abs(remaining).toLocaleString()} calo!
        </p>
      )}
    </div>
  );
};

export default DailyTracker;