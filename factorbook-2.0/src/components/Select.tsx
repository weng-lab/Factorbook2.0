import * as React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className }) => (
  <button onClick={onClick} className={className}>
    {text}
  </button>
);

interface SelectHostProps {
  text: string;
}

const SelectHost: React.FC<SelectHostProps> = ({ text }) => (
  <div className="flex flex-col justify-center px-4 py-2.5 text-base tracking-normal leading-6 bg-violet-500 bg-opacity-10 rounded-[32px] text-black text-opacity-40">
    <div className="flex gap-2 items-center">
      <span className="flex-1">{text}</span>
      <div className="flex items-center justify-center min-w-[24px] min-h-[24px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M7 10l5 5 5-5H7z" fill="black" fillOpacity="0.54" />
        </svg>
      </div>
    </div>
  </div>
);

const Select: React.FC = () => {
  return (
    <section className="flex flex-col pb-20 max-w-[310px]">
      <p className="w-full text-base tracking-normal leading-6 text-black text-opacity-90">
        Explore TFs in
      </p>
      <div className="flex gap-2.5">
        <SelectHost text="Select your host" />
        <Button
          text="Go"
          className="justify-center px-6 py-2 text-base font-medium tracking-wide leading-7 text-white whitespace-nowrap bg-violet-500 rounded-3xl"
        />
      </div>
    </section>
  );
};

export default Select;
