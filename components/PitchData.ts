import { PositionSlot } from "@/types";

// Define array positioning for 4-3-3 formation
const formation433: PositionSlot[] = [
  // Attack
  { id: 'LW', name: 'Left Winger', gridArea: 'A5' },
  { id: 'ST', name: 'Striker', gridArea: 'A3' },
  { id: 'RW', name: 'Right Winger', gridArea: 'A1' },

  // Midfield
  { id: 'LCM', name: 'Left Center Mid', gridArea: 'C4' },
  { id: 'CM', name: 'Center Midfielder', gridArea: 'C3' },
  { id: 'RCM', name: 'Right Center Mid', gridArea: 'C2' },

  // Defense
  { id: 'LB', name: 'Left Back', gridArea: 'E1' },
  { id: 'LCB', name: 'Left Center Back', gridArea: 'E2' },
  { id: 'RCB', name: 'Right Center Back', gridArea: 'E4' },
  { id: 'RB', name: 'Right Back', gridArea: 'E5' },
  
  // GK
  { id: 'GK', name: 'Goalkeeper', gridArea: 'F3' },
];


// Export a map containing all defined formations
export const FORMATION_MAP = {
  '4-3-3': formation433,
  // '4-4-2': formation442,
};

export type FormationKey = keyof typeof FORMATION_MAP;