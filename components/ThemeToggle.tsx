import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-white/20"
      aria-label={isDark ? '切换亮色模式' : '切换暗色模式'}
    >
      <Sun
        className={`w-5 h-5 absolute transition-all duration-300 ${
          isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
        } text-white`}
      />
      <Moon
        className={`w-5 h-5 absolute transition-all duration-300 ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
        } text-orange-300`}
      />
    </button>
  );
}
