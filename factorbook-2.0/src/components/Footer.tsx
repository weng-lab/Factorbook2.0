import React from "react";

type LinkSectionProps = {
  title: string;
  links: { text: string; href: string }[];
};

const LinkSection: React.FC<LinkSectionProps> = ({ title, links }) => (
  <section className="flex flex-col w-full max-md:ml-0 max-md:w-full">
    <h2 className="text-xl font-medium tracking-normal leading-8 text-white">
      {title}
    </h2>
    <nav className="flex flex-col mt-5 px-2 py-1.5 text-sm tracking-wide leading-6">
      {links.map((link) => (
        <a
          href={link.href}
          className="mt-5 text-white"
          key={link.text}
          tabIndex={0}
        >
          {link.text}
        </a>
      ))}
    </nav>
  </section>
);

const Footer: React.FC = () => (
  <main className="flex flex-col items-center px-16 py-20 bg-zinc-800 max-md:px-5">
    <header className="mt-4 w-full max-w-[1150px] max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col max-md:gap-10">
        <section className="flex flex-col w-full max-md:ml-0 max-md:w-full">
          <h1 className="text-5xl font-medium tracking-tighter leading-9 text-white max-md:text-4xl max-md:leading-8 pointer-events-none">
            factor
            <br />
            <span style={{ marginLeft: "4.2rem" }}>book</span>
          </h1>
          <p className="mt-8 text-base tracking-normal leading-6 text-white pointer-events-none">
            A comprehensive online resource dedicated to the study of
            transcription factors (TFs) in human and mouse genomes.
          </p>
        </section>
        <section className="flex flex-col ml-5 w-full max-md:ml-0 max-md:w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-10">
            <LinkSection
              title="About Us"
              links={[
                { text: "Factorbook Overview", href: "#" },
                { text: "Weng Lab", href: "#" },
                { text: "ENCODE Consortium", href: "#" },
                { text: "UMass Chan Medical School", href: "#" },
              ]}
            />
            <LinkSection
              title="Portals"
              links={[
                { text: "TFs in Humans", href: "#" },
                { text: "TFs in Mouse", href: "#" },
                { text: "Motif Catalog", href: "#" },
                { text: "Annotations", href: "#" },
              ]}
            />
            <LinkSection
              title="Resources"
              links={[{ text: "Downloads", href: "#" }]}
            />
          </div>
        </section>
      </div>
    </header>
    <hr className="shrink-0 self-stretch mt-11 h-px border border-solid bg-neutral-500 border-neutral-500 max-md:mt-10 max-md:max-w-full" />
    <footer className="flex gap-5 justify-between mt-11 w-full text-xs font-medium leading-4 text-white max-w-[1218px] max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
      <span>©Lorem Ipsum</span>
      <nav className="flex gap-5 text-right">
        <a href="#" tabIndex={0} className="text-white">
          Privacy & Policy
        </a>
        <a href="#" tabIndex={0} className="text-white">
          Terms & Conditions
        </a>
      </nav>
    </footer>
  </main>
);

export default Footer;
