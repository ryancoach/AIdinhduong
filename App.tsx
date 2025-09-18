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
import { analyzeImageWithGemini } from './services/geminiService';
import { getHistory, saveHistory } from './services/historyService';
import { allowedEmails } from './allowedEmails';
import { type FoodNutrition, type AnalysisHistoryItem } from './types';

const App: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FoodNutrition[] | null>(null);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [activeView, setActiveView] = useState<'analyzer' | 'history'>('analyzer');
  const [shareItem, setShareItem] = useState<AnalysisHistoryItem | null>(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('userEmail');
    if (loggedInUser && allowedEmails.includes(loggedInUser.toLowerCase())) {
      setUserEmail(loggedInUser);
      setHistory(getHistory());
    }
  }, []);
  
  const handleLogin = (email: string): boolean => {
    const normalizedEmail = email.toLowerCase().trim();
    if (allowedEmails.includes(normalizedEmail)) {
      localStorage.setItem('userEmail', normalizedEmail);
      setUserEmail(normalizedEmail);
      setHistory(getHistory());
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setUserEmail(null);
    setHistory([]);
    // Reset state
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
          resolve(reader.result.split(',')[1]); // remove data:mime/type;base64, part
        } else {
          reject(new Error('Failed to read file as base64 string'));
        }
      };
      reader.onerror = (error) => reject(error);
    });

  const handleImageChange = (file: File) => {
    setImageFile(file);
    setAnalysisResult(null); // Clear previous result
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
          saveHistory(updatedHistory);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  const handleViewDetails = (item: AnalysisHistoryItem) => {
    setActiveView('analyzer');
    setAnalysisResult(item.analysisResult);
    setImagePreview(item.imagePreview);
    setImageFile(null); // Can't re-create the file, so user can't re-analyze
    setError(null);
  };

  const handleShare = (item: AnalysisHistoryItem) => {
    setShareItem(item);
  };
  
  if (!userEmail) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl">
        <Header userEmail={userEmail} onLogout={handleLogout} />
        <main className="mt-8">
          <Tabs activeView={activeView} setActiveView={setActiveView} historyCount={history.length} />
          
          {activeView === 'analyzer' && (
            <div className="space-y-6">
              <ImageUploader 
                imagePreview={imagePreview} 
                onImageChange={handleImageChange} 
                onRemoveImage={handleRemoveImage} 
              />
              
              {imagePreview && !analysisResult && (
                <div className="text-center">
                  <button 
                    onClick={handleAnalyzeClick} 
                    disabled={isLoading}
                    className="px-8 py-3 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    {isLoading ? 'Đang Phân Tích...' : 'Phân Tích Hình Ảnh'}
                  </button>
                </div>
              )}
              
              {isLoading && <Spinner />}
              {error && <Alert message={error} />}
              
              {analysisResult ? (
                <NutritionGrid data={analysisResult} />
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

        </main>
      </div>
      {shareItem && <ShareModal item={shareItem} onClose={() => setShareItem(null)} />}
    </div>
  );
};

export default App;
