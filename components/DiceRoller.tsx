"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Dice } from "@/components/Dice";
import { Dices } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export function DiceRoller() {
  const [rolling, setRolling] = useState(false);
  const [diceCount, setDiceCount] = useState(1);
  const [results, setResults] = useState([1]);

  const handleRoll = () => {
    if (rolling) return;

    setRolling(true);
    const newResults = Array(diceCount)
      .fill(0)
      .map(() => Math.floor(Math.random() * 6) + 1);
    setResults(newResults);

    setTimeout(() => {
      setRolling(false);
    }, 1000);
  };

  const handleDiceCountChange = (value: [number]) => {
    const newCount = value[0];
    setDiceCount(newCount);
    setResults((prev) => {
      if (newCount > prev.length) {
        return [...prev, ...Array(newCount - prev.length).fill(1)];
      }
      return prev.slice(0, newCount);
    });
  };

  const getGridCols = (count: number) => {
    if (count <= 1) return 1;
    if (count <= 4) return 2;
    if (count <= 9) return 3;
    return 4;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-2">
        <Dices className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Multi-Dice Roller</h2>
      </div>

      <div className="w-full max-w-md flex flex-col gap-2">
        <label className="text-sm font-medium">
          Number of Dice: {diceCount}
        </label>
        <Slider
          value={[diceCount]}
          onValueChange={handleDiceCountChange}
          min={1}
          max={12}
          step={1}
          className="w-full"
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          size="lg"
          onClick={handleRoll}
          disabled={rolling}
          className="min-w-40"
        >
          {rolling ? "Rolling..." : "Roll Dice"}
        </Button>
        <div className="text-lg font-semibold flex flex-col items-center gap-2">
          <p>Individual Results: {results.join(", ")}</p>
          <p>Total: {results.reduce((a, b) => a + b, 0)}</p>
        </div>
      </div>

      <div
        className="w-full h-4/5 grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${getGridCols(
            diceCount
          )}, minmax(0, 1fr))`,
        }}
      >
        {Array(diceCount)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="aspect-square bg-transparent rounded-lg overflow-hidden"
            >
              <Canvas
                camera={{ position: [0, 2, 5], fov: 40 }}
                className="w-full h-full"
                shadows
              >
                <ambientLight intensity={0.7} />
                <pointLight
                  position={[10, 10, 10]}
                  intensity={0.8}
                  castShadow
                />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <directionalLight
                  position={[5, 5, 5]}
                  intensity={0.5}
                  castShadow
                />
                <Dice rolling={rolling} result={results[index]} />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 2}
                />
              </Canvas>
            </div>
          ))}
      </div>
    </div>
  );
}
