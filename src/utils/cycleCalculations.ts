import {
  startOfDay,
  differenceInDays,
  addDays,
  parseISO,
  isAfter,
  isBefore,
  isEqual,
  isWithinInterval,
} from "date-fns";
import { Cycle, Phase, PhaseInfo } from "../types/venus";

/**
 * Get the most recent cycle start date
 */
export const getLastPeriodStart = (cycles: Cycle[]): Date | null => {
  if (cycles.length === 0) return null;
  const sortedCycles = [...cycles].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  return parseISO(sortedCycles[0].startDate);
};

/**
 * Calculate the next expected period date
 */
export const getNextPeriodDate = (
  lastPeriodStart: Date | null,
  cycleLength: number
): Date | null => {
  if (!lastPeriodStart) return null;

  const today = startOfDay(new Date());
  let nextPeriod = addDays(lastPeriodStart, cycleLength);

  // If the calculated next period is in the past, keep adding cycle lengths until we get a future date
  while (isBefore(nextPeriod, today) || isEqual(nextPeriod, today)) {
    nextPeriod = addDays(nextPeriod, cycleLength);
  }

  return nextPeriod;
};

/**
 * Calculate the expected ovulation date
 */
export const getOvulationDate = (nextPeriodDate: Date | null): Date | null => {
  if (!nextPeriodDate) return null;
  return addDays(nextPeriodDate, -14);
};

/**
 * Get days until a target date
 */
export const getDaysUntil = (targetDate: Date | null): number | null => {
  if (!targetDate) return null;
  const today = startOfDay(new Date());
  const target = startOfDay(targetDate);
  const days = differenceInDays(target, today);
  return days > 0 ? days : 0; // Return 0 instead of negative days
};

/**
 * Get the current day number in the cycle (1-based)
 */
export const getCurrentDayInCycle = (cycles: Cycle[], cycleLength: number): number => {
  const lastPeriodStart = getLastPeriodStart(cycles);
  if (!lastPeriodStart) return 1;

  const today = startOfDay(new Date());
  const daysSinceLastPeriod = differenceInDays(today, lastPeriodStart);

  // If we're still within the current cycle
  if (daysSinceLastPeriod >= 0 && daysSinceLastPeriod < cycleLength) {
    return daysSinceLastPeriod + 1;
  }

  // If we've passed the cycle length, calculate which day in the new cycle we're on
  const dayInCycle = (daysSinceLastPeriod % cycleLength) + 1;

  return dayInCycle > 0 ? dayInCycle : 1;
};

/**
 * Determine the current phase based on the cycle
 */
export const getCurrentPhase = (
  cycles: Cycle[],
  cycleLength: number,
  periodLength: number
): Phase => {
  const lastPeriodStart = getLastPeriodStart(cycles);
  if (!lastPeriodStart) return "follicular";

  const today = startOfDay(new Date());
  const daysSinceLastPeriod = differenceInDays(today, lastPeriodStart);
  const nextPeriodDate = getNextPeriodDate(lastPeriodStart, cycleLength);
  const ovulationDate = getOvulationDate(nextPeriodDate);

  // Menstrual phase: Day 1 to periodLength
  if (daysSinceLastPeriod >= 0 && daysSinceLastPeriod < periodLength) {
    return "menstrual";
  }

  // Calculate follicular end (ovulation start)
  if (ovulationDate) {
    const daysUntilOvulation = differenceInDays(ovulationDate, today);

    // Ovulation phase: ovulation day (±1 day)
    if (daysUntilOvulation >= -1 && daysUntilOvulation <= 1) {
      return "ovulation";
    }

    // Follicular phase: after menstrual and before ovulation
    if (daysUntilOvulation > 1) {
      return "follicular";
    }
  }

  // Luteal phase: after ovulation until next period
  return "luteal";
};

/**
 * Get comprehensive phase information
 */
export const getPhaseInfo = (
  cycles: Cycle[],
  cycleLength: number,
  periodLength: number
): PhaseInfo => {
  const phase = getCurrentPhase(cycles, cycleLength, periodLength);
  const lastPeriodStart = getLastPeriodStart(cycles);
  const nextPeriodDate = getNextPeriodDate(lastPeriodStart, cycleLength);
  const ovulationDate = getOvulationDate(nextPeriodDate);

  const daysUntilNextPeriod = getDaysUntil(nextPeriodDate) || 0;
  const daysUntilOvulation = getDaysUntil(ovulationDate);

  let description = "";
  switch (phase) {
    case "menstrual":
      description = "menstrualDesc";
      break;
    case "follicular":
      description = "follicularDesc";
      break;
    case "ovulation":
      description = "ovulationDesc";
      break;
    case "luteal":
      description = "lutealDesc";
      break;
  }

  return {
    phase,
    description,
    daysUntilNextPeriod,
    daysUntilOvulation,
  };
};

/**
 * Check if a date falls within any period range
 */
export const isDateInPeriod = (date: Date, cycles: Cycle[]): boolean => {
  const targetDate = startOfDay(date);

  for (const cycle of cycles) {
    const start = startOfDay(parseISO(cycle.startDate));
    const end = startOfDay(parseISO(cycle.endDate));

    if (
      isWithinInterval(targetDate, { start, end }) ||
      isEqual(targetDate, start) ||
      isEqual(targetDate, end)
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Check if a new cycle overlaps with existing cycles
 */
export const checkCycleOverlap = (
  newStart: string,
  newEnd: string,
  existingCycles: Cycle[],
  excludeId?: string
): boolean => {
  const newStartDate = startOfDay(parseISO(newStart));
  const newEndDate = startOfDay(parseISO(newEnd));

  for (const cycle of existingCycles) {
    if (excludeId && cycle.id === excludeId) continue;

    const existingStart = startOfDay(parseISO(cycle.startDate));
    const existingEnd = startOfDay(parseISO(cycle.endDate));

    // Check for any overlap
    const overlapStart = isWithinInterval(newStartDate, {
      start: existingStart,
      end: existingEnd,
    });
    const overlapEnd = isWithinInterval(newEndDate, {
      start: existingStart,
      end: existingEnd,
    });
    const encompasses =
      (isBefore(newStartDate, existingStart) || isEqual(newStartDate, existingStart)) &&
      (isAfter(newEndDate, existingEnd) || isEqual(newEndDate, existingEnd));

    if (overlapStart || overlapEnd || encompasses) {
      return true;
    }
  }

  return false;
};

/**
 * Get the cycle for a specific date
 */
export const getCycleForDate = (date: Date, cycles: Cycle[]): Cycle | null => {
  const targetDate = startOfDay(date);

  for (const cycle of cycles) {
    const start = startOfDay(parseISO(cycle.startDate));
    const end = startOfDay(parseISO(cycle.endDate));

    if (
      isWithinInterval(targetDate, { start, end }) ||
      isEqual(targetDate, start) ||
      isEqual(targetDate, end)
    ) {
      return cycle;
    }
  }

  return null;
};

/**
 * Calculate cycle statistics
 */
export const calculateCycleStats = (cycles: Cycle[]) => {
  if (cycles.length === 0) {
    return {
      averageCycleLength: 0,
      averagePeriodLength: 0,
    };
  }

  const sortedCycles = [...cycles].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  let totalCycleLength = 0;
  let totalPeriodLength = 0;

  sortedCycles.forEach((cycle, index) => {
    const periodLength = differenceInDays(
      parseISO(cycle.endDate),
      parseISO(cycle.startDate)
    ) + 1;
    totalPeriodLength += periodLength;

    if (index < sortedCycles.length - 1) {
      const nextCycle = sortedCycles[index + 1];
      const cycleLength = differenceInDays(
        parseISO(nextCycle.startDate),
        parseISO(cycle.startDate)
      );
      totalCycleLength += cycleLength;
    }
  });

  const averagePeriodLength = Math.round(totalPeriodLength / cycles.length);
  const averageCycleLength =
    sortedCycles.length > 1
      ? Math.round(totalCycleLength / (sortedCycles.length - 1))
      : 28;

  return {
    averageCycleLength,
    averagePeriodLength,
  };
};
