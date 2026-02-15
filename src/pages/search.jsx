import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { searchMulti } from "../features/search/searchSlice";
import { getPages } from "../components/pagination";
import MovieCard from "../components/moviecard";
import { toggleFavorite } from "../features/favorites/favoritesSlice";

export default function Search() {
  const [sp] = useSearchParams();
  const q = sp.get("q") || "";
  const page = Number(sp.get("page") || 1);

  const dispatch = useDispatch();
  const { list, loading, error, totalPages } = useSelector((s) => s.search);

  const favKeys = useSelector((s) =>
    s.favorites.items.map((x) => `${x.media_type}-${x.id}`)
  );

  const pages = getPages(page, totalPages, 2);

  useEffect(() => {
    dispatch(searchMulti({ query: q, page }));
  }, [dispatch, q, page]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  const filtered = list.filter(
    (x) => x.media_type === "movie" || x.media_type === "tv"
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Search: <span className="text-slate-300">{q}</span>
      </h1>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <div className="text-2xl mb-2">🔎</div>
          <h2 className="text-lg font-semibold">No results</h2>
          <p className="mt-1 text-slate-300">
            Try a different keyword (movie or TV show name).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 items-stretch">
          {filtered.map((x) => {
            const type = x.media_type;
            const isFav = favKeys.includes(`${type}-${x.id}`);

            return (
              <MovieCard
                key={`${type}-${x.id}`}
                item={
                  type === "tv"
                    ? {
                        ...x,
                        name: x.name,
                        title: x.title || x.name,
                      }
                    : x
                }
                mediaType={type}
                isFav={isFav}
                onToggleFav={(item) =>
                  dispatch(
                    toggleFavorite({
                      ...item,
                      media_type: type,
                      title: type === "tv" ? item.name : item.title,
                    })
                  )
                }
              />
            );
          })}
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
        <Link
          to={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}
          className={
            "px-3 py-2 rounded-xl bg-white/10 border border-white/10 " +
            (page <= 1 ? "opacity-40 pointer-events-none" : "")
          }
        >
          Prev
        </Link>

        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`dots-${idx}`} className="px-2 text-slate-400">
              ...
            </span>
          ) : (
            <Link
              key={p}
              to={`/search?q=${encodeURIComponent(q)}&page=${p}`}
              className={
                "h-10 min-w-10 px-3 rounded-xl border border-white/10 inline-flex items-center justify-center " +
                (p === page
                  ? "bg-white text-slate-900 font-semibold"
                  : "bg-white/10 hover:bg-white/15")
              }
            >
              {p}
            </Link>
          )
        )}

        <Link
          to={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}
          className={
            "px-3 py-2 rounded-xl bg-white/10 border border-white/10 " +
            (page >= totalPages ? "opacity-40 pointer-events-none" : "")
          }
        >
          Next
        </Link>
      </div>
    </div>
  );
}
