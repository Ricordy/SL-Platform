import React from "react";

import Image from "next/image";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const images = [{ url: "/slider/car1.jpg" }, { url: "/slider/car2.jpg" }];
interface SliderProps {
  className?: string;
}
const Slider = (props: SliderProps) => {
  return (
    <section className={props.className}>
      <div className="simpleSlider flex justify-center items-center">
        <Carousel showStatus={false} showThumbs={false}>
          {images.map((image, idx) => (
            <div key={idx}>
              <Image src={image.url} width={960} height={400} alt="car" />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default Slider;
