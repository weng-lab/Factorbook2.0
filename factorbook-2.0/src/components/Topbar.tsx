import * as React from "react";

type NavItemProps = {
  title: string;
  href: string;
};

const NavItem: React.FC<NavItemProps> = ({ title, href }) => (
  <li className="px-3 py-2 my-auto text-base font-medium tracking-wide leading-7 text-slate-500 whitespace-nowrap hover:text-slate-700">
    <a href={href}>{title}</a>
  </li>
);

const navItems = [
  { title: "Home", href: "#" },
  { title: "About", href: "#" },
  { title: "Resources", href: "#" },
  { title: "Download", href: "#" },
];

const Topbar: React.FC = () => (
  <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
    <header className="flex justify-between items-center p-2.5 max-w-screen-xl mx-auto">
      <a href="#" className="flex flex-col">
        <span className="text-2xl font text-neutral-800 leading-none">
          factor
        </span>
        <span
          className="text-2xl font text-neutral-800 leading-none"
          style={{ marginLeft: "2.5rem" }} // Reduced margin
        >
          book
        </span>
      </a>
      <nav>
        <ul className="flex gap-5">
          {navItems.map((item) => (
            <NavItem key={item.title} title={item.title} href={item.href} />
          ))}
        </ul>
      </nav>
    </header>
  </div>
);

export default Topbar;
