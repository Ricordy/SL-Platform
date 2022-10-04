import { useRouter } from "next/router";
import Slider from "../../../components/Slider";
import { investmentData } from "../../../data/Investments";
import Link from "next/link";
import { AiOutlineLeft } from "react-icons/ai";

function MonitorDetail() {
  const router = useRouter();
  const { id, phase } = router.query;

  const [investment] = investmentData.filter(
    (i) => i.id.toString() === id?.toString()
  );
  return (
    <div>
      <h1>MonitorDetail {phase}</h1>
      <h3 className="font-bold">Remove and check every single part</h3>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus porro
        earum consequatur officiis minima ex ipsa eligendi, soluta animi! Ipsam
        quam voluptates modi sed maiores commodi incidunt facere tenetur natus!
      </p>
      <Slider />
      <Link href={`/investment/${id}/monitor`}>
        <a className="flex items-center border border-slate-400 mt-6 w-fit text-right rounded-md p-2">
          <AiOutlineLeft /> Go Back
        </a>
      </Link>
    </div>
  );
}

export default MonitorDetail;
