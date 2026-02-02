"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

interface ScrambleTextProps {
  text: string;
  className?: string;
  as?: "h1" | "p" | "span";
  delay?: number;
  duration?: number;
  characterSet?: string;
  scrambleCount?: number;
}

const defaultCharacterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*<>[]{}=/\\|~";

export default function ScrambleText({
  text,
  className = "",
  as: Tag = "span",
  delay = 0,
  duration = 2,
  characterSet = defaultCharacterSet,
  scrambleCount = 8,
}: ScrambleTextProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [scrambleChars, setScrambleChars] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState(false);

  const speed = useMemo(() => (duration / text.length) * 1000, [duration, text.length]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsStarted(true);
      let currentIndex = 0;

      const revealInterval = setInterval(() => {
        currentIndex++;
        setRevealedCount(currentIndex);

        if (currentIndex >= text.length) {
          clearInterval(revealInterval);
        }
      }, speed);

      const scrambleInterval = setInterval(() => {
        setScrambleChars(
          text.split("").map(() => 
            characterSet[Math.floor(Math.random() * characterSet.length)]
          )
        );
      }, 35);

      return () => {
        clearInterval(revealInterval);
        clearInterval(scrambleInterval);
      };
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay, speed, characterSet]);

  return (
    <Tag className={className} style={{ display: "inline-flex" }}>
      {text.split("").map((char, index) => {
        const isRevealed = index < revealedCount;
        const isSpace = char === " ";
        const distanceFromRevealed = index - revealedCount;
        const isScrambling = !isRevealed && distanceFromRevealed < scrambleCount;

        // Show placeholder before animation starts (prevent layout shift)
        if (!isStarted) {
          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                whiteSpace: isSpace ? "pre" : "normal",
                opacity: 0,
              }}
            >
              {char}
            </span>
          );
        }

        // Hide if outside visible range
        if (!isRevealed && !isScrambling) {
          return null;
        }

        // Gradient blur and opacity based on distance (more blur and fade as distance increases)
        const blurAmount = isRevealed ? 0 : Math.min(16, 3 + distanceFromRevealed * 2.5);
        const opacityAmount = isRevealed ? 1 : Math.max(0.1, 0.8 - distanceFromRevealed * 0.12);
        const scaleAmount = isRevealed ? 1 : Math.max(0.85, 1 - distanceFromRevealed * 0.025);

        const displayChar = isRevealed 
          ? char 
          : isSpace 
            ? " " 
            : scrambleChars[index] || characterSet[0];

        return (
          <motion.span
            key={index}
            initial={{ 
              filter: "blur(16px)", 
              opacity: 0,
              scale: 0.8,
              y: 5,
            }}
            animate={{
              filter: `blur(${blurAmount}px)`,
              opacity: opacityAmount,
              scale: scaleAmount,
              y: isRevealed ? 0 : 2,
            }}
            transition={{
              duration: isRevealed ? 0.3 : 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              display: "inline-block",
              whiteSpace: isSpace ? "pre" : "normal",
              willChange: "filter, opacity, transform",
            }}
          >
            {displayChar}
          </motion.span>
        );
      })}
    </Tag>
  );
}
