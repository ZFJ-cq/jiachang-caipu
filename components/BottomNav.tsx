import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Sparkles, Shuffle, User } from 'lucide-react';

const tabs = [
  { path: '/', label: '首页', icon: BookOpen },
  { path: '/smart-match', label: '智能配菜', icon: Sparkles },
  { path: '/what-to-eat', label: '今天吃什么', icon: Shuffle },
  { path: '/my-recipes', label: '我的菜谱', icon: User },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-800 border-t border-amber-100 dark:border-stone-700 flex z-30 transition-colors duration-300">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex-1 flex flex-col items-center py-2 transition-colors ${
              isActive ? 'text-orange-500' : 'text-amber-400 dark:text-stone-500'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
