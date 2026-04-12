import { Globe, File, Brain } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

export function GoogleSearch() {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button
          className={cn(
            "dark:text-neutral-100 dark:bg-neutral-900",
            "text-neutral-800 bg-neutral-50 h-fit",
            "border border-neutral-600 dark:border-neutral-400 shadow-sm shadow-neutral-900/50 rounded-md",
            "p-1",
          )}
        >
          <Globe size={32} />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side="top">
        <span>Busqueda en el navegador si es requerida</span>
      </HoverCardContent>
    </HoverCard>
  );
}
export function ComplexProblems() {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button
          className={cn(
            "dark:text-neutral-100 dark:bg-neutral-900",
            "text-neutral-800 bg-neutral-50 h-fit",
            "border border-neutral-600 dark:border-neutral-400 shadow-sm shadow-neutral-900/50 rounded-md",
            "p-1",
          )}
        >
          <Brain size={32} />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side="top">
        <span>Modelo condicionado para resolver problemas complejos</span>
      </HoverCardContent>
    </HoverCard>
  );
}

export function FileSupport() {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button
          className={cn(
            "dark:text-neutral-100 dark:bg-neutral-900",
            "text-neutral-800 bg-neutral-50 h-fit",
            "border border-neutral-600 dark:border-neutral-400 shadow-sm shadow-neutral-900/50 rounded-md",
            "p-1",
          )}
        >
          <File size={32} />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side="top">
        <span>Soporta la lectura de archivos</span>
      </HoverCardContent>
    </HoverCard>
  );
}
