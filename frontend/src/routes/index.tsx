import { Feature108 } from "#/components/blocks/shadcnblocks-com-feature108";
import { hideNavbar, showNavbar } from "#/lib/navbar_store";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Layout, Pointer, Zap, Globe, ShieldUser } from "lucide-react";
import { useEffect } from "react";
import ThemeToggle from "#/components/ThemeToggle";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/")({ component: App });

const demoData = {
  badge: "shadcnblocks.com",
  heading: "A Collection of Components Built With Shadcn & Tailwind",
  description: "Join us to build flawless web solutions.",
  tabs: [
    {
      value: "tab-1",
      icon: <Zap className="h-auto w-4 shrink-0" />,
      label: "Boost Revenue",
      content: {
        badge: "Modern Tactics",
        title: "Make your site a true standout.",
        description:
          "Discover new web trends that help you craft sleek, highly functional sites that drive traffic and convert leads into customers.",
        buttonText: "See Plans",
        imageSrc:
          "https://www.shadcnblocks.com/images/block/placeholder-dark-1.svg",
        imageAlt: "placeholder",
      },
    },
    {
      value: "tab-2",
      icon: <Pointer className="h-auto w-4 shrink-0" />,
      label: "Higher Engagement",
      content: {
        badge: "Expert Features",
        title: "Boost your site with top-tier design.",
        description:
          "Use stellar design to easily engage users and strengthen their loyalty. Create a seamless experience that keeps them coming back for more.",
        buttonText: "See Tools",
        imageSrc:
          "https://www.shadcnblocks.com/images/block/placeholder-dark-2.svg",
        imageAlt: "placeholder",
      },
    },
    {
      value: "tab-3",
      icon: <Layout className="h-auto w-4 shrink-0" />,
      label: "Stunning Layouts",
      content: {
        badge: "Elite Solutions",
        title: "Build an advanced web experience.",
        description:
          "Lift your brand with modern tech that grabs attention and drives action. Create a digital experience that stands out from the crowd.",
        buttonText: "See Options",
        imageSrc:
          "https://www.shadcnblocks.com/images/block/placeholder-dark-3.svg",
        imageAlt: "placeholder",
      },
    },
  ],
};
function App() {
  const navigate = useNavigate();
  useEffect(() => {
    hideNavbar();
    return () => {
      showNavbar();
    };
  }, []);

  return (
    <main className="page-wrap relative px-4 pb-8 pt-14">
      {/* Top right corner container for language + theme controls */}
      <div className="absolute right-4 top-4 z-50 flex items-center gap-2">
        <button
          type="button"
          title="Change language (placeholder)"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </button>
        <ThemeToggle />

        <Button variant="outline" onClick={() => navigate({ to: "/auth" })}>
          <ShieldUser /> Authentificate
        </Button>
      </div>

      <Feature108 {...demoData} />
    </main>
  );
}
