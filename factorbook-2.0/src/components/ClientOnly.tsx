"use client";

import { useEffect, useState, ReactNode } from "react";

type ClientOnlyProps = {
  children: ReactNode;
};

const ClientOnly = ({ children }: ClientOnlyProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <>{children}</>;
};

export default ClientOnly;
