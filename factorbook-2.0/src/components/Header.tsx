"use client";

import * as React from "react";

const Header: React.FC = () => {
  return (
    <section className="flex flex-col items-center text-4xl tracking-wide leading-10 whitespace-nowrap text-black text-opacity-90 mt-10 gap-[20px]">
      <h1 className="relative flex flex-col items-center">
        Portals
        <div
          className="absolute"
          style={{
            width: "156px",
            height: "40.23px",
            left: "-24px",
            top: "22.77px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="166"
            height="51"
            viewBox="0 0 166 51"
            fill="none"
          >
            <path
              d="M5 5.77011C49 49.7701 134 57.27 161 30.27"
              stroke="#E0E0FF"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </h1>
      <div className="flex items-center justify-center mt-[22.77px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M15.88 9.28957L12 13.1696L8.11998 9.28957C7.72998 8.89957 7.09998 8.89957 6.70998 9.28957C6.31998 9.67957 6.31998 10.3096 6.70998 10.6996L11.3 15.2896C11.69 15.6796 12.32 15.6796 12.71 15.2896L17.3 10.6996C17.69 10.3096 17.69 9.67957 17.3 9.28957C16.91 8.90957 16.27 8.89957 15.88 9.28957Z"
            fill="black"
            fillOpacity="0.54"
          />
        </svg>
      </div>
    </section>
  );
};

export default Header;
