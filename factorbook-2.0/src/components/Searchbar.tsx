import React from "react";

interface SearchBarProps {
  placeholder: string;
  helperText: string;
}

const Searchbar: React.FC<SearchBarProps> = ({ placeholder, helperText }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg">
      <div className="relative w-full max-w-lg">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full py-2 pl-4 pr-24 text-black bg-transparent border border-gray-300 rounded-full focus:outline-none"
          style={{ height: "40px" }} // Ensuring consistent height
        />
        <button
          className="absolute top-0 right-0 h-full px-6 text-white bg-purple-custom rounded-full"
          style={{
            height: "40px", // Ensuring consistent height
            backgroundColor: "#8169BF", // Custom background color
          }}
        >
          Search
        </button>
      </div>
      <p className="mt-2 text-sm text-white">{helperText}</p>
    </div>
  );
};

export default Searchbar;
