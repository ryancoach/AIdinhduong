import React, { useState } from 'react';
import Logo from './Logo';

interface LoginProps {
  onLogin: (email: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Vui lòng nhập email của bạn.');
      return;
    }
    const success = onLogin(email);
    if (!success) {
      setError('Email không hợp lệ hoặc không được cấp quyền truy cập. Vui lòng liên hệ quản trị viên.');
    } else {
      setError(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 px-4">
      <main className="flex-grow flex items-center justify-center py-8">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-2">
                <Logo className="h-10 w-10" />
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                  AI Dinh Dưỡng
                </h1>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Vui lòng đăng nhập để tiếp tục
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="text-sm font-bold text-gray-600 dark:text-gray-300 block mb-2">
                Địa chỉ Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="tenban@example.com"
              />
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm" role="alert">
                <p>{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-transform transform hover:scale-105"
              >
                Đăng Nhập
              </button>
            </div>
          </form>
        </div>
      </main>
      <footer className="py-6 text-center">
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
  );
};

export default Login;