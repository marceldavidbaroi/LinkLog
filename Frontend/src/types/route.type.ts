import type { RouteObject } from "react-router-dom";
import type { ReactNode } from "react";

// Add optional layout to all RouteObjects
export type AppRouteObject = RouteObject & {
  layout?: (props: { children: ReactNode }) => JSX.Element;
};
