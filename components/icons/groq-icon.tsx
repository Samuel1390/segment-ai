import React from "react";
import Image from "next/image";

const GroqIcon = ({
  className = "size-4 stroke-none fill-neutral-700 invert-10 dark:invert-90",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <div>
      <Image
        alt="Groq Mono Logo (LightMod)"
        title="Groq Mono Logo (LightMod)"
        loading="lazy"
        decoding="async"
        data-nimg="1"
        width={32 as any}
        height={32 as any}
        src={
          "https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/groq.png" as any
        }
        className={className}
        {...props}
      />
    </div>
  );
};

export default GroqIcon;
