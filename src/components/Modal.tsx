import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode, useState } from "react";
import { classNames, cn } from "../lib/utils";
import Image from "next/image";
interface ModalType {
  title: string;
  children?: ReactNode;
  className?: string;
  isOpen: boolean;
  toggle: () => void;
  isBlur?: boolean;
  toggleBlur?: () => void;
}
const Modal = ({
  title,
  children,
  className,
  isOpen,
  toggle,
  isBlur,
  toggleBlur,
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
                className={classNames(
                  "w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-[52px] text-left align-middle shadow-xl transition-all",
                  isBlur ? "blur-sm" : ""
                )}
              >
                <Dialog.Title
                  as="h3"
                  className="text-3xl tracking-wide font-medium leading-6 text-gray-900 flex justify-between"
                >
                  {title}
                  <Image
                    onClick={() => toggle()}
                    src="/icons/close.svg"
                    width={18}
                    height={18}
                    alt="Close"
                    className=" cursor-pointer"
                  />
                </Dialog.Title>
                <div className="flex w-full gap-6 justify-center">
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
