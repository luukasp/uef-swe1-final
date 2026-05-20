import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/parents/schedule')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/parents/schedule"!</div>
}
