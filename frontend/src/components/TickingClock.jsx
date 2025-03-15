import React, { useState, useEffect } from "react";

export function TickingClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondRotation = seconds * 6;
  const minuteRotation = minutes * 6 + seconds * 0.1;
  const hourRotation = hours * 30 + minutes * 0.5;

  return (
    <div className="relative w-32 h-32 rounded-full border-4 border-green-600 bg-white shadow-lg">
      <div
        className="absolute w-1.5 h-10 bg-green-700 left-1/2 top-1/2 origin-bottom"
        style={{
          transform: `translateX(-50%) translateY(-100%) rotate(${hourRotation}deg)`,
          transition: "transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44)",
        }}
      />

      <div
        className="absolute w-1 h-12 bg-green-600 left-1/2 top-1/2 origin-bottom"
        style={{
          transform: `translateX(-50%) translateY(-100%) rotate(${minuteRotation}deg)`,
          transition: "transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44)",
        }}
      />
      <div
        className="absolute w-0.5 h-14 bg-green-400 left-1/2 top-1/2 origin-bottom"
        style={{
          transform: `translateX(-50%) translateY(-100%) rotate(${secondRotation}deg)`,
          transition: "transform 0.2s cubic-bezier(0.4, 2.3, 0.55, 0.44)",
        }}
      />

      <div className="absolute w-3 h-3 bg-green-600 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
