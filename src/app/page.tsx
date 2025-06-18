import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2FE] to-[#FFFFFF] dark:bg-gradient-to-br dark:from-[#1E293B] dark:to-[#4C1D95] p-4 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <Header />
      </div>
    </div>
  );
}
