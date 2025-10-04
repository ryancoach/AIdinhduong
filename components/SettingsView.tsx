import React, { useState, useEffect } from 'react';
import { type Settings } from '../types';

interface SettingsViewProps {
  currentSettings: Settings;
  onSave: (newSettings: Settings) => void;
  onReset: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ currentSettings, onSave, onReset }) => {
  const [settings, setSettings] = useState<Settings>(currentSettings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: ['historyLimit', 'dailyCalorieGoal'].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };
  
  const handleReset = () => {
      onReset();
      // After resetting, we should probably reflect that in the local state too
      // However, the parent component will pass down new props, so useEffect will handle it.
  }

  return (
    <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6">Cài Đặt</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Daily Calorie Goal Setting */}
                <div>
                    <label htmlFor="dailyCalorieGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mục tiêu Calo Hàng Ngày
                    </label>
                    <input
                        type="number"
                        id="dailyCalorieGoal"
                        name="dailyCalorieGoal"
                        min="1000"
                        max="10000"
                        step="50"
                        value={settings.dailyCalorieGoal}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Đặt mục tiêu lượng calo bạn muốn tiêu thụ mỗi ngày.</p>
                </div>

                {/* Nutrient Unit Setting */}
                <div>
                    <label htmlFor="nutrientUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Đơn Vị Dinh Dưỡng
                    </label>
                    <select
                        id="nutrientUnit"
                        name="nutrientUnit"
                        value={settings.nutrientUnit}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="g">Grams (g)</option>
                        <option value="mg">Milligrams (mg)</option>
                    </select>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Chọn đơn vị hiển thị cho các chất dinh dưỡng đa lượng.</p>
                </div>

                {/* History Limit Setting */}
                <div>
                    <label htmlFor="historyLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Giới Hạn Lịch Sử
                    </label>
                    <input
                        type="number"
                        id="historyLimit"
                        name="historyLimit"
                        min="10"
                        max="100"
                        step="5"
                        value={settings.historyLimit}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Số lượng mục tối đa được lưu trong lịch sử (từ 10 đến 100).</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                     <button
                        type="submit"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-transform transform hover:scale-105 disabled:opacity-75"
                        disabled={saveStatus === 'saved'}
                     >
                        {saveStatus === 'saved' ? 'Đã Lưu!' : 'Lưu Thay Đổi'}
                     </button>
                     <button
                        type="button"
                        onClick={handleReset}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                     >
                        Đặt Lại Mặc Định
                     </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default SettingsView;