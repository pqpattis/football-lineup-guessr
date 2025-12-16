import { MOCK_MATCHES } from "@/data/mockMatches";
import { useGameStore } from "@/store/gameStore";

export const MatchSelector = () => {
    const selectMatch = useGameStore(state => state.selectMatch);
    const currentMatchId = useGameStore(state => state.currentMatch.matchId);
    return (
        <div className="match-list-sidebar flex flex-col w-56 p-4 bg-white rounded-xl shadow-lg h-fit">
            <h3 className="text-xl font-bold mb-4 text-green-700 border-b pb-2">Available Games</h3>
            
            <div className="flex flex-col gap-3">
                {MOCK_MATCHES.map((match) => (
                    <button
                        key={match.matchId}
                        onClick={() => selectMatch(match.matchId)} 
                        className={`
                            p-3 rounded-lg text-sm font-semibold text-left transition duration-150 ease-in-out
                            ${match.matchId === currentMatchId 
                                // Active style
                                ? 'bg-green-600 text-white shadow-md' 
                                // Inactive style
                                : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-800'
                            }
                        `}
                    >
                        {/* Display match info on the button */}
                        <div className='font-bold'>Match ID: {match.matchId}</div>
                        <div className='text-xs italic'>Formation: {match.formation}</div>
                        <div className='text-xs'>{match.date}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}