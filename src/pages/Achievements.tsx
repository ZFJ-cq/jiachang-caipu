import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Lock, Star } from 'lucide-react';
import * as storage from '@/services/storage';
import type { Achievement } from '@/types/recipe';
import BottomNav from '@/components/BottomNav';

const ICON_MAP: Record<string, string> = {
  ChefHat: '👨‍🍳',
  Utensils: '🍴',
  Flame: '🔥',
  Crown: '👑',
  Heart: '❤️',
  Compass: '🧭',
  Sparkles: '✨',
  Sunrise: '🌅',
  Cake: '🍰',
  Soup: '🍲',
};

export default function Achievements() {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const unlocked = storage.checkAndUnlockAchievements();
    setAchievements(storage.getAchievements());
    if (unlocked.length > 0) {
      setNewlyUnlocked(unlocked);
      setShowCelebration(true);
    }
  }, []);

  const unlockedCount = useMemo(() => achievements.filter((a) => a.unlockedAt).length, [achievements]);

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-stone-900 pb-24">
      {/* 顶部导航 */}
      <div className="bg-gradient-to-b from-orange-500 to-orange-400 px-4 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-white">烹饪成就</h1>
        </div>
        <p className="text-orange-100 text-sm">已解锁 {unlockedCount}/{achievements.length} 个成就</p>
      </div>

      <div className="px-4 space-y-3 mt-4">
        {achievements.map((achievement) => {
          const isUnlocked = !!achievement.unlockedAt;
          const progressPercent = Math.min((achievement.progress / achievement.target) * 100, 100);
          const icon = ICON_MAP[achievement.icon] || '🏆';

          return (
            <div
              key={achievement.id}
              className={`bg-white dark:bg-stone-800 rounded-xl p-4 border transition-all ${
                isUnlocked
                  ? 'border-orange-300 dark:border-orange-700 shadow-sm'
                  : 'border-amber-100 dark:border-stone-700 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    isUnlocked
                      ? 'bg-orange-100 dark:bg-orange-900/40'
                      : 'bg-amber-100 dark:bg-stone-700 grayscale'
                  }`}
                >
                  {isUnlocked ? icon : <Lock className="w-5 h-5 text-amber-400 dark:text-stone-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-sm ${isUnlocked ? 'text-amber-900 dark:text-stone-100' : 'text-amber-500 dark:text-stone-400'}`}>
                      {achievement.name}
                    </h3>
                    {isUnlocked && (
                      <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                    )}
                  </div>
                  <p className="text-xs text-amber-600 dark:text-stone-400 mt-0.5">{achievement.description}</p>
                  {/* 进度条 */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-amber-100 dark:bg-stone-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isUnlocked ? 'bg-orange-500' : 'bg-amber-300 dark:bg-stone-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-amber-500 dark:text-stone-400 shrink-0">
                      {achievement.progress}/{achievement.target}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 庆祝弹窗 */}
      {showCelebration && newlyUnlocked.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-6" onClick={() => setShowCelebration(false)}>
          <div
            className="bg-white dark:bg-stone-800 rounded-2xl p-6 w-full max-w-sm text-center animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-4 animate-celebrate">🎉</div>
            <h2 className="text-xl font-bold text-amber-900 dark:text-stone-100 mb-2">恭喜解锁新成就！</h2>
            {newlyUnlocked.map((a) => (
              <div key={a.id} className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-3 mb-2">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  <span className="font-bold text-orange-600 dark:text-orange-300">{a.name}</span>
                </div>
                <p className="text-xs text-amber-600 dark:text-stone-400 mt-1">{a.description}</p>
              </div>
            ))}
            <button
              onClick={() => setShowCelebration(false)}
              className="mt-4 px-6 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              太棒了！
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
