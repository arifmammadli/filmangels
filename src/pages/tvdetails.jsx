import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchTvDetails } from "../features/details/detailsSlice";
import { openSeason } from "../features/season/seasonSlice";
import SeasonModal from "../components/seasonmodal";
import MovieCard from "../components/moviecard";
import { toggleFavorite } from "../features/favorites/favoritesSlice";

export default function TvDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { data, cast, trailer, similar, loading, error } = useSelector(
    (s) => s.details
  );

  const favKeys = useSelector((s) =>
    s.favorites.items.map((x) => `${x.media_type}-${x.id}`)
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchTvDetails(id));
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (!data) return null;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          className="w-full md:w-[320px] rounded-2xl border border-white/10 object-cover aspect-2/3"
          src={
            data.poster_path
              ? `${import.meta.env.VITE_TMDB_IMG}${data.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={data.name}
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold">{data.name}</h1>

          <p className="text-slate-300 mt-3 leading-relaxed">{data.overview}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-black/50 border border-white/10 px-3 py-1">
              ⭐ {Number(data.vote_average || 0).toFixed(1)}
            </span>

            {!!data.first_air_date && (
              <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1 text-slate-200">
                {(data.first_air_date || "").slice(0, 4)}
              </span>
            )}

            {!!data.number_of_seasons && (
              <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1 text-slate-200">
                Seasons: {data.number_of_seasons}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            {(data.genres || []).map((g) => (
              <span
                key={g.id}
                className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm text-slate-200"
              >
                {g.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Cast</h2>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {(cast || []).slice(0, 6).map((c) => (
            <div key={c.id} className="text-center">
              <img
                className="w-full aspect-2/3 object-cover rounded-xl border border-white/10"
                src={
                  c.profile_path
                    ? `${import.meta.env.VITE_TMDB_IMG}${c.profile_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={c.name}
                loading="lazy"
              />
              <p className="mt-2 text-sm line-clamp-2">{c.name}</p>
            </div>
          ))}
        </div>
      </div>

      {trailer && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Trailer</h2>
          <iframe
            className="w-full aspect-video rounded-2xl border border-white/10"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            allowFullScreen
            title="Trailer"
          />
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-3">Seasons</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 items-stretch">
          {(data.seasons || [])
            .filter((s) => s.season_number !== 0)
            .map((s) => (
              <div
                key={s.id || s.season_number}
                onClick={() =>
                  dispatch(
                    openSeason({
                      tvId: data.id,
                      seasonNumber: s.season_number,
                    })
                  )
                }
                className="cursor-pointer group relative rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition overflow-hidden"
              >
                <div className="relative aspect-2/3 overflow-hidden">
                  <img
                    className="h-full w-full object-cover group-hover:scale-[1.05] transition duration-500"
                    src={
                      s.poster_path
                        ? `${import.meta.env.VITE_TMDB_IMG}${s.poster_path}`
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={s.name}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                </div>

                <div className="p-4">
                  <p className="font-semibold line-clamp-1 min-h-5">
                    {s.name}
                  </p>

                  <div className="mt-2 text-sm text-slate-300 flex justify-between">
                    <span>EP: {s.episode_count ?? "-"}</span>
                    <span>{(s.air_date || "").slice(0, 4) || "—"}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Similar TV Shows</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 items-stretch">
          {(similar || []).slice(0, 10).map((t) => {
            const isFav = favKeys.includes(`tv-${t.id}`);

            return (
              <MovieCard
                key={t.id}
                item={t}
                mediaType="tv"
                isFav={isFav}
                onToggleFav={(show) =>
                  dispatch(
                    toggleFavorite({
                      ...show,
                      media_type: "tv",
                      title: show.name,
                    })
                  )
                }
              />
            );
          })}
        </div>
      </div>

      <SeasonModal />
    </div>
  );
}
