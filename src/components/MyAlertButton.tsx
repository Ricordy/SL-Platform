import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { cn } from "~/lib/utils";
import { Button } from "./ui/Button";

type MyAlertProps = {
  triggerButtonLabel: string;
  triggerButtonClassname?: string;
  isTriggerDisabled?: boolean;
  alertTitle?: string;
  variant?: "default" | "outline";
  alertTitleClassname?: string;
  alertDescription?: string;
  alertDescriptionClassname?: string;
  cancelLabel?: string;
  cancelLabelClassname?: string;
  confirmLabel?: string;
  confirmLabelClassname?: string;
  confirmAction: (e: any) => void;
};
const MyAlertButton = (props: MyAlertProps) => {
  const {
    confirmAction,
    triggerButtonLabel,
    alertDescription,
    alertTitle,
    cancelLabel,
    confirmLabel,
    alertDescriptionClassname,
    alertTitleClassname,
    cancelLabelClassname,
    confirmLabelClassname,
    triggerButtonClassname,
    isTriggerDisabled,
    variant,
  } = props;
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className={cn("", triggerButtonClassname)}
            variant={variant}
            disabled={isTriggerDisabled ? isTriggerDisabled : false}
          >
            {triggerButtonLabel}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogPortal>
          <AlertDialogOverlay className=" fixed inset-0 z-50 bg-black/40" />
          <AlertDialogContent className="AlertDialogContent b-6 fixed left-1/2 top-1/2 z-50 w-[30vw] -translate-x-1/2 -translate-y-1/2 bg-white p-2">
            <AlertDialogTitle
              className={cn("AlertDialogTitle", alertTitleClassname)}
            >
              {alertTitle ? alertTitle : " Are you absolutely sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription
              className={cn(
                "AlertDialogDescription",
                alertDescriptionClassname
              )}
            >
              {alertDescription
                ? alertDescription
                : " This action cannot be undone. This will permanently delete your account and remove your data from our servers."}
            </AlertDialogDescription>
            <div
              style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}
            >
              <AlertDialogCancel asChild>
                <button className={cn(" ", cancelLabelClassname)}>
                  {cancelLabel ? cancelLabel : "Cancel"}
                </button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <button
                  className={cn(" ", confirmLabelClassname)}
                  onClick={confirmAction}
                >
                  {confirmLabel ? confirmLabel : "Confirm"}
                </button>
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </>
  );
};

export default MyAlertButton;
