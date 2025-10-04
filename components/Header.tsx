import React from 'react';
import Logo from './Logo';
import { type StreakData } from '../types';

interface HeaderProps {
  userEmail: string | null;
  onLogout: () => void;
  streak: StreakData | null;
}


const Header: React.FC<HeaderProps> = ({ userEmail, onLogout, streak }) => {
  return (
    <header className="text-center relative">
        {userEmail && (
            <div className="absolute top-0 right-0 flex items-center space-x-2 sm:space-x-3">
                {streak && streak.count > 0 && (
                    <div className="flex items-center space-x-1 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 font-bold text-sm px-3 py-1.5 rounded-full">
                        <span>🔥</span>
                        <span>{streak.count} ngày</span>
                    </div>
                )}
                <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">{userEmail}</span>
                <button 
                    onClick={onLogout}
                    className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-md hover:bg-red-600 transition-colors"
                    aria-label="Đăng xuất"
                >
                    Đăng xuất
                </button>
            </div>
        )}
        <div className="flex justify-center items-center gap-3 sm:gap-4">
            <Logo className="h-10 w-10 sm:h-12 sm:w-12" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                Phân Tích Dinh Dưỡng Bằng AI
            </h1>
        </div>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Chụp ảnh món ăn của bạn và để trí tuệ nhân tạo phân tích chi tiết hàm lượng calo và các chất dinh dưỡng.
        </p>
    </header>
  );
};

export default Header;