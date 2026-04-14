import Logo from "../Logo";
import { cn } from "@/lib/utils";

export default function ChatGreeting() {
  return (
    <div
      className={cn(
        "flex flex-col h-fit text-center",
        "items-center justify-center",
      )}
    >
      <Logo size={60} className="mt-15" />
      <p
        className={cn(
          "lg:text-lg",
          "md:text-md",
          "text-neutral-700",
          "dark:text-neutral-300",
          "font-bold",
        )}
      >
        ¡Hola! ¿En qué puedo ayudarte hoy?
      </p>
      <p className="max-w-100 dark:text-neutral-400 text-[0.8rem] mt-10 text-neutral-600">
        Segment es un asistente de IA especializado en ciencias de nivel
        superior, tales como computación, matemáticas, física, biología,
        ingeniería y química. Solo escribe en el campo de texto y envía tu
        mensaje; Segment te responderá al instante.
      </p>
    </div>
  );
}
