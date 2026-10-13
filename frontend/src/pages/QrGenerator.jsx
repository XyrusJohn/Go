import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone } from "lucide-react";
import QueueDriverCard from "../components/QueueDriverCard";

const TRUCK_TYPES = ["AUV", "4W", "6W", "10W", "20F", "40F"];

// Temporary sample data for the queue dashboard.
const MOCK_QUEUES = {
  AUV: [
    {
      id: 1,
      driverName: "Juan Dela Cruz",
      plateNumber: "NAA 1234",
      timeIn: "08:42 AM",
      dispatchNumber: "DISP-1001",
    },
    {
      id: 2,
      driverName: "Pedro Santos",
      plateNumber: "ABC 5678",
      timeIn: "08:55 AM",
      dispatchNumber: "DISP-1002",
    },
  ],

  "4W": [
    {
      id: 3,
      driverName: "Mark Reyes",
      plateNumber: "NBA 2345",
      timeIn: "09:05 AM",
      dispatchNumber: "DISP-1003",
    },
    {
      id: 4,
      driverName: "Carlo Mendoza",
      plateNumber: "NCA 7890",
      timeIn: "09:12 AM",
      dispatchNumber: "DISP-1004",
    },
  ],

  "6W": [
    {
      id: 5,
      driverName: "Robert Garcia",
      plateNumber: "NDA 3456",
      timeIn: "08:35 AM",
      dispatchNumber: "DISP-1005",
    },
    {
      id: 6,
      driverName: "Michael Cruz",
      plateNumber: "NEA 6789",
      timeIn: "08:48 AM",
      dispatchNumber: "DISP-1006",
    },
    {
      id: 7,
      driverName: "Anthony Ramos",
      plateNumber: "NFA 1122",
      timeIn: "09:10 AM",
      dispatchNumber: "DISP-1007",
    },
  ],

  "10W": [
    {
      id: 8,
      driverName: "Daniel Flores",
      plateNumber: "NGA 4567",
      timeIn: "09:20 AM",
      dispatchNumber: "DISP-1008",
    },
  ],

  "20F": [
    {
      id: 9,
      driverName: "Jose Navarro",
      plateNumber: "NHA 8901",
      timeIn: "09:25 AM",
      dispatchNumber: "DISP-1009",
    },
  ],

  "40F": [
    {
      id: 10,
      driverName: "Rafael Bautista",
      plateNumber: "NJA 2468",
      timeIn: "09:32 AM",
      dispatchNumber: "DISP-1010",
    },
  ],
};

const QrGenerator = () => {
  const [qrValue] = useState("SYS-237BF968D287684B4E1EDED7");
  const [timeLeft, setTimeLeft] = useState(60);

  // Mock data until connected to the backend.
  const [activeQueues] = useState(MOCK_QUEUES);

  // Reset the countdown every 60 seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen w-full flex-col overflow-y-auto bg-white font-sans text-black lg:flex-row lg:overflow-hidden">
      {/* LEFT PANEL - QR CODE */}
      <section className="flex w-full shrink-0 flex-col items-center border-b border-gray-200 bg-white px-6 pb-10 pt-12 sm:px-8 lg:h-full lg:w-[28.35%] lg:min-w-[370px] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:pt-[15vh]">
        {/* QR CONTENT */}
        <div className="flex w-full max-w-[440px] flex-col items-center">
          {/* Title */}
          <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.27em] text-gray-500">
            Scan to start queue
          </p>

          {/* QR FRAME */}
          <div className="relative w-full">
            {/* Corner - Top Left */}
            <span className="absolute -left-1 -top-1 h-5 w-5 rounded-tl-[5px] border-l-[3px] border-t-[3px] border-black" />

            {/* Corner - Top Right */}
            <span className="absolute -right-1 -top-1 h-5 w-5 rounded-tr-[5px] border-r-[3px] border-t-[3px] border-black" />

            {/* Corner - Bottom Left */}
            <span className="absolute -bottom-1 -left-1 h-5 w-5 rounded-bl-[5px] border-b-[3px] border-l-[3px] border-black" />

            {/* Corner - Bottom Right */}
            <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-br-[5px] border-b-[3px] border-r-[3px] border-black" />

            {/* QR Code */}
            <div className="rounded-md bg-white p-3">
              <QRCodeSVG
                value={qrValue}
                size={420}
                level="H"
                includeMargin={false}
                bgColor="#FFFFFF"
                fgColor="#000000"
                className="block h-auto w-full"
              />
            </div>
          </div>

          {/* INSTRUCTION PANEL */}
          <div className="mt-3 flex w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <Smartphone size={15} strokeWidth={2} className="text-black" />

              <p className="text-[13px] font-semibold text-black">
                Point the <span className="font-bold">camera</span> on QR
              </p>
            </div>

            <p className="mt-1 text-[10px] text-gray-500">
              Trip Registration · Press Register
            </p>
          </div>

          {/* AUTH TOKEN */}
          <div className="mt-3 flex flex-col items-center">
            <div className="max-w-full break-all rounded-md border border-gray-300 bg-gray-50 px-3 py-1 text-center font-mono text-[10px] font-bold tracking-[0.12em] text-black">
              {qrValue}
            </div>

            <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-gray-400">
              Auth Token
            </span>

            {/* Countdown */}
            <div className="mt-3 flex items-center gap-1 text-[11px] text-gray-500">
              <span>Auto-refresh every</span>

              <span className="font-bold tabular-nums text-black">
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT PANEL - LIVE TRUCK QUEUE */}
      <section className="min-h-[420px] min-w-0 flex-1 overflow-x-auto bg-white lg:min-h-0">
        <div className="grid h-full min-w-[900px] grid-cols-6 xl:min-w-0">
          {TRUCK_TYPES.map((type) => {
            const queue = activeQueues[type] || [];

            return (
              <div
                key={type}
                className="flex min-w-0 flex-col border-r border-gray-200 bg-white last:border-r-0"
              >
                {/* COLUMN HEADER */}
                <div className="flex h-[45px] shrink-0 items-center justify-between border-b border-gray-200 px-3">
                  <h2 className="text-[17px] font-extrabold tracking-tight text-black">
                    {type}
                  </h2>

                  {/* Queue Count */}
                  <span className="flex h-[18px] min-w-[23px] items-center justify-center rounded-full bg-gray-100 px-1.5 font-mono text-[10px] font-bold text-gray-500">
                    {queue.length}
                  </span>
                </div>

                {/* COLUMN BODY */}
                <div className="min-h-0 flex-1 overflow-y-auto">
                  {queue.length === 0 ? (
                    <div className="pt-7 text-center">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-gray-400">
                        NO DRIVER
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 p-2">
                      {queue.map((driver, index) => (
                        <QueueDriverCard
                          key={driver.id}
                          driver={driver}
                          position={index + 1}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default QrGenerator;
