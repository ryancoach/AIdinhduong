import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Spinner from './components/Spinner';
import Alert from './components/Alert';
import NutritionGrid from './components/NutritionGrid';
import Welcome from './components/Welcome';
import Tabs from './components/Tabs';
import HistoryView from './components/HistoryView';
import ShareModal from './components/ShareModal';
import SettingsView from './components/SettingsView';
import DailyTracker from './components/DailyTracker';
import AchievementCalendar from './components/AchievementCalendar';
import QuickAddModal from './components/QuickAddModal';
import { analyzeImageWithGemini } from './services/geminiService';
import { getHistory, saveHistory } from './services/historyService';
import { getSettings, saveSettings, defaultSettings } from './services/settingsService';
import { getDailyIntake, saveDailyIntake } from './services/trackingService';
import { calculateStreak } from './services/streakService';
import { getAchievementHistory, updateAchievement } from './services/achievementService';
import { allowedEmails } from './allowedEmails';
import { type FoodNutrition, type AnalysisHistoryItem, type Settings, type DailyIntake, type StreakData, type AchievementHistory } from './types';

const App: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FoodNutrition[] | null>(null);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [activeView, setActiveView] = useState<'analyzer' | 'history' | 'achievements' | 'settings'>('analyzer');
  const [shareItem, setShareItem] = useState<AnalysisHistoryItem | null>(null);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [dailyIntake, setDailyIntake] = useState<DailyIntake | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [achievementHistory, setAchievementHistory] = useState<AchievementHistory>({});
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);


  useEffect(() => {
    const loggedInUser = localStorage.getItem('userEmail');
    if (loggedInUser && allowedEmails.includes(loggedInUser.toLowerCase())) {
      const loadedSettings = getSettings();
      const loadedAchievements = getAchievementHistory(loggedInUser);
      setSettings(loadedSettings);
      setUserEmail(loggedInUser);
      setHistory(getHistory());
      setDailyIntake(getDailyIntake(loggedInUser));
      setAchievementHistory(loadedAchievements);
      setStreak(calculateStreak(loadedAchievements));
    }
  }, []);
  
  const handleLogin = (email: string): boolean => {
    const normalizedEmail = email.toLowerCase().trim();
    if (allowedEmails.includes(normalizedEmail)) {
      localStorage.setItem('userEmail', normalizedEmail);
      const loadedAchievements = getAchievementHistory(normalizedEmail);
      setUserEmail(normalizedEmail);
      setHistory(getHistory());
      setDailyIntake(getDailyIntake(normalizedEmail));
      setSettings(getSettings());
      setAchievementHistory(loadedAchievements);
      setStreak(calculateStreak(loadedAchievements));
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setUserEmail(null);
    setHistory([]);
    setDailyIntake(null);
    setStreak(null);
    setAchievementHistory({});
    setImageFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
    setActiveView('analyzer');
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        } else {
          reject(new Error('Failed to read file as base64 string'));
        }
      };
      reader.onerror = (error) => reject(error);
    });

  const handleImageChange = (file: File) => {
    setImageFile(file);
    setAnalysisResult(null);
    setError(null);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyzeClick = async () => {
    if (!imageFile || !imagePreview) {
      setError("Vui lòng chọn một hình ảnh để phân tích.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      const base64Image = await toBase64(imageFile);
      const result = await analyzeImageWithGemini(base64Image, imageFile.type);
      
      setAnalysisResult(result);
      
      if (result.length > 0) {
          const newHistoryItem: AnalysisHistoryItem = {
              id: Date.now(),
              imagePreview: imagePreview,
              analysisResult: result
          };
          const updatedHistory = [newHistoryItem, ...history];
          setHistory(updatedHistory);
          saveHistory(updatedHistory, settings.historyLimit);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAnalysisResult = (updatedItem: FoodNutrition, index: number) => {
    if (!analysisResult) return;
    const newAnalysisResult = [...analysisResult];
    newAnalysisResult[index] = updatedItem;
    setAnalysisResult(newAnalysisResult);
  };

  const handleQuickAddSave = (newItem: FoodNutrition) => {
    setAnalysisResult(prev => [...(prev || []), newItem]);
    // Không cần preview ảnh cho món thêm nhanh
    setImagePreview('quickadd');
  };

  const handleLogMeal = () => {
    if (!analysisResult || !userEmail) return;

    const totalCalories = analysisResult.reduce((sum, item) => sum + item.calories, 0);
    const currentIntake = getDailyIntake(userEmail); // Get the latest
    
    const updatedIntake: DailyIntake = {
      ...currentIntake,
      consumedCalories: currentIntake.consumedCalories + totalCalories,
    };
    
    saveDailyIntake(userEmail, updatedIntake);
    setDailyIntake(updatedIntake);

    // Update achievement history
    const updatedAchievements = updateAchievement(userEmail, updatedIntake.consumedCalories, settings.dailyCalorieGoal);
    setAchievementHistory(updatedAchievements);

    // Recalculate streak based on new history
    const newStreak = calculateStreak(updatedAchievements);
    setStreak(newStreak);
    
    // Clear analysis to prevent double logging
    setAnalysisResult(null);
    handleRemoveImage();
  };

  const handleClearHistory = () => {
    setHistory([]);
    saveHistory([], settings.historyLimit);
  };

  const handleViewDetails = (item: AnalysisHistoryItem) => {
    setActiveView('analyzer');
    setAnalysisResult(item.analysisResult);
    setImagePreview(item.imagePreview);
    setImageFile(null);
    setError(null);
  };

  const handleShare = (item: AnalysisHistoryItem) => {
    setShareItem(item);
  };
  
  const handleSaveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    // Trim history if the limit is reduced
    const currentHistory = getHistory();
    if (currentHistory.length > newSettings.historyLimit) {
      const trimmedHistory = currentHistory.slice(0, newSettings.historyLimit);
      setHistory(trimmedHistory);
      saveHistory(trimmedHistory, newSettings.historyLimit);
    }
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
    const currentHistory = getHistory();
    if (currentHistory.length > defaultSettings.historyLimit) {
      const trimmedHistory = currentHistory.slice(0, defaultSettings.historyLimit);
      setHistory(trimmedHistory);
      saveHistory(trimmedHistory, defaultSettings.historyLimit);
    }
  };

  if (!userEmail) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl">
        <Header userEmail={userEmail} onLogout={handleLogout} streak={streak} />
        <main className="mt-8">
          <Tabs activeView={activeView} setActiveView={setActiveView} historyCount={history.length} />
          
          {activeView === 'analyzer' && (
            <div className="space-y-6">
              <DailyTracker dailyIntake={dailyIntake} dailyCalorieGoal={settings.dailyCalorieGoal} />

              <ImageUploader 
                imagePreview={imagePreview === 'quickadd' ? null : imagePreview} 
                onImageChange={handleImageChange} 
                onRemoveImage={handleRemoveImage} 
              />
              
              {!analysisResult && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {imagePreview && imagePreview !== 'quickadd' && (
                     <button 
                        onClick={handleAnalyzeClick} 
                        disabled={isLoading}
                        className="px-8 py-3 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105"
                      >
                        {isLoading ? 'Đang Phân Tích...' : 'Phân Tích Hình Ảnh'}
                      </button>
                  )}
                  <button
                    onClick={() => setIsQuickAddModalOpen(true)}
                    className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-600 transition-all disabled:bg-gray-400 transform hover:scale-105"
                  >
                    Thêm Nhanh Món Ăn
                  </button>
                </div>
              )}
              
              {isLoading && <Spinner />}
              {error && <Alert message={error} />}
              
              {analysisResult && (
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={handleLogMeal}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Thêm vào Nhật Ký
                    </button>
                    {imagePreview && imagePreview !== 'quickadd' && (
                      <button
                        onClick={() => handleShare({
                          id: Date.now(),
                          analysisResult: analysisResult,
                          imagePreview: imagePreview,
                        })}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.367a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        Chia Sẻ Kết Quả
                      </button>
                    )}
                  </div>
              )}

              {analysisResult ? (
                <NutritionGrid 
                    data={analysisResult} 
                    nutrientUnit={settings.nutrientUnit}
                    onUpdateAnalysis={handleUpdateAnalysisResult}
                />
              ) : (
                !isLoading && !imagePreview && <Welcome />
              )}
            </div>
          )}

          {activeView === 'history' && (
            <HistoryView 
              history={history} 
              onClearHistory={handleClearHistory} 
              onViewDetails={handleViewDetails} 
              onShare={handleShare}
            />
          )}

          {activeView === 'achievements' && (
            <AchievementCalendar history={achievementHistory} />
          )}

          {activeView === 'settings' && (
            <SettingsView 
              currentSettings={settings}
              onSave={handleSaveSettings}
              onReset={handleResetSettings}
            />
          )}

        </main>
         <footer className="text-center py-6 mt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sản phẩm được phát triển bởi{' '}
            <span className="font-semibold text-teal-500">Ryan Coach</span> và{' '}
            <a 
              href="https://sachfitnessviet.shop" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-teal-500 hover:underline"
            >
              sachfitnessviet.shop
            </a>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Thông tin liên hệ gửi về email: Ryan.strongcoach@gmail.com
          </p>
        </footer>
      </div>
      {shareItem && <ShareModal item={shareItem} onClose={() => setShareItem(null)} />}
      {isQuickAddModalOpen && <QuickAddModal onClose={() => setIsQuickAddModalOpen(false)} onSave={handleQuickAddSave} />}
    </div>
  );
};

export default App;