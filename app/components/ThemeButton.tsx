"use client";
import useTheme from "../hooks/useTheme";
import { Toggle } from "@/components/ui/toggle";
import { MoonIcon, SunIcon } from "lucide-react";

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  const toogleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <Toggle
      className="[&>div]:rounded-full
    [&>div]:p-[2px] [&>div]:hover:opacity-70
    [&>div]:hover:cursor-pointer
    rounded-full"
      variant={"outline"}
      onClick={toogleTheme}
    >
      <div className={"dark:text-neutral-200 dark:bg-neutral-700"}>
        <MoonIcon />
      </div>
      <div
        className={
          "bg-neutral-200 text-neutral-950 dark:bg-transparent dark:text-neutral-200"
        }
      >
        <SunIcon />
      </div>
    </Toggle>
  );
};

export default ThemeButton;
