import {
  useState,
  useActionState,
  useEffect,
  startTransition,
  RefObject,
} from "react";
import ChatFormAction, {
  GenericHistory,
  HistoryData,
} from "../server-actions/chatFormAction";

export type LastUserMessage = {
  prompt: string;
  files?: File[];
  filesNames?: string[];
};

export function useChatState() {
  const [state, action, isPending] = useActionState(ChatFormAction, null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [history, setHistory] = useState<GenericHistory[]>([]);
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [lastUserMessage, setLastUserMessage] = useState<LastUserMessage>({
    prompt: "",
  });

  useEffect(() => {
    if (state && "history" in state) {
      setHistory(state.history);
    }
    if (state && "historyData" in state) {
      setHistoryData(state.historyData);
    }
    if (state && "error" in state) {
      setOpenErrorModal(true);
      setFeedbackMessage("Intenta cambiar de modelo, o espera un minuto");
    }
  }, [state]);

  useEffect(() => {
    if (feedbackMessage) {
      const timeout = setTimeout(() => setFeedbackMessage(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [feedbackMessage]);

  const setLastMessage = (msg: LastUserMessage) => setLastUserMessage(msg);

  const retry = (formRef: RefObject<HTMLFormElement | null>) => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    formData.set("prompt", lastUserMessage.prompt);
    if (lastUserMessage.files && lastUserMessage.files.length > 0) {
      lastUserMessage.files.forEach((file) => formData.append("files", file));
    }
    startTransition(() => {
      action(formData);
    });
  };

  return {
    state,
    action,
    isPending,
    openErrorModal,
    setOpenErrorModal,
    history,
    feedbackMessage,
    setFeedbackMessage,
    lastUserMessage,
    setLastMessage,
    retry,
    historyData,
    setHistoryData,
  };
}
