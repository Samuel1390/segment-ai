import React from "react";
import Image from "next/image";

const CohereIcon = ({
  className = "size-4 stroke-none fill-neutral-700 invert-70 dark:invert-20",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <div>
      <Image
        alt="Logo de Cohere"
        title="Cohere Mono Logo (DarkMod)"
        loading="lazy"
        decoding="async"
        data-nimg="1"
        className={className}
        width={32 as any}
        height={32 as any}
        src={
          "https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/cohere.png" as any
        }
        {...props}
      />
    </div>
  );
};

export default CohereIcon;
