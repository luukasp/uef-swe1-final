import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/parents/news")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/parents/parents/news"!</div>;
}
