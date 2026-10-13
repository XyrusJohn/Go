import { Clock3 } from "lucide-react";

const QueueDriverCard = ({ driver, position }) => {
  const { driverName, plateNumber, timeIn, dispatchNumber } = driver;

  return (
    <article className="group w-full min-w-0 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md">
      {/* QUEUE POSITION AND STATUS */}
      <div className="flex items-center justify-between gap-2">
        <span className="rounded bg-black px-2 py-1 font-mono text-[10px] font-bold text-white">
          #{String(position).padStart(2, "0")}
        </span>

        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600" />

          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">
            Waiting
          </span>
        </div>
      </div>

      {/* DRIVER INFORMATION */}
      <div className="mt-3 min-w-0">
        <h3 className="break-words text-[13px] font-extrabold tracking-tight text-black">
          {plateNumber}
        </h3>

        <p className="mt-1 break-words text-[11px] font-medium text-gray-600">
          {driverName}
        </p>
      </div>

      {/* FOOTER INFORMATION */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-1.5 border-t border-gray-100 pt-2.5">
        <div className="flex items-center gap-1 text-gray-500">
          <Clock3 size={12} strokeWidth={1.8} />

          <span className="font-mono text-[10px]">{timeIn}</span>
        </div>

        {dispatchNumber && (
          <span className="max-w-full break-all font-mono text-[9px] text-gray-400">
            {dispatchNumber}
          </span>
        )}
      </div>
    </article>
  );
};

export default QueueDriverCard;
