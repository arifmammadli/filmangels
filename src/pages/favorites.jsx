import { useDispatch, useSelector } from "react-redux";
import { clearFavorites, toggleFavorite } from "../features/favorites/favoritesSlice";
import { Link } from "react-router-dom";
import MovieCard from "../components/moviecard";

export default function Favorites() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.favorites.items);

  const favKeys = useSelector((s) =>
    s.favorites.items.map((x) => `${x.media_type}-${x.id}`)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Favorites</h1>

        {items.length > 0 && (
          <button
            onClick={() => dispatch(clearFavorites())}
            className="px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold"
          >
            Clear all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <div className="text-2xl mb-2">💔</div>
          <h2 className="text-lg font-semibold">No favorites yet</h2>
          <p className="mt-1 text-slate-300">
            Add movies or TV shows by tapping the heart icon.
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <Link
              to="/movies"
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
            >
              Browse Movies
            </Link>
            <Link
              to="/tv"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold transition"
            >
              Browse TV
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 items-stretch">
          {items.map((m) => {
            const mediaType = m.media_type || "movie";
            const isFav = favKeys.includes(`${mediaType}-${m.id}`);

            return (
              <MovieCard
                key={`${mediaType}-${m.id}`}
                item={mediaType === "tv" ? { ...m, name: m.title } : m}
                mediaType={mediaType}
                isFav={isFav}
                onToggleFav={() => dispatch(toggleFavorite(m))}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
