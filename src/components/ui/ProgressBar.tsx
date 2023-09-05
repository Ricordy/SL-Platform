import { cn } from "../../lib/utils";

interface ProgressBarProps {
  progress: number;
  showProgressInsideBar?: boolean;
  color?: string;
  label?: false;
}
const ProgressBar = ({
  progress,
  showProgressInsideBar = false,
  color = "bg-gray-600",
}: ProgressBarProps) => {
  const barWidthFormatted = `${progress}%`;
  return (
    <div className="w-full text-xs bg-gray-200 rounded-full">
      {progress !== 0 ? (
        <div
          className={cn(
            "font-medium text-black-100 text-center h-1.5 leading-none rounded-full",
            color ?? ""
          )}
          style={{ width: progress > 100 ? "100%" : barWidthFormatted }}
        >
          {showProgressInsideBar && (
            <div className="w-full text-center text-gray-200">
              {barWidthFormatted}
            </div>
          )}
        </div>
      ) : (
        <div className="h-2"></div>
      )}
    </div>
  );
};

export default ProgressBar;
