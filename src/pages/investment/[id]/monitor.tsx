import Link from "next/link";
import { useRouter } from "next/router";
import { investmentData } from "../../../data/Investments";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

interface PhaseProps {
  title: string;
  description: string;
}

interface TaskProps {
  phase: PhaseProps;
  status: "Doing" | "OnHold" | "Done";
  assets?: string[];
}

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
];

const Monitor = () => {
  const router = useRouter();
  const { id } = router.query;

  const [investment] = investmentData.filter(
    (i) => i.id.toString() === id?.toString()
  );
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal(e, phase: PhaseProps) {
    e.preventDefault();
    MoreInfoModal(phase);
    setIsOpen(true);
  }

  function MoreInfoModal({ title, description }: PhaseProps) {
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{description}</p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <h1 className="font-bold ">Monitoring {investment?.title}</h1>
        <h2 className="font-bold text-2xl">Tasks</h2>
        <ul>
          {tasks.map((task) => (
            <li className="flex justify-between" key={task.phase.title}>
              {task.status} - {task.phase.title}{" "}
              <Link href="#">
                <a onClick={(e) => openModal(e, task.phase)}>More info</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col mt-6">
        <h2 className="font-bold">All Phases</h2>
        {phases.map((phase) => (
          <div key={phase.title} className="text-slate-500">
            <span className="text-slate-800">{phase.title}:</span>{" "}
            {phase.description}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Monitor;
