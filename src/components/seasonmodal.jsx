import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSeason, fetchSeason } from "../features/season/seasonSlice";

export default function SeasonModal() {
  const dispatch = useDispatch();
  const { open, tvId, seasonNumber, data, loading, error } = useSelector(
    (s) => s.season
  );

  useEffect(() => {
    if (!open || tvId == null || seasonNumber == null) return;
    dispatch(fetchSeason({ tvId, seasonNumber }));
  }, [open, tvId, seasonNumber, dispatch]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") dispatch(closeSeason());
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dispatch]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-200">
      <button
        onClick={() => dispatch(closeSeason())}
        className="absolute inset-0 bg-black/70"
        aria-label="Close"
      />

      <div className="absolute left-1/2 top-1/2 w-[94vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-slate-950 text-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <p className="text-slate-400 text-sm">Season</p>
            <p className="font-semibold">
              {data?.name || `Season ${seasonNumber}`}
            </p>
          </div>

          <button
            onClick={() => dispatch(closeSeason())}
            className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-400">{error}</div>}

          {!loading && !error && data && (
            <div className="space-y-4">
              {data.overview && (
                <p className="text-slate-300">{data.overview}</p>
              )}

              <div className="max-h-105 overflow-auto space-y-3 pr-1">
                {(data.episodes || []).map((ep) => (
                  <div
                    key={ep.id}
                    className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="w-16 shrink-0 text-center">
                      <div className="text-sm text-slate-300">EP</div>
                      <div className="text-xl font-bold">{ep.episode_number}</div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{ep.name}</p>
                      <p className="text-sm text-slate-300 line-clamp-2 mt-1">
                        {ep.overview || "No description."}
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        Air: {ep.air_date || "—"} • ⭐{" "}
                        {Number(ep.vote_average || 0).toFixed(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
