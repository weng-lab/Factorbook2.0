"use client";

import "./globals.css";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import { ApolloWrapper } from "../../lib/apollo-wrapper";

const ClientThemeProvider = dynamic(
  () => import("../components/ClientThemeProvider"),
  { ssr: false }
);

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <ClientThemeProvider>
            <Topbar />
            {children}
            <Footer />
          </ClientThemeProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
