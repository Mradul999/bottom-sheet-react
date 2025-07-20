import React from "react";
import { useEffect, useState } from "react";

const BottomSheet = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(window.innerHeight);
  const [velocity, setVelocity] = useState(0);
  const snapPoints = [
    window.innerHeight * 0.65,
    window.innerHeight * 0.5,
    window.innerHeight * 0.15,
  ];

  const animateTo = (target) => {
    const damping = 0.8;
    const stiffnes = 0.12;
    let pos = currentY;
    let vel = velocity;

    const step = () => {
      const displacement = target - pos;
      const springForce = stiffnes * displacement;
      vel = damping * (vel + springForce);
      pos += vel;
      setCurrentY(pos);

      if (Math.abs(vel) > 0.5 || Math.abs(displacement) > 0.5) {
        requestAnimationFrame(step);
      } else {
        setCurrentY(target);
      }
    };
    requestAnimationFrame(step);
  };

  const handleOpen = () => {
    animateTo(snapPoints[0]);
  };

  const snapToClosest = () => {
    const closest = snapPoints.reduce((prev, curr) => {
      return Math.abs(curr - currentY) < Math.abs(prev - currentY)
        ? curr
        : prev;
    });
    animateTo(closest);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const delta = e.clientY - startY;
    setStartY(e.clientY);
    setCurrentY((prev) => Math.max(snapPoints[2], prev + delta));
    setVelocity(delta);
  };
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    snapToClosest();
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientY - startY;
    setStartY(e.touches[0].clientY);
    setCurrentY((prev) => Math.max(snapPoints[2], prev + delta));
    setVelocity(delta);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    snapToClosest();
  };
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startY, currentY]);

  useEffect(() => {
    setCurrentY(window.innerHeight + 100);
  }, []);

  return (
    <>
      <button
        onClick={handleOpen}
        className="mt-6 px-6 py-2 bg-green-500 text-white font-semibold hover:bg-green-600 transition-all rounded-lg text-base"
      >
        open bottom sheet
      </button>
      <div
        className="fixed left-0 right-0 bottom-0   h-screen bg-white rounded-t-2xl shadow-xl z-50 touch-none"
        style={{
          transform: `translateY(${currentY}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="h-10 flex justify-center items-center cursor-grab">
          <div className="w-10 h-1.5 bg-gray-400 rounded-full"></div>
        </div>

        <div className="p-4 overflow-y-auto h-full">
          {/* <h2 className="text-xl font-semibold mb-2">Bottom Sheet Content</h2> */}

          <div className="max-h-full mt-4 bg-gray-100 rounded-lg p-2 md:text-[25px] text-[20px]">
            Hi, my name is Mradul Verma. I'm currently pursuing a B.Tech in
            Computer Science from GLA University, Mathura. I’m a full-stack
            developer with hands-on experience in building scalable web
            applications using technologies like React.js, Node.js, Express,
            MongoDB,tailwindCSS.
            <span className="font-semibold">
              {" "}
              drag up to know more about me{" "}
            </span>
            <br /> <br />
            Some of my recent projects include{" "}
            <span className="font-semibold">Smart Strokes</span> an AI powered
            typing platform using google gemini api. User can give there own
            personalized tests based on the previous mistakes.
            <span className="font-semibold"> drag up one last time </span>
            <br></br>
            <br />I have also build{" "}
            <span className="font-semibold">
              College anonymous platform
            </span>{" "}
            which allow GLA students to share their thoughts visually. I have
            implemented content moderation using google cloud apis.
            <br />
            <span className="text-base font-semibold text-green-400">
              Thank you for reading❤️
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomSheet;
