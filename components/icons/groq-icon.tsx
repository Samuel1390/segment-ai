import React from "react";

const GroqIcon = ({
  className = "size-4 stroke-none fill-neutral-700 invert-10 dark:invert-90",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <div>
      <img
        alt="Groq Mono Logo (LightMod)"
        title="Groq Mono Logo (LightMod)"
        loading="lazy"
        decoding="async"
        data-nimg="1"
        src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/groq.png"
        className={className}
        {...props}
      ></img>
    </div>
  );
};

export default GroqIcon;
