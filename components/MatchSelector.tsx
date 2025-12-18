import { MOCK_MATCHES } from "@/data/mockMatches";
import { useGameStore } from "@/store/gameStore";

export const MatchSelector = () => {
    const selectMatch = useGameStore(state => state.selectMatch);
    const currentMatchId = useGameStore(state => state.currentMatch.matchId);
    return (
        <aside className="w-80 h-full flex flex-col p-4 gap-4">
            {/* Sidebar header */}
            <div className="px-2">
                <h2 className="text-xs uppercase tracking-widest font-black text-white/40">
                    Available Fixtures
                </h2>
            </div>

            {/* Scrollable match list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {MOCK_MATCHES.map((match) => {
                const isActive = currentMatchId === match.matchId;
                return (
                    <button
                        key={match.matchId}
                        onClick={() => selectMatch(match.matchId)}
                        className={`
                        w-full text-left p-4 rounded-xl transition-all duration-300
                        border-l-4 group relative overflow-hidden
                        ${isActive
                            ? 'bg-white/20 border-emerald-500 shadow-xl' 
                            : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/30'}
                        backdrop-blur-md
                        `}
                    >
                        {/* Gradient shine on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        <div className="relative z-10">
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight">
                                {match.date}
                            </p>
                            <h3 className="text-white font-black text-lg leading-tight uppercase italic">
                                {match.team} 
                                <span className="text-white/40 block text-xs not-italic font-medium">
                                vs {match.opponent}
                                </span>
                            </h3>
                        </div>
                    </button>
                    );
                })}
            </div>
        </aside>
);
}