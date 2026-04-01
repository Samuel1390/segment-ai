import React from "react";

const CohereIcon = ({
  className = "size-4 stroke-none fill-neutral-700 invert-70 dark:invert-20",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <div>
      <img
        alt="Cohere Mono Logo (DarkMod)"
        title="Cohere Mono Logo (DarkMod)"
        loading="lazy"
        width={32}
        height={32}
        decoding="async"
        data-nimg="1"
        className={className}
        src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/cohere.png"
        {...props}
      />
    </div>
  );
};

export default CohereIcon;
