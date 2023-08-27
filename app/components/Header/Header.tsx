"use client";

import { Upload } from "@/app/components/Upload";
import Image from "next/image";
import { useFunnelData } from "@/app/providers/FunnelDataProvider";

export const Header = () => {
  const { funnelData } = useFunnelData();

  return (
    <header>
      <nav className="flex justify-between items-center px-2 py-2">
        <Image alt="site logo" src="/logo.png" width={32} height={32} />

        {funnelData && <p className="md:ml-32">{funnelData.name}</p>}

        <Upload />
      </nav>
    </header>
  );
};
