import React from "react";

type GalleryPops = {
  className?: string;
};

const Gallery: React.FC<GalleryPops> = (props) => {
  return (
    <section className={props.className}>
      <h2 className="text-3xl font-serif mx-auto">Gallery</h2>
    </section>
  );
};

export default Gallery;
