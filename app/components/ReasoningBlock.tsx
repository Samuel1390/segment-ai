"use client";
import { useState } from "react";
import Output from "./output/Output";
import { Button } from "@/components/ui/button";
import { Atom } from "lucide-react";
import { ChevronDown } from "lucide-react";

const ReasoningBlock = ({ reasoning }: { reasoning: string }) => {
  const [colapseContent, setColapseContent] = useState(false);
  return (
    <div className="flex bg-neutral-200 dark:bg-neutral-800 py-4 rounded flex-col gap-2">
      <Button
        variant={"ghost"}
        onClick={() => setColapseContent((prev) => !prev)}
        className="text-muted-foreground hover:bg-none mx-2 w-fit self-left px-3 text-sm flex items-center gap-2"
      >
        <Atom />
        {colapseContent ? "Ver razonamiento" : "Ocultar razonamiento"}
        <ChevronDown />
      </Button>
      <div
        className={`${
          colapseContent ? "hidden" : "block"
        } text-muted-foreground px-3 opacity-75 text-sm`}
      >
        <Output content={reasoning} />
      </div>
    </div>
  );
};

export default ReasoningBlock;
