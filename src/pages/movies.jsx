import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMovieGenres, fetchMovies } from "../features/discover/discoverSlice";
import { getPages } from "../components/pagination";
import { toggleFavorite } from "../features/favorites/favoritesSlice";
import MovieCard from "../components/moviecard";


export default function Movies() {
  const dispatch = useDispatch();

   const favKeys = useSelector((s) =>
    s.favorites.items.map((x) => `${x.media_type}-${x.id}`)
  );

  const { list, page, totalPages, loading, error, genreId } = useSelector(
    (s) => s.discover.movies
  );

  const genres = useSelector((s) => s.discover.genres.list);
  const genresLoading = useSelector((s) => s.discover.genres.loading);

  useEffect(() => {
    dispatch(fetchMovieGenres());
    dispatch(fetchMovies({ page: 1, query: "", genreId: null }));
  }, [dispatch]);

  const selectGenre = (id) => {
    dispatch(fetchMovies({ page: 1, query: "", genreId: id }));
  };

  const clearGenre = () => {
    dispatch(fetchMovies({ page: 1, query: "", genreId: null }));
  };

  const pages = getPages(page, totalPages, 2);

  

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div>
        <div className="flex items-end justify-between mb-4">
          <h1 className="text-2xl font-bold">
            Movies{" "}
            {genreId ? (
              <span className="text-slate-400 text-sm">• filtered</span>
            ) : (
              ""
            )}
          </h1>

          {genreId && (
            <button
              onClick={clearGenre}
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15"
            >
              Clear filter
            </button>
          )}
        </div>

        {loading && <div>Loading...</div>}
        {error && <div className="text-red-400">{error}</div>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {list.map((m) => {
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


            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button
                onClick={() =>
                  dispatch(fetchMovies({ page: page - 1, query: "", genreId }))
                }
                disabled={page <= 1}
                className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 disabled:opacity-40"
              >
                Prev
              </button>

              {pages.map((p, idx) =>
                p === "..." ? (
                  <span key={`dots-${idx}`} className="px-2 text-slate-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() =>
                      dispatch(fetchMovies({ page: p, query: "", genreId }))
                    }
                    className={
                      "h-10 min-w-10 px-3 rounded-xl border border-white/10 " +
                      (p === page
                        ? "bg-white text-slate-900 font-semibold"
                        : "bg-white/10 hover:bg-white/15")
                    }
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  dispatch(fetchMovies({ page: page + 1, query: "", genreId }))
                }
                disabled={page >= totalPages}
                className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <aside className="lg:sticky lg:top-24 h-fit rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold mb-3">Categories</h2>

        {genresLoading && (
          <div className="text-slate-300 text-sm">Loading...</div>
        )}

        {!genresLoading && genres.length === 0 && (
          <div className="text-slate-400 text-sm">No categories.</div>
        )}

        <div className="flex flex-col gap-2 max-h-[70vh] overflow-auto pr-1">
          <button
            onClick={clearGenre}
            className={
              "text-left px-3 py-2 rounded-xl border transition " +
              (!genreId
                ? "bg-white text-slate-900 font-semibold border-white"
                : "bg-white/10 border-white/10 hover:bg-white/15")
            }
          >
            All
          </button>

          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() => selectGenre(g.id)}
              className={
                "text-left px-3 py-2 rounded-xl border transition " +
                (genreId === g.id
                  ? "bg-white text-slate-900 font-semibold border-white"
                  : "bg-white/10 border-white/10 hover:bg-white/15")
              }
            >
              {g.name}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
