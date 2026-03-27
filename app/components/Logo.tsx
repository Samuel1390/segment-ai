import React from "react";
import Image, { ImageProps } from "next/image";

interface Props extends Omit<ImageProps, "src" | "alt" | "width" | "height"> {
  size: number;
  className?: string;
}

const Logo = ({ size, className, ...props }: Props) => {
  return (
    <Image
      alt="logo"
      src="/segment-logo.png"
      className={`${className} invert-100 dark:invert-0 dark:darker
      mix-blend-multiply
      dark:mix-blend-screen`}
      width={size}
      height={size}
      {...props}
    />
  );
};

export default Logo;
