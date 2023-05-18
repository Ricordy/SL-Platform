import Link from "next/link";
import { useRouter } from "next/router";
import { investmentData } from "../../../data/Investments";
import { FiPlusCircle } from "react-icons/fi";

interface PhaseProps {
  title: string;
  description: string;
}

interface TaskProps {
  phase: PhaseProps;
  status: "Doing" | "OnHold" | "Done";
  assets?: string[];
}

// Done: preenchido
// onhold
// e doing (media): não

const phases: PhaseProps[] = [
  {
    title: "Disassembling and Inspection",
    description: "Remove and check every single part",
  },
  {
    title: "Blasting",
    description: "Body and parts cleaning",
  },
  {
    title: "Bodywork",
    description: "Cut, welding and shaping",
  },
  {
    title: "Chassis",
    description:
      "Mechanical systems are restored like suspension, brakes, steering",
  },
  {
    title: "Mechanics",
    description: "Engine and Gearbox overhaul",
  },
  {
    title: "Interiors",
    description: "Inspect, repair and change interior materials",
  },
  {
    title: "Paint",
    description: "Prep, paint and polishing",
  },
  {
    title: "Assembling",
    description: "Putting everything back together,mechanics on body",
  },
  {
    title: "Electrics",
    description: "Elements repaired and reconnected",
  },
  {
    title: "Tests and Tuning",
    description: "Road and details, everything is checked",
  },
  {
    title: "Finishing",
    description: "Preparation to sell",
  },
];

const tasks: TaskProps[] = [
  {
    phase: phases[0],
    status: "Done",
  },
  {
    phase: phases[1],
    status: "Done",
  },
  {
    phase: phases[2],
    status: "Doing",
  },
  {
    phase: phases[3],
    status: "Doing",
  },
  {
    phase: phases[4],
    status: "OnHold",
  },
  {
    phase: phases[5],
    status: "OnHold",
  },
];

const Monitor = () => {
  const router = useRouter();
  const { id } = router.query;

  const [investment] = investmentData.filter(
    (i) => i.id.toString() === id?.toString()
  );

  return (
    <div className="flex flex-col px-6 lg:px-3 mt-16 md:mt-0 w-full">
      <div className="flex flex-col">
        <h1 className="font-bold ">Monitoring {investment?.title}</h1>
        <h2 className="font-bold text-2xl">Tasks</h2>
        <ul className="flex flex-col gap-3">
          {tasks.map((task, idx) => (
            <li className="flex justify-between" key={task.phase.title}>
              {task.status} - {task.phase.title}{" "}
              {task.status === "Done" && (
                <Link href={`/investment/${id}/monitor-detail/?phase=${idx}`}>
                  <a className="flex items-center gap-2 rounded-md border border-transparent bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2">
                    More info <FiPlusCircle />
                  </a>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Monitor;
