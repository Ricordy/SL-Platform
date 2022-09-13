import Head from "next/head";
import type { NextPage } from "next";
import graphics from "../../public/mercedes-graphics.png";
import Image from "next/image";

const Mercedes: NextPage = () => {
  return (
    <>
      <Head>
        <title>Something Legendary | Mercedes-benz 280sl Pagoda 1969</title>
      </Head>

      <main className="container mx-auto flex flex-col max-w-4xl p-4">
        <Image src={graphics} alt="Mercedes car" />
        <div className="text">
          <h2>Model description</h2>
          Mercedes-Benz introduced the 280SL less than a year after the 250SL
          arrived on the scene, and closed out the “pagoda” SL line in 1971
          after nearly 24,000 were built. The 280 was very similar, to its
          predecessor, using clean, elegant lines, intelligent placement of the
          wheels in proportion to the rest of the design, and a tall,
          &quot;pagoda&quot; removable hard top that allowed for ease of ingress
          and egress. Like the other W113 cars, the 280 utilized a monocoque
          chassis, with front suspension courtesy of coils and wishbones, while
          the rear incorporated a single-pivot swing axle and transverse springs
          set up to compensate for camber. Four-wheel discs provided braking
          power. The engine was a 2.8-liter, overhead-cam, inline-6. Bosch fuel
          injection was incorporated as well, and horsepower on the sport tourer
          was rated at 180 – a fair bit more than the 230 and 250 had access to.
          Torque was also higher at 177 ft-lb. A 4-speed manual transmission was
          standard, though a new 4-speed automatic transmission was optional, as
          was a ZF 5-speed manual. Cabin refinement was high, with acres of
          leather, plush, supportive seats, big, readable gauges, Blaupunkt
          radios, and a quality of craftsmanship throughout, including the soft
          top, which disappeared easily and unobtrusively when not in use. New
          safety features included an energy-absorbing steering column and
          three-point seatbelts, while side marker lights are the biggest
          external visual difference between the 250 and 280. By the time the
          280SL gave way to the next generation SL, designated the R107, it had
          firmly established itself as one of the finest cars to come from the
          Stuttgart firm. With timeless, graceful styling, spirited performance
          and handling, and build quality and reliability second to none, the SL
          series of cars built from 1963 to 1971 are solid collectibles with
          plenty to offer.
        </div>
        <div className="text">Body styles 2dr Convertible</div>
        <div className="text">Engine types 6-cyl. 2778cc/180hp Bosch FI</div>
        <div className="text">
          <h2>Equipment</h2>
          <h3> Additional Info</h3>
          <p> Vehicle Length: 169 in</p>
          <p> Wheelbase - Inches: 94.5 in</p>
        </div>
      </main>
    </>
  );
};

export default Mercedes;
