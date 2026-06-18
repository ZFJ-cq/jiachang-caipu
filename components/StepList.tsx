import type { Step } from '@/types/recipe';

interface StepListProps {
  steps: Step[];
}

export default function StepList({ steps }: StepListProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-amber-100">
      <h3 className="font-bold text-amber-900 text-base mb-3">烹饪步骤</h3>
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.index} className="flex gap-3">
            <div className="shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
              {step.index}
            </div>
            <p className="text-amber-800 text-sm leading-relaxed pt-1">{step.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
