import * as React from "react";
import Image from "next/image";

interface ImageComponentProps {
  src: string;
  alt: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ src, alt }) => {
  const handleClick = () => {
    alert("Image clicked!");
  };

  return (
    <button
      onClick={handleClick}
      className="w-full aspect-square max-w-[200px]"
    >
      <Image
        loading="lazy"
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </button>
  );
};

const MediaCell_1: React.FC = () => {
  return (
    <main>
      <section>
        <ImageComponent
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/2b6f656c3a657fefb37b7767c8aa63040174b7b2c5d2a5fa31d27243c52ef195?apiKey=38ba2feafab44bc8a709fed7437448e4&"
          alt="Sample image"
        />
      </section>
    </main>
  );
};

export default MediaCell_1;
