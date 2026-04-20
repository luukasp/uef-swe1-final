import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/parents")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/parents"!</div>;
}
