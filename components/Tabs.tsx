import React from 'react';

type View = 'analyzer' | 'history';

interface TabsProps {
  activeView: View;
  setActiveView: (view: View) => void;
  historyCount: number;
}

const Tabs: React.FC<TabsProps> = ({ activeView, setActiveView, historyCount }) => {
  const getButtonClass = (view: View) => {
    return activeView === view
      ? 'inline-block p-4 text-teal-500 border-b-2 border-teal-500 rounded-t-lg active dark:text-teal-400 dark:border-teal-400'
      : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300';
  };

  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-8">
      <ul className="flex flex-wrap -mb-px">
        <li className="me-2">
          <button onClick={() => setActiveView('analyzer')} className={getButtonClass('analyzer')}>
            Phân Tích
          </button>
        </li>
        <li className="me-2">
          <button onClick={() => setActiveView('history')} className={getButtonClass('history')}>
            Lịch Sử ({historyCount})
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Tabs;
