import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, TrendingUp, AlertCircle, UtensilsCrossed } from 'lucide-react';
import * as storage from '@/services/storage';
import type { CookRecord } from '@/types/recipe';
import BottomNav from '@/components/BottomNav';

const DAILY_TARGET = 2000;

export default function Nutrition() {
  const navigate = useNavigate();
  const [todayRecords, setTodayRecords] = useState<CookRecord[]>([]);
  const [weekRecords, setWeekRecords] = useState<CookRecord[]>([]);

  useEffect(() => {
    setTodayRecords(storage.getTodayCookRecords());
    setWeekRecords(storage.getWeekCookRecords());
  }, []);

  const todayCalories = useMemo(() => {
    return todayRecords.reduce((sum, r) => sum + parseCalories(r.calories), 0);
  }, [todayRecords]);

  const weekCalories = useMemo(() => {
    const data: { day: string; calories: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = `${d.getMonth() + 1}/${d.getDate()}`;
      const dayCal = weekRecords
        .filter((r) => r.cookedAt.startsWith(dateStr))
        .reduce((sum, r) => sum + parseCalories(r.calories), 0);
      data.push({ day: dayLabel, calories: dayCal });
    }
    return data;
  }, [weekRecords]);

  const maxWeekCal = Math.max(...weekCalories.map((d) => d.calories), DAILY_TARGET);

  const progress = Math.min((todayCalories / DAILY_TARGET) * 100, 100);

  const nutritionTip = useMemo(() => {
    if (todayCalories === 0) return '今天还没有烹饪记录，开始做一道菜吧！';
    if (todayCalories < 1200) return '今日热量偏低，建议补充蛋白质和碳水化合物';
    if (todayCalories < 1800) return '今日热量适中，保持均衡饮食';
    if (todayCalories <= 2200) return '今日热量达标，继续保持！';
    return '今日热量偏高，注意控制饮食';
  }, [todayCalories]);

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-stone-900 pb-24">
      {/* 顶部导航 */}
      <div className="bg-gradient-to-b from-orange-500 to-orange-400 px-4 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-white">营养分析</h1>
        </div>
        <p className="text-orange-100 text-sm">追踪你的每日热量摄入</p>
      </div>

      <div className="px-4 space-y-4 mt-4">
        {/* 今日热量 */}
        <div className="bg-white dark:bg-stone-800 rounded-xl p-5 border border-amber-100 dark:border-stone-700">
          <div className="flex items-center gap-4">
            {/* 环形进度图 */}
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#FEF3C7" strokeWidth="8" className="dark:stroke-stone-700" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(progress / 100) * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-orange-500">{todayCalories}</span>
                <span className="text-xs text-amber-500 dark:text-stone-400">千卡</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-amber-700 dark:text-stone-300 mb-1">每日推荐</p>
              <p className="text-2xl font-bold text-amber-900 dark:text-stone-100">{DAILY_TARGET} <span className="text-sm font-normal">千卡</span></p>
              <p className="text-sm text-amber-500 dark:text-stone-400 mt-1">
                还需 {Math.max(0, DAILY_TARGET - todayCalories)} 千卡
              </p>
            </div>
          </div>
        </div>

        {/* 营养建议 */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <p className="text-sm text-orange-700 dark:text-orange-300">{nutritionTip}</p>
        </div>

        {/* 本周热量趋势 */}
        <div className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-amber-100 dark:border-stone-700">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <h2 className="text-base font-bold text-amber-900 dark:text-stone-100">本周热量趋势</h2>
          </div>
          <div className="flex items-end gap-2 h-32">
            {weekCalories.map((d, i) => {
              const height = maxWeekCal > 0 ? (d.calories / maxWeekCal) * 100 : 0;
              const isToday = i === weekCalories.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-amber-500 dark:text-stone-400">
                    {d.calories > 0 ? d.calories : ''}
                  </span>
                  <div className="w-full relative" style={{ height: '80px' }}>
                    <div
                      className={`absolute bottom-0 w-full rounded-t-md transition-all duration-300 ${
                        isToday ? 'bg-orange-500' : 'bg-orange-200 dark:bg-orange-800'
                      }`}
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                  </div>
                  <span className="text-xs text-amber-500 dark:text-stone-400">{d.day}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 border-t border-dashed border-orange-300 dark:border-orange-700 relative">
            <span className="absolute -top-2 right-0 text-xs text-orange-400 dark:text-orange-600 bg-white dark:bg-stone-800 px-1">
              目标 {DAILY_TARGET}
            </span>
          </div>
        </div>

        {/* 今日已烹饪 */}
        <div className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-amber-100 dark:border-stone-700">
          <div className="flex items-center gap-2 mb-3">
            <UtensilsCrossed className="w-4 h-4 text-orange-500" />
            <h2 className="text-base font-bold text-amber-900 dark:text-stone-100">今日已烹饪</h2>
          </div>
          {todayRecords.length === 0 ? (
            <p className="text-sm text-amber-400 dark:text-stone-500 text-center py-6">今天还没有烹饪记录</p>
          ) : (
            <div className="space-y-2">
              {todayRecords.map((record, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 border-b border-amber-50 dark:border-stone-700 last:border-0"
                >
                  <span className="text-sm text-amber-900 dark:text-stone-200">{record.recipeName}</span>
                  <span className="flex items-center gap-1 text-sm text-orange-500">
                    <Flame className="w-3.5 h-3.5" />
                    {record.calories || '未知'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function parseCalories(calories: string): number {
  if (!calories) return 0;
  const match = calories.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}
