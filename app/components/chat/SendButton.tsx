import { cn } from "@/lib/utils";
import { Loader2, Send } from "lucide-react";

function SendButton({
  formLoading,
  isFormAvailable,
  isStreaming,
}: {
  formLoading: boolean;
  isFormAvailable: (extraconditions: boolean[]) => boolean;
  isStreaming: boolean;
}) {
  return (
    <button
      className={cn(
        "disabled:opacity-50 p-2 dark:bg-white dark:text-black",
        "transition-colors",
        "bg-black text-white hover:bg-neutral-900 dark:hover:bg-neutral-200",
        "rounded-full disabled:cursor-not-allowed",
        "flex items-center justify-center",
      )}
      disabled={!isFormAvailable([]) || isStreaming}
      type="submit"
    >
      {formLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <Send size={20} />
      )}
    </button>
  );
}

export default SendButton;
