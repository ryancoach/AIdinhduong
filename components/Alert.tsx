import React from 'react';

interface AlertProps {
  message: string;
}

const Alert: React.FC<AlertProps> = ({ message }) => {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-4" role="alert">
      <div className="flex">
        <div className="py-1">
          <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8zm-1-5a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-1-9a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-1v4h1a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/></svg>
        </div>
        <div>
          <p className="font-bold">Đã xảy ra lỗi</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
