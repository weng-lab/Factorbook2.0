import "./globals.css";
import { ReactNode } from "react";
import Topbar from "@/components/topbar";
import Footer from "@/components/footer";
import { ApolloWrapper } from "../../lib/apollo-wrapper";
import ChatComponenet from "@/components/factorchat/ChatComponent";
import { Hind } from 'next/font/google'
import ClientThemeProvider from "@/components/clientthemeprovider";
import { Metadata } from "next";

type LayoutProps = {
  children: ReactNode;
};

const hind = Hind({
  weight: "400",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Factorbook",
  description: 
    `Factorbook is a resource for human and mouse transcription factors, 
    focusing on their binding specificities and regulatory roles in gene 
    expression across cell types. Factorbook integrates public data, 
    especially ENCODE, to provide a wide-ranging motif catalog.`,
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: '/images/iconLight.png',
        href: '/images/iconLight.png'
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: '/images/iconDark.png',
        href: '/images/iconDark.png'
      }
    ]
  }
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className={hind.className}>
      <body>
        <ApolloWrapper>
          <ClientThemeProvider>
            <Topbar />
            {children}
            <Footer />
            <ChatComponenet />
          </ClientThemeProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
