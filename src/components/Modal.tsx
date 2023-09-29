import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import { cn } from "../lib/utils";
interface ModalType {
  title: string;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
  isOpen: boolean;
  toggle: () => void;
  isBlur?: boolean;
  toggleBlur?: () => void;
  changeClose?: boolean;
}
const Modal = ({
  title,
  children,
  className,
  isOpen,
  toggle,
  isBlur,
  toggleBlur,
  titleClassName,
  changeClose = false,
}: ModalType) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={cn("relative z-50", className)}
        onClose={() => {
          toggle();
          // toggleBlur?.();
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={cn(
                  "mx-6 w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all md:mx-0 md:p-[52px]",
                  isBlur ? "blur-sm" : ""
                )}
              >
                <Dialog.Title
                  as="h3"
                  className="flex justify-between text-3xl font-medium leading-6 tracking-wide text-gray-900"
                >
                  <div className={` ${titleClassName}`}>{title}</div>

                  {!changeClose && (
                    <div className="text-black">
                      <Image
                        onClick={() => toggle()}
                        src="/icons/close.svg"
                        width={18}
                        height={18}
                        alt="Close"
                        className=" cursor-pointer"
                      />
                    </div>
                  )}
                </Dialog.Title>
                <div className="flex w-full justify-center gap-6">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
