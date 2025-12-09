import { MatchSolution, PositionId } from "@/types";

// Real Madrid vs. Liverpool - 2022 UCL Final
export const MOCK_SOLUTION: MatchSolution = {
    matchId: 20220528,
    date: "2022-05-28",
    formation: '4-3-3',
    lineup: [
        // Goalkeeper (GK, F2)
        { id: 1, name: 'Courtois', nationality: 'Belgium', kitNumber: 1, age: 30, team: 'Real Madrid', positionId: 'GK' as PositionId },
        
        // Defense (D row)
        { id: 2, name: 'Carvajal', nationality: 'Spain', kitNumber: 2, age: 30, team: 'Real Madrid', positionId: 'RB' as PositionId },
        { id: 3, name: 'Eder Militao', nationality: 'Brazil', kitNumber: 3, age: 24, team: 'Real Madrid', positionId: 'RCB' as PositionId },
        { id: 4, name: 'Alaba', nationality: 'Austria', kitNumber: 4, age: 29, team: 'Real Madrid', positionId: 'LCB' as PositionId },
        { id: 5, name: 'Mendy', nationality: 'France', kitNumber: 23, age: 26, team: 'Real Madrid', positionId: 'LB' as PositionId },
        
        // Midfield (C row - the three central midfielders)
        { id: 6, name: 'Casemiro', nationality: 'Brazil', kitNumber: 14, age: 30, team: 'Real Madrid', positionId: 'CM' as PositionId },
        { id: 7, name: 'Kroos', nationality: 'Germany', kitNumber: 8, age: 32, team: 'Real Madrid', positionId: 'LCM' as PositionId },
        { id: 8, name: 'Modric', nationality: 'Croatia', kitNumber: 10, age: 36, team: 'Real Madrid', positionId: 'RCM' as PositionId },
        
        // Attack (B row - the front three)
        { id: 9, name: 'Valverde', nationality: 'Uruguay', kitNumber: 15, age: 23, team: 'Real Madrid', positionId: 'RW' as PositionId },
        { id: 10, name: 'Benzema', nationality: 'France', kitNumber: 9, age: 34, team: 'Real Madrid', positionId: 'ST' as PositionId },
        { id: 11, name: 'Vinicius Jr', nationality: 'Brazil', kitNumber: 20, age: 21, team: 'Real Madrid', positionId: 'LW' as PositionId },
    ],
};