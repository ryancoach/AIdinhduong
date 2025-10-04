import React from 'react';

const GuideStep: React.FC<{ title: string; description: string; stepNumber: number }> = ({ title, description, stepNumber }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-500 dark:text-teal-400 font-bold text-lg">
            {stepNumber}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-left">{title}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 text-left">{description}</p>
        </div>
    </div>
);

const Welcome: React.FC = () => {
    return (
        <div className="text-center py-10 px-4">
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Chào mừng bạn đến với Trợ Lý Dinh Dưỡng AI!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Làm theo các bước đơn giản sau để bắt đầu.</p>
            
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
                <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Hướng Dẫn Sử Dụng</h3>
                <div className="space-y-6">
                    <GuideStep 
                        stepNumber={1}
                        title="Chụp hoặc Tải Ảnh"
                        description="Sử dụng các nút ở khu vực tải ảnh để chụp ảnh món ăn của bạn hoặc chọn một ảnh có sẵn từ thư viện."
                    />
                    <GuideStep 
                        stepNumber={2}
                        title="Bắt Đầu Phân Tích"
                        description="Sau khi ảnh được tải lên, nhấn vào nút 'Phân Tích Hình Ảnh' để AI bắt đầu làm việc và tính toán dinh dưỡng."
                    />
                    <GuideStep 
                        stepNumber={3}
                        title="Xem Kết Quả & Lịch Sử"
                        description="Xem chi tiết dinh dưỡng, chia sẻ kết quả và truy cập lại các phân tích cũ trong tab 'Lịch Sử'."
                    />
                </div>
            </div>
        </div>
    );
};

export default Welcome;