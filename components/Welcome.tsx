import React from 'react';

// FIX: Replaced JSX.Element with React.ReactNode to fix "Cannot find namespace 'JSX'" error.
const InfoCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="mb-4 text-teal-500">{icon}</div>
        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
);

const Welcome: React.FC = () => {
    return (
        <div className="text-center py-10 px-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Bắt đầu theo dõi dinh dưỡng của bạn!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Tải lên một bức ảnh để xem điều kỳ diệu xảy ra.</p>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    title="Tải ảnh lên"
                    description="Chọn một hình ảnh rõ ràng về bữa ăn của bạn từ thiết bị."
                />
                 <InfoCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                    title="Phân tích thông minh"
                    description="AI của chúng tôi sẽ xác định các loại thực phẩm và tính toán dinh dưỡng."
                />
                 <InfoCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    title="Nhận kết quả"
                    description="Xem chi tiết lượng calo, protein, carbs và chất béo trong bữa ăn."
                />
            </div>
        </div>
    );
};

export default Welcome;
