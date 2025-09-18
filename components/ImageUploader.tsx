import React, { useRef } from 'react';

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageChange: (file: File) => void;
  onRemoveImage: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ imagePreview, onImageChange, onRemoveImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageChange(event.target.files[0]);
    }
    // Đặt lại giá trị của input để cho phép chọn lại cùng một tệp nếu cần
    event.target.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div>
      {/* Input ẩn để chọn tệp */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {/* Input ẩn để chụp ảnh */}
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        capture="environment"
      />
      {imagePreview ? (
        <div className="relative group">
          <img src={imagePreview} alt="Xem trước món ăn" className="w-full h-auto max-h-96 object-contain rounded-xl shadow-md" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
            <button 
              onClick={onRemoveImage} 
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Xóa ảnh
            </button>
          </div>
        </div>
      ) : (
        <div
          className="w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-center transition-colors"
        >
          <div className="flex flex-col items-center justify-center space-y-4">
             <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">Tải lên hoặc Chụp ảnh Món ăn</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Bắt đầu bằng cách chọn một tùy chọn bên dưới.</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
               <button 
                  onClick={handleUploadClick}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-transform transform hover:scale-105"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                 </svg>
                 Tải từ Thư viện
               </button>
               <button 
                  onClick={handleCameraClick}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Chụp ảnh
               </button>
            </div>
             <p className="text-xs text-gray-400 pt-2">PNG, JPG, WEBP</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;