import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchMovieDetails } from "../features/details/detailsSlice";
import MovieCard from "../components/moviecard";
import { toggleFavorite } from "../features/favorites/favoritesSlice";

export default function MovieDetails() {
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
    dispatch(fetchMovieDetails(id));
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
          alt={data.title}
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold">{data.title}</h1>

          <p className="text-slate-300 mt-3 leading-relaxed">{data.overview}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-black/50 border border-white/10 px-3 py-1">
              ⭐ {Number(data.vote_average || 0).toFixed(1)}
            </span>

            {!!data.release_date && (
              <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1 text-slate-200">
                {(data.release_date || "").slice(0, 4)}
              </span>
            )}

            {!!data.runtime && (
              <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1 text-slate-200">
                {data.runtime} min
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
        <h2 className="text-xl font-semibold mb-3">Similar Movies</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 items-stretch">
          {(similar || []).slice(0, 10).map((m) => {
            const isFav = favKeys.includes(`movie-${m.id}`);

            return (
              <MovieCard
                key={m.id}
                item={m}
                mediaType="movie"
                isFav={isFav}
                onToggleFav={(movie) =>
                  dispatch(
                    toggleFavorite({
                      ...movie,
                      media_type: "movie",
                      title: movie.title,
                    })
                  )
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
