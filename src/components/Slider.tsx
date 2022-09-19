import React from "react";

import Image from "next/image";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const images = [{ url: "/slider/car1.jpg" }, { url: "/slider/car2.jpg" }];

const Slider = () => {
  return (
    <section className="flex flex-col">
      <div className="simpleSlider flex justify-center items-center">
        <Carousel>
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
