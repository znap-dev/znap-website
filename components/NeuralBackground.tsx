"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DataPacket {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  delay: number;
  size: number;
  color: string;
}

const colors = [
  "rgba(99, 102, 241, 0.8)",   // indigo
  "rgba(139, 92, 246, 0.8)",   // violet
  "rgba(236, 72, 153, 0.8)",   // pink
  "rgba(59, 130, 246, 0.8)",   // blue
  "rgba(16, 185, 129, 0.8)",   // emerald
  "rgba(0, 255, 255, 0.8)",    // cyan
  "rgba(255, 0, 255, 0.8)",    // magenta
  "rgba(0, 255, 136, 0.8)",    // neon green
  "rgba(255, 107, 0, 0.8)",    // orange
  "rgba(255, 215, 0, 0.8)",    // gold
  "rgba(255, 69, 0, 0.8)",     // red-orange
  "rgba(0, 191, 255, 0.8)",    // deep sky blue
  "rgba(50, 205, 50, 0.8)",    // lime green
  "rgba(255, 20, 147, 0.8)",   // deep pink
  "rgba(138, 43, 226, 0.8)",   // blue violet
  "rgba(0, 250, 154, 0.8)",    // medium spring green
  "rgba(255, 105, 180, 0.8)",  // hot pink
  "rgba(127, 255, 212, 0.8)",  // aquamarine
  "rgba(255, 140, 0, 0.8)",    // dark orange
  "rgba(0, 206, 209, 0.8)",    // dark turquoise
  "rgba(186, 85, 211, 0.8)",   // medium orchid
];

export default function NeuralBackground() {
  const [packets, setPackets] = useState<DataPacket[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(true);

  // Track tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Generate random position
  const getRandomPosition = useCallback(() => {
    return {
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
    };
  }, [dimensions]);

  // Create new data packet
  const createPacket = useCallback((): DataPacket => {
    const start = getRandomPosition();
    const end = getRandomPosition();
    
    return {
      id: Date.now() + Math.random(),
      startX: start.x,
      startY: start.y,
      endX: end.x,
      endY: end.y,
      duration: 2 + Math.random() * 3, // 2-5 seconds
      delay: Math.random() * 0.5,
      size: 4 + Math.random() * 8, // 4-12px
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }, [getRandomPosition]);

  // Get screen dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Continuously create packets (only when tab is active)
  useEffect(() => {
    if (dimensions.width === 0 || !isVisible) return;

    // Initial packets
    const initialPackets = Array.from({ length: 2 }, () => createPacket());
    setPackets(initialPackets);

    // Add new packets
    const interval = setInterval(() => {
      setPackets((prev) => {
        // Max 4 packets
        if (prev.length >= 4) {
          return [...prev.slice(1), createPacket()];
        }
        return [...prev, createPacket()];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [dimensions, createPacket, isVisible]);

  // Remove packet when complete
  const removePacket = (id: number) => {
    setPackets((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <AnimatePresence>
        {packets.map((packet) => (
          <DataFlow
            key={packet.id}
            packet={packet}
            onComplete={() => removePacket(packet.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface DataFlowProps {
  packet: DataPacket;
  onComplete: () => void;
}

function DataFlow({ packet, onComplete }: DataFlowProps) {
  const { startX, startY, endX, endY, duration, delay, size, color } = packet;

  // Calculate line angle
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
  const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

  return (
    <>
      {/* Line (data path) */}
      <motion.div
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: [0, 0.3, 0.3, 0], pathLength: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: duration,
          delay: delay,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          left: startX,
          top: startY,
          width: distance,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${color.replace("0.8", "0.2")}, transparent)`,
          transformOrigin: "left center",
          transform: `rotate(${angle}deg)`,
        }}
      />

      {/* Data paketi (hareket eden nokta) */}
      <motion.div
        initial={{
          x: startX - size / 2,
          y: startY - size / 2,
          opacity: 0,
          scale: 0,
        }}
        animate={{
          x: [startX - size / 2, endX - size / 2],
          y: [startY - size / 2, endY - size / 2],
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1, 1, 0.5],
        }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          duration: duration,
          delay: delay,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        onAnimationComplete={onComplete}
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          filter: `blur(${size / 4}px)`,
          boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color.replace("0.8", "0.4")}`,
        }}
      />

      {/* Start point pulse */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 0.6, 0],
          scale: [0.5, 2, 2.5],
        }}
        transition={{
          duration: 1,
          delay: delay,
          ease: "easeOut",
        }}
        style={{
          position: "absolute",
          left: startX - 10,
          top: startY - 10,
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: `1px solid ${color}`,
          filter: "blur(2px)",
        }}
      />

      {/* End point pulse */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 0.6, 0],
          scale: [0.5, 2, 2.5],
        }}
        transition={{
          duration: 1,
          delay: delay + duration - 0.5,
          ease: "easeOut",
        }}
        style={{
          position: "absolute",
          left: endX - 10,
          top: endY - 10,
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: `1px solid ${color}`,
          filter: "blur(2px)",
        }}
      />
    </>
  );
}
