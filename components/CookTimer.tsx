import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, X, Timer } from 'lucide-react';

const PRESETS = [
  { label: '1分钟', seconds: 60 },
  { label: '3分钟', seconds: 180 },
  { label: '5分钟', seconds: 300 },
  { label: '10分钟', seconds: 600 },
  { label: '15分钟', seconds: 900 },
  { label: '30分钟', seconds: 1800 },
];

interface CookTimerProps {
  floating?: boolean;
  onClose?: () => void;
}

export default function CookTimer({ floating = false, onClose }: CookTimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const playBeep = useCallback(() => {
    try {
      const ctx = new AudioContext();
      audioRef.current = ctx;
      const playTone = (time: number, freq: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
        osc.start(time);
        osc.stop(time + duration);
      };
      const now = ctx.currentTime;
      playTone(now, 880, 0.2);
      playTone(now + 0.3, 880, 0.2);
      playTone(now + 0.6, 880, 0.2);
      playTone(now + 0.9, 1100, 0.4);
    } catch {
      // Web Audio API not available
    }
  }, []);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setRunning(false);
            setFinished(true);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining, playBeep]);

  const handlePreset = (seconds: number) => {
    setTotalSeconds(seconds);
    setRemaining(seconds);
    setRunning(false);
    setFinished(false);
    setShowCustom(false);
  };

  const handleCustom = () => {
    const mins = parseInt(customInput, 10);
    if (mins > 0) {
      const seconds = mins * 60;
      setTotalSeconds(seconds);
      setRemaining(seconds);
      setRunning(false);
      setFinished(false);
      setShowCustom(false);
      setCustomInput('');
    }
  };

  const handleToggle = () => {
    if (remaining > 0) {
      setRunning(!running);
      setFinished(false);
    }
  };

  const handleReset = () => {
    setRunning(false);
    setRemaining(totalSeconds);
    setFinished(false);
    if (audioRef.current) {
      audioRef.current.close();
      audioRef.current = null;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? (totalSeconds - remaining) / totalSeconds : 0;
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference * (1 - progress);

  const content = (
    <div className={floating ? '' : 'min-h-screen bg-amber-50 pb-6'}>
      {!floating && (
        <div className="bg-white border-b border-amber-100 px-4 pt-10 pb-4">
          <h1 className="text-xl font-bold text-amber-900">烹饪计时器</h1>
        </div>
      )}

      <div className={`flex flex-col items-center ${floating ? 'p-4' : 'px-4 pt-8'}`}>
        {floating && onClose && (
          <div className="flex items-center justify-between w-full mb-3">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-amber-900">计时器</span>
            </div>
            <button onClick={onClose} className="p-1">
              <X className="w-5 h-5 text-amber-400" />
            </button>
          </div>
        )}

        {/* 圆形倒计时 */}
        <div className={`relative ${finished ? 'animate-pulse' : ''}`}>
          <svg width="200" height="200" className="transform -rotate-90">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#FEF3C7"
              strokeWidth="8"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={finished ? '#EF4444' : '#F97316'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${finished ? 'text-red-500' : 'text-amber-900'}`}>
              {formatTime(remaining)}
            </span>
            {finished && <span className="text-sm text-red-500 font-medium mt-1">时间到！</span>}
          </div>
        </div>

        {/* 预设按钮 */}
        <div className="grid grid-cols-3 gap-2 mt-6 w-full max-w-xs">
          {PRESETS.map((preset) => (
            <button
              key={preset.seconds}
              onClick={() => handlePreset(preset.seconds)}
              className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                totalSeconds === preset.seconds && !running
                  ? 'bg-orange-500 text-white'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={() => setShowCustom(!showCustom)}
            className={`py-2 rounded-xl text-sm font-medium transition-colors ${
              showCustom
                ? 'bg-orange-500 text-white'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            自定义
          </button>
        </div>

        {/* 自定义输入 */}
        {showCustom && (
          <div className="flex items-center gap-2 mt-3 w-full max-w-xs">
            <input
              type="number"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="输入分钟数"
              className="flex-1 px-3 py-2 rounded-xl border border-amber-200 text-sm text-amber-900 focus:outline-none focus:border-orange-400"
              min="1"
            />
            <button
              onClick={handleCustom}
              className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium"
            >
              确定
            </button>
          </div>
        )}

        {/* 控制按钮 */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 hover:bg-amber-200 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={handleToggle}
            disabled={totalSeconds === 0}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-95 ${
              running
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-orange-500 hover:bg-orange-600'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {running ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          </button>
          <div className="w-12 h-12" /> {/* 占位保持居中 */}
        </div>
      </div>
    </div>
  );

  if (floating) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={onClose}>
        <div
          className="bg-white rounded-t-2xl w-full max-w-md max-h-[80vh] overflow-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return content;
}
