import { NotFound } from "@/pages/404";
import { Router, dynamic } from "@kit/router";

// lazy load routes here
const componentMap = {
  "/": dynamic(() => import("@/pages/Landing")),
  "/search": dynamic(() => import("@/pages/Search")),
  "/images": dynamic(() => import("@/pages/Images")),
};

export function RouteLoader() {
  return <Router fallbackComponent={NotFound} paths={componentMap} />;
}
