import React from "react";
import { View, Text, Dimensions } from "react-native";
import Svg, { Circle, Path, Text as SvgText } from "react-native-svg";
import { useTranslation } from "../utils/useTranslation";

interface CircularPhaseChartProps {
  currentDay: number; // 1-based day in cycle
  cycleLength: number;
  periodLength: number;
  currentPhase: "menstrual" | "follicular" | "ovulation" | "luteal";
  phaseMessage: string;
}

export default function CircularPhaseChart({
  currentDay,
  cycleLength,
  periodLength,
  currentPhase,
  phaseMessage,
}: CircularPhaseChartProps) {
  const { t } = useTranslation();

  // Smaller, compact circular chart
  const size = 240; // Slightly bigger size
  const strokeWidth = 24; // Slightly thicker ring
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const labelRadius = radius - strokeWidth / 2; // Position for phase label on the ring

  // Updated pastel colors as specified
  const phases = [
    {
      name: "menstrual",
      color: "#F7B2D9", // Soft pink
      startDay: 1,
      endDay: periodLength,
      label: t("menstrual"),
    },
    {
      name: "follicular",
      color: "#C7B0F8", // Lavender-purple
      startDay: periodLength + 1,
      endDay: Math.floor(cycleLength / 2) - 1,
      label: t("follicular"),
    },
    {
      name: "ovulation",
      color: "#9CF7D1", // Mint green
      startDay: Math.floor(cycleLength / 2),
      endDay: Math.floor(cycleLength / 2) + 1,
      label: t("ovulation"),
    },
    {
      name: "luteal",
      color: "#F7C8A5", // Peach
      startDay: Math.floor(cycleLength / 2) + 2,
      endDay: cycleLength,
      label: t("luteal"),
    },
  ];

  // Convert day to angle (starting from top, clockwise)
  const dayToAngle = (day: number) => {
    // Subtract 0.5 to position the dot at the start of the day, not the end
    return ((day - 0.5) / cycleLength) * 360 - 90; // -90 to start from top
  };

  // Create SVG path for an arc with smooth blending
  const createArc = (startAngle: number, endAngle: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  // Get phase for current day
  const getPhaseForDay = (day: number) => {
    return phases.find((p) => day >= p.startDay && day <= p.endDay);
  };

  // Calculate position for current day indicator dot
  const currentAngle = dayToAngle(currentDay);
  const currentRad = (currentAngle * Math.PI) / 180;
  const dotX = center + radius * Math.cos(currentRad);
  const dotY = center + radius * Math.sin(currentRad);
  const currentPhaseInfo = getPhaseForDay(currentDay);

  return (
    <View className="items-center">
      {/* SVG Circle Chart - No white background */}
      <Svg width={size} height={size}>
        {/* Phase arcs with smooth blending */}
        {phases.map((phase) => {
          const startAngle = dayToAngle(phase.startDay);
          const endAngle = dayToAngle(phase.endDay + 1);
          const path = createArc(startAngle, endAngle);

          return (
            <Path
              key={phase.name}
              d={path}
              stroke={phase.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="butt" // Smooth blending between phases
              opacity={0.95}
            />
          );
        })}

        {/* Current day indicator - just a dot */}
        <Circle
          cx={dotX}
          cy={dotY}
          r={8}
          fill="white"
          stroke={currentPhaseInfo?.color || "#F7B2D9"}
          strokeWidth={3}
        />
      </Svg>

      {/* Center content */}
      <View
        className="absolute items-center justify-center"
        style={{
          top: size / 2 - 35,
          width: size * 0.7,
        }}
      >
        <Text className="text-gray-400 text-xs font-bold mb-1.5 uppercase tracking-widest">
          TODAY
        </Text>
        <Text className="text-gray-900 text-3xl font-bold mb-1.5">
          {phases.find((p) => p.name === currentPhase)?.label}
        </Text>
        <Text className="text-pink-500 text-base font-semibold">
          Day {currentDay} / {cycleLength}
        </Text>
      </View>

      {/* Phase legend below - all in one row, centered, smaller size */}
      <View className="mt-6 w-full px-2">
        <View className="flex-row justify-center items-center">
          {phases.map((phase, index) => (
            <View key={phase.name} className="flex-row items-center mx-2">
              <View
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: phase.color }}
              />
              <Text className="text-gray-700 text-xs font-medium">
                {phase.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
