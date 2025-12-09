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

// Player interface includes all necessary data (Kit Number, Age, Nationality)
export interface Player {
  id: number; 
  name: string;
  nationality: string;
  kitNumber: number;
  age: number;
  team: string; 
}

export interface SolutionPlayer extends Player {
    positionId: PositionId; 
}

export interface MatchSolution {
    matchId: number; 
    date: string; 
    formation: string; 
    lineup: SolutionPlayer[]; 
}

// Letter status for wordle feedback
export type LetterStatus = 'correct' | 'present' | 'absent'; 

export interface GuessLetter {
  letter: string;
  status: LetterStatus;
}

// Interface to store a single completed guess (used for history)
export interface NameGuess {
  guessName: string;
  feedback: GuessLetter[];
}