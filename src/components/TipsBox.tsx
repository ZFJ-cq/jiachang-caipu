import { Lightbulb } from 'lucide-react';

interface TipsBoxProps {
  tips: string;
}

export default function TipsBox({ tips }: TipsBoxProps) {
  return (
    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-4 h-4 text-orange-500" />
        <h3 className="font-bold text-amber-900 text-base">烹饪提醒</h3>
      </div>
      <p className="text-amber-700 text-sm leading-relaxed">{tips}</p>
    </div>
  );
}
