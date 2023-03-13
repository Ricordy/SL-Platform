import { useState } from "react";

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBlur, setIsBlur] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const toggleBlur = () => {
    setIsBlur(!isBlur);
  };
  return {
    isOpen,
    toggle,
    isBlur,
    toggleBlur,
  };
};

export default useModal;
