import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTv } from "../features/discover/discoverSlice";
import { getPages } from "../components/pagination";
import { toggleFavorite } from "../features/favorites/favoritesSlice";
import MovieCard from "../components/moviecard";

const tabs = [
  { key: "popular", label: "Popular" },
  { key: "top_rated", label: "Top Rated" },
  { key: "on_the_air", label: "On The Air" },
];

export default function Tv() {
  const dispatch = useDispatch();

  const favKeys = useSelector((s) =>
    s.favorites.items.map((x) => `${x.media_type}-${x.id}`)
  );

  const { list, page, totalPages, loading, error, type } = useSelector(
    (s) => s.discover.tv
  );

  useEffect(() => {
    dispatch(fetchTv({ type: "popular", page: 1 }));
  }, [dispatch]);

  const changeTab = (t) => dispatch(fetchTv({ type: t, page: 1 }));
  const pages = getPages(page, totalPages, 2);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">TV Shows</h1>

        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => changeTab(t.key)}
              className={
                "px-4 py-2 rounded-xl border border-white/10 transition " +
                (type === t.key
                  ? "bg-white text-slate-900 font-semibold"
                  : "bg-white/10 hover:bg-white/15")
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-400">{error}</div>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 items-stretch">
            {list.map((tv) => {
              const isFav = favKeys.includes(`tv-${tv.id}`);

              return (
                <MovieCard
                  key={tv.id}
                  item={tv}
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

          <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
            <button
              onClick={() => dispatch(fetchTv({ type, page: page - 1 }))}
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
                  onClick={() => dispatch(fetchTv({ type, page: p }))}
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
              onClick={() => dispatch(fetchTv({ type, page: page + 1 }))}
              disabled={page >= totalPages}
              className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
