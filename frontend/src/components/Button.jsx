import React from "react";
import { Link } from "react-router-dom";

function Button({
  text,
  className,
  linkClassName,
  type = "",
  link = "",
}) {
  return (
    <div
      id="button"
      className={` relative flex items-center justify-center mt-4 ${className} uppercase`}
    >
   
      {link ? (
        <Link
          to={link}
          className={`relative text-white bg-black text-[12px] px-4 py-2 rounded-full z-[10] hover:border-4 hover:border-black hover:text-black  ${linkClassName}`}
        >
          {text}
        </Link>
      ) : (
        <button
          type={type}
          className={`relative text-white bg-black text-[12px] px-4 py-2 rounded-full z-[10] hover:border-4 hover:border-black hover:text-black  ${linkClassName}`}
        >
          {text}
        </button>
      )}
    </div>
  );
}

export default Button;