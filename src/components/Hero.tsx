import React from "react";

type HeroPops = {
  className?: string;
};

const Hero: React.FC<HeroPops> = (props) => {
  return (
    <section className={props.className}>
      <h2 className="text-3xl font-serif text-slate-500">
        &quot;It is in the solitude that legends are born.&quot;
      </h2>
    </section>
  );
};

export default Hero;
