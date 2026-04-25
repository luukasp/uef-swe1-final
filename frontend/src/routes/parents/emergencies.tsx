import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/parents/emergencies")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/parents/parents/emergencies"!</div>;
}
