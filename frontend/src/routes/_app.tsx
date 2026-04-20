import { AppSidebar } from "#/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "#/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex h-screen">
      {/* Your Sidebar Component */}

      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
          </header>

          <main className="flex-1 p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>

      {/* The main content area where child routes render */}
    </div>
  );
}
