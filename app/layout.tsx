import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import ApiKeyModal from "@/components/modals/ApiKeyModal";
import AdaptGoalModal from "@/components/modals/AdaptGoalModal";
import NodeDetailDrawer from "@/components/drawer/NodeDetailDrawer";
import AITutorDrawer from "@/components/drawer/AITutorDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Antigravity Path | AI-Powered Personalized Learning Roadmap Recommender",
  description:
    "Generate, visualize, and dynamically adapt Directed Acyclic Graph (DAG) learning roadmaps powered by Google Gemini AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-[#030712] text-slate-100 flex flex-col`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        
        {/* Global Modals & Drawers */}
        <ApiKeyModal />
        <AdaptGoalModal />
        <NodeDetailDrawer />
        <AITutorDrawer />
      </body>
    </html>
  );
}
