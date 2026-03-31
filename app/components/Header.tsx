"use client";
import React, { useState } from "react";
import ThemeButton from "./ThemeButton";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Logo from "./Logo";
import { GithubTwotoneIcon } from "@/components/icons/line-md-github-twotone";
import useTheme from "@/app/hooks/useTheme";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { theme } = useTheme();
  return (
    <header className="dark:bg-black/80 bg-white/80 w-screen flex justify-center items-center fixed top-0 z-500 backdrop-blur-sm dark:border-neutral-400/80 border-neutral-700/80 border-b">
      <div className="flex justify-between items-center w-full max-w-3xl p-2">
        <div className="gap-2 flex items-center">
          <Logo size={34} />
          <span>Segment</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <GithubLink />
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
        className={`absolute sm:hidden top-11 dark:bg-neutral-950 
          bg-neutral-50 py-2 px-1/2 px-3 dark:text-neutral-200
          ${openMenu ? "flex" : "hidden"}
          justify-between items-center w-screen
          items-center gap-4`}
      >
        <ThemeButton />
        <GithubLink />
      </div>
    </header>
  );
};

function GithubLink() {
  return (
    <Link
      href="https://github.com/Samuel1390/segment-ai"
      rel="noopener"
      target="_blank"
    >
      <GithubTwotoneIcon
        size={32}
        className="dark:hover:bg-neutral-700 hover:cursor-pointer hover:bg-neutral-200 dark:text-neutral-200 transition-all rounded-full p-1"
      />
    </Link>
  );
}

export default Header;
