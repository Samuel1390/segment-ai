import Logo from "../Logo";
import { cn } from "@/lib/utils";

export default function ChatGreeting() {
  return (
    <div
      className={cn(
        "flex flex-col self-center text-center",
        "my-auto items-center justify-center",
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
    </div>
  );
}
