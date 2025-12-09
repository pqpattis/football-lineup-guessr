export type PositionId = 
  | 'GK' 
  | 'RWB' | 'RB' | 'RCB' | 'CB' | 'LCB' | 'LB' | 'LWB' 
  | 'RDM' | 'CDM' | 'LDM' | 'RM' | 'RCM' | 'CM' | 'LCM' | 'LM' 
  | 'RAM' | 'CAM' | 'LAM' 
  | 'RW' | 'RS' | 'ST' | 'LS' | 'LW';

export interface PositionSlot {
  id: PositionId;
  name: string; // Ex. "Goalkeeper"
  gridArea: string; // For grid placement (e.g., 'A1')
}