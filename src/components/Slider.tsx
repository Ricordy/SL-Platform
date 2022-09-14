import React from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

const images = [{ url: "/slider/car1.png" }, { url: "/slider/car2.png" }];

const Slider = () => {
  return (
    <section className="flex flex-col">
      <div className="simpleSlider flex justify-center items-center h-60">
        <MdKeyboardArrowLeft />
        <h2 className="text-3xl mx-auto ">Slider</h2>
        <MdKeyboardArrowRight />
      </div>
    </section>
  );
};

export default Slider;
