import React, { useState } from 'react';
import { type AchievementHistory } from '../types';

interface AchievementCalendarProps {
  history: AchievementHistory;
}

const AchievementCalendar: React.FC<AchievementCalendarProps> = ({ history }) => {
  const [date, setDate] = useState(new Date());

  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (offset: number) => {
    setDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const year = date.getFullYear();
  const month = date.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Chuẩn hóa về đầu ngày để so sánh
  const todayString = today.toISOString().split('T')[0];


  const renderCalendarDays = () => {
    const days = [];
    // Thêm các ô trống cho những ngày trước ngày 1
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    // Thêm các ô cho mỗi ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const currentDate = new Date(dateString);
      currentDate.setHours(0, 0, 0, 0); // Chuẩn hóa
      
      const dayData = history[dateString];
      const isToday = dateString === todayString;
      const isPastOrToday = currentDate.getTime() <= today.getTime();

      let icon = null;
      let tooltip = `Ngày ${day}/${month + 1}/${year}`;

      if (isPastOrToday) {
        if (dayData && dayData.consumed > 0) {
           if (dayData.consumed <= dayData.goal) {
             icon = <span className="text-3xl sm:text-4xl" role="img" aria-label="Mục tiêu đạt được">🔥</span>;
             tooltip = `Tuyệt vời! Bạn đã hoàn thành mục tiêu ngày ${day}/${month + 1}.`;
           } else {
             icon = <span className="text-3xl sm:text-4xl" role="img" aria-label="Vượt mục tiêu">⚠️</span>;
             tooltip = `Oops! Bạn đã vượt mục tiêu (${dayData.consumed.toLocaleString()}/${dayData.goal.toLocaleString()} calo). Ngày mai cố gắng hơn nhé!`;
           }
        } else {
          // Chỉ hiển thị X cho những ngày trong quá khứ không có dữ liệu
          if (currentDate.getTime() < today.getTime()) {
             icon = <span className="text-2xl text-red-400 dark:text-red-500" role="img" aria-label="Không có dữ liệu">❌</span>;
             tooltip = "Không có dữ liệu cho ngày này. Hãy tiếp tục hành trình của bạn nhé!";
          }
        }
      }
      
      days.push(
        <div 
          key={day} 
          title={tooltip}
          className={`relative p-2 h-20 sm:h-24 flex flex-col justify-start items-center border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200 hover:shadow-lg hover:border-teal-400 dark:hover:border-teal-500 ${isToday ? 'bg-teal-100 dark:bg-teal-900/50' : ''}`}
        >
          <span className={`font-semibold ${isToday ? 'text-teal-600 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300'}`}>{day}</span>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {icon}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
     <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6 text-center">Lịch Thành Tích</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Tháng trước">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{monthNames[month]} {year}</h3>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Tháng sau">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">
                {dayNames.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {renderCalendarDays()}
            </div>
             <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-x-6 gap-y-2 text-center text-sm text-gray-600 dark:text-gray-400">
                <p><span className="font-bold text-lg">🔥</span> = Hoàn thành mục tiêu</p>
                <p><span className="font-bold text-lg">⚠️</span> = Vượt mục tiêu</p>
                <p><span className="font-bold text-lg text-red-500">❌</span> = Thiếu dữ liệu</p>
            </div>
        </div>
    </div>
  );
};

export default AchievementCalendar;