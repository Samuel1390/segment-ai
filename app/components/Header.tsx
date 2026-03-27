"use client";
import React, { useState } from "react";
import ThemeButton from "./ThemeButton";
import { ChevronDown } from "lucide-react";
import Logo from "./Logo";
import { GithubIcon } from "lucide-react";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <header className="dark:bg-black/80 bg-white/80 w-screen flex justify-center items-center fixed top-0 z-500 backdrop-blur-sm">
      <div className="flex justify-between items-center w-full max-w-3xl p-2">
        <div className="gap-2 flex items-center">
          <Logo size={34} />
          <span>Segment</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <GithubIcon
            size={32}
            className="dark:hover:bg-neutral-700 hover:cursor-pointer hover:bg-neutral-200 dark:text-neutral-900 transition-all rounded-full p-1"
          />
          <ThemeButton />
        </div>
        <button
          className="sm:hidden block"
          onClick={() => setOpenMenu((prev) => !prev)}
        >
          <ChevronDown />
        </button>
      </div>
      <div
        className={`absolute sm:hidden top-11 dark:bg-neutral-950 bg-neutral-50 py-2 px-1/2
          ${openMenu ? "flex" : "hidden"}
          justify-between items-center w-screen
          items-center gap-4`}
      >
        <ThemeButton />
        <GithubIcon />
      </div>
    </header>
  );
};

export default Header;
