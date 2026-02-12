"use client";

import { DemoBanner } from "@/components/demo/DemoBanner";
import { DemoProvider } from "@/components/demo/DemoProvider";
import { DemoSidebar } from "@/components/demo/DemoSidebar";
import { DemoModeProvider } from "@/lib/demo";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoModeProvider value={true}>
      <DemoProvider>
        <div className="flex flex-col h-screen">
          <DemoBanner />
          <div className="flex flex-1 overflow-hidden">
            <DemoSidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </DemoProvider>
    </DemoModeProvider>
  );
}
