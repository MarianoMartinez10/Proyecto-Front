import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

const commonProps = {
  strokeWidth: "1.5",
  shapeRendering: "crispEdges" as const,
};

export const IconPlaystation = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...commonProps}
    {...props}
  >
    <path d="M9 13.5h6" />
    <path d="M12 10.5v6" />
    <path d="M6 18.5l-3 2v-11l3 2" />
    <path d="M18 5.5l3-2v11l-3-2" />
    <path d="M9 10.5c-1-1-1-2.5 0-3.5s2.5-1.5 3.5 0" />
    <path d="M15 13.5c1 1 1 2.5 0 3.5s-2.5 1.5-3.5 0" />
  </svg>
);

export const IconXbox = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...commonProps}
    {...props}
  >
    <path d="M4.5 19.5l15-15" />
    <path d="M4.5 4.5l15 15" />
    <path d="M9.5 3.5c-2.8 2.8-2.8 7.2 0 10" />
    <path d="M14.5 20.5c2.8-2.8 2.8-7.2 0-10" />
  </svg>
);

export const IconNintendo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...commonProps}
    {...props}
  >
    <path d="M6 4h3v16H6z" />
    <path d="M15 4h3v16h-3z" />
    <path d="M9 10h6" />
    <path d="M9 14h6" />
  </svg>
);

export const IconPC = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...commonProps}
    {...props}
  >
    <rect x="3" y="3" width="18" height="14" rx="1" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
  </svg>
);

export function PlatformIcon({ platformId, className }: { platformId: string; className?: string }) {
  const iconProps = { className: cn("h-4 w-4", className) };
  switch (platformId) {
    case 'ps5':
      return <IconPlaystation {...iconProps} />;
    case 'xbox':
      return <IconXbox {...iconProps} />;
    case 'switch':
      return <IconNintendo {...iconProps} />;
    case 'pc':
      return <IconPC {...iconProps} />;
    default:
      return null;
  }
}
