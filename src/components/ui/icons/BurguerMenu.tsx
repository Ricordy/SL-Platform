import { type IconProps } from "../../../@types/icon";
import { cn } from "../../../lib/utils";

export const BurguerMenu = ({ className }: IconProps) => {
  return (
    <svg
      width="48"
      height="26"
      viewBox="0 0 48 26"
      fill="none"
      className={cn("h-6 w-12 fill-white text-primaryGreen", className)}
    >
      <path d="M0 25.26H47.64V23.55H0V25.26ZM0 13.485H47.64V11.775H0V13.485ZM0 0V1.71H47.64V0H0Z" />
    </svg>
  );
};
