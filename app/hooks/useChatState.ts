import { useState, useActionState, useEffect, startTransition, RefObject } from "react";
import ChatFormAction, { GenericHistory } from "../server-actions/chatFormAction";

export function useChatState() {
  const [state, action, isPending] = useActionState(ChatFormAction, null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [history, setHistory] = useState<GenericHistory[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [lastUserMessage, setLastUserMessage] = useState<string>("");

  useEffect(() => {
    if (state && "history" in state) {
      setHistory(state.history);
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

  const setLastMessage = (msg: string) => setLastUserMessage(msg);

  const retry = (formRef: RefObject<HTMLFormElement | null>) => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    formData.set("prompt", lastUserMessage);
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
  };
}
