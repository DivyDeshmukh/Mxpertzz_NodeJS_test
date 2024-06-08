import React from "react";

function Input(
  {
    type = "text",
    placeholder = "",
    className = "",
    label = "",
    id = "",
    ...props
  },
  ref
) {
  return (
    <div className="flex flex-col w-[80%] gap-1">
      <label htmlFor={id} className="font-semibold text-[13px]">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`bg-[#16131a] p-2 rounded-lg text-white pl-4 ${className} text-[12.5px]`}
        id={id}
        ref={ref}
        {...props}
      />
    </div>
  );
}

export default React.forwardRef(Input);