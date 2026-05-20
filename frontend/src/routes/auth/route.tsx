import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: () => (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_left,_var(--color-primary)_0%,_transparent_25%)]">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <span className="text-3xl font-black text-primary tracking-tighter">
            KINDY.
          </span>
        </div>
        <Outlet />
      </div>
    </div>
  ),
});
