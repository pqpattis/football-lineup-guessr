import { MatchSolution, PositionId } from "@/types";

// Real Madrid vs. Liverpool - 2022 UCL Final
export const MOCK_MATCH_1: MatchSolution = {
    matchId: 1,
    date: "2022-05-28",
    formation: '4-3-3',
    team: 'Real Madrid',
    opponent: 'Liverpool',
    lineup: [
        { id: 1, name: 'COURTOIS', nationality: 'Belgium', kitNumber: 1, age: 30, positionId: 'GK' as PositionId },
        { id: 2, name: 'CARVAJAL', nationality: 'Spain', kitNumber: 2, age: 30, positionId: 'RB' as PositionId },
        { id: 3, name: 'EDER MILITAO', nationality: 'Brazil', kitNumber: 3, age: 24, positionId: 'RCB' as PositionId },
        { id: 4, name: 'ALABA', nationality: 'Austria', kitNumber: 4, age: 29, positionId: 'LCB' as PositionId },
        { id: 5, name: 'MENDY', nationality: 'France', kitNumber: 23, age: 26, positionId: 'LB' as PositionId },
        { id: 6, name: 'CASEMIRO', nationality: 'Brazil', kitNumber: 14, age: 30, positionId: 'CM' as PositionId },
        { id: 7, name: 'KROOS', nationality: 'Germany', kitNumber: 8, age: 32, positionId: 'LCM' as PositionId },
        { id: 8, name: 'MODRIC', nationality: 'Croatia', kitNumber: 10, age: 36, positionId: 'RCM' as PositionId },
        { id: 9, name: 'VALVERDE', nationality: 'Uruguay', kitNumber: 15, age: 23, positionId: 'RW' as PositionId },
        { id: 10, name: 'BENZEMA', nationality: 'France', kitNumber: 9, age: 34, positionId: 'ST' as PositionId },
        { id: 11, name: 'VINICIUS JR', nationality: 'Brazil', kitNumber: 20, age: 21, positionId: 'LW' as PositionId },
    ],
};

export const MOCK_MATCH_2: MatchSolution = {
    matchId: 2, 
    date: "2003-05-28", 
    formation: "4-3-1-2",
    team: "AC Milan",
    opponent: "Juventus FC",
    lineup: [
        { id: 1, name: "DIDA", nationality: "Brazil", kitNumber: 1, age: 29, positionId: 'GK' as PositionId }, 
        { id: 2, name: "COSTACURTA", nationality: "Italy", kitNumber: 5, age: 37, positionId: 'RB' as PositionId }, 
        { id: 3, name: "NESTA", nationality: "Italy", kitNumber: 13, age: 27, positionId: 'RCB' as PositionId },
        { id: 4, name: "MALDINI", nationality: "Italy", kitNumber: 3, age: 34, positionId: 'LCB' as PositionId },
        { id: 5, name: "KALADZE", nationality: "Georgia", kitNumber: 4, age: 25, positionId: 'LB' as PositionId },
        { id: 6, name: "GATTUSO", nationality: "Italy", kitNumber: 8, age: 25, positionId: 'RCM' as PositionId },
        { id: 7, name: "PIRLO", nationality: "Italy", kitNumber: 21, age: 24, positionId: 'CM' as PositionId },
        { id: 8, name: "SEEDORF", nationality: "Netherlands", kitNumber: 20, age: 27, positionId: 'LCM' as PositionId },
        { id: 9, name: "RUI COSTA", nationality: "Portugal", kitNumber: 10, age: 31, positionId: 'CAM' as PositionId },
        { id: 10, name: "SHEVCHENKO", nationality: "Ukraine", kitNumber: 7, age: 26, positionId: 'LS' as PositionId },
        { id: 11, name: "INZAGHI", nationality: "Italy", kitNumber: 9, age: 29, positionId: 'RS' as PositionId },
    ],
};

// Centralized list of all available matches
export const MOCK_MATCHES: MatchSolution[] = [
    MOCK_MATCH_1,
    MOCK_MATCH_2
];