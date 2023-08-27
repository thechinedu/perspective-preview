import { Header } from "@/app/components/Header";
import { Preview } from "@/app/components/Preview";
import { FunnelDataProvider } from "@/app/providers/FunnelDataProvider";

export const Home = () => {
  return (
    <FunnelDataProvider>
      <Header />

      <main className="h-full">
        <Preview />
      </main>
    </FunnelDataProvider>
  );
};
