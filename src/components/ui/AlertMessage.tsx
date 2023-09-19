import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

const AlertMessage = ({
  message,
  bgColor,
}: {
  message: string;
  bgColor?: string;
}) => {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const hasClosedAlert = localStorage.getItem("hasClosedAlert");

    if (hasClosedAlert) {
      setShowAlert(false);
    }
  }, []);

  const handleCloseAlert = () => {
    localStorage.setItem("hasClosedAlert", "true");
    setShowAlert(false);
  };

  return (
    <>
      {showAlert ? (
        <div
          className={cn(
            "relative mx-auto w-full rounded border-0 bg-primaryGold px-6 py-4 text-white lg:hidden",
            bgColor ?? ""
          )}
        >
          <div className="w-full max-w-screen-lg">
            <span className="mr-8 inline-block align-middle">{message}</span>
            <button
              className="absolute right-0 top-0 mr-6 mt-4 bg-transparent text-2xl font-semibold leading-none outline-none focus:outline-none"
              onClick={() => handleCloseAlert()}
            >
              <span>×</span>
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AlertMessage;
