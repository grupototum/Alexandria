import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { STEPS } from "./NewClientUtilities";

interface NewClientStepsProps {
  step: number;
  progress: number;
  onStepClick: (newStep: number) => void;
}

export function NewClientSteps({
  step,
  progress,
  onStepClick,
}: NewClientStepsProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
      <div className="flex items-center gap-1 mb-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex-1 flex items-center gap-1">
            <button
              onClick={() => onStepClick(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-[4px] text-[12px] font-medium transition-all w-full ${
                i === step
                  ? "bg-[#262626] text-[#fafafa]"
                  : i < step
                    ? "bg-[#171717] text-[#a3a3a3]"
                    : "bg-transparent text-[#737373] hover:text-[#a3a3a3]"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  i < step
                    ? "bg-[#fafafa] text-[#0a0a0a]"
                    : i === step
                      ? "bg-[#ffffff] text-[#0a0a0a]"
                      : "bg-[#171717] text-[#737373] border border-white/5"
                }`}
              >
                {i < step ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span className="hidden lg:inline truncate">{s.title}</span>
            </button>
            {i < 4 && (
              <div
                className={`w-4 h-[1px] shrink-0 ${
                  i < step ? "bg-[#fafafa]" : "bg-white/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="h-1.5 bg-[#171717] rounded-full overflow-hidden mt-4">
        <motion.div
          className="h-full bg-[#ffffff] rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
}
