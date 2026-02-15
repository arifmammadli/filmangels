import { Link } from "react-router-dom";

export default function MovieCard({ item, mediaType = "movie", isFav, onToggleFav }) {
  const title = mediaType === "tv" ? item?.name : item?.title;
  const year =
    (mediaType === "tv" ? item?.first_air_date : item?.release_date)?.slice(0, 4) || "";
  const rating = Number(item?.vote_average || 0).toFixed(1);

  const img = item?.poster_path
    ? `${import.meta.env.VITE_TMDB_IMG}${item.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-red-500/30 via-fuchsia-500/20 to-indigo-500/30 blur opacity-0 group-hover:opacity-100 transition duration-500" />

      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-lg group-hover:shadow-2xl transition duration-500">
        <Link to={`/details/${mediaType}/${item.id}`} className="block">
          <div className="relative aspect-2/3 overflow-hidden">
            <img
              className="h-full w-full object-cover scale-[1.02] group-hover:scale-[1.08] transition duration-700"
              src={img}
              alt={title}
              loading="lazy"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />

            <div className="absolute top-3 left-3 flex gap-2">
              <span className="rounded-full bg-black/55 backdrop-blur px-2.5 py-1 text-xs font-semibold border border-white/10">
                ⭐ {rating}
              </span>
              {year && (
                <span className="rounded-full bg-white/10 backdrop-blur px-2.5 py-1 text-xs font-semibold border border-white/10">
                  {year}
                </span>
              )}
            </div>

            <div className="absolute inset-0 grid place-items-center opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition duration-300">
              <div className="h-16 w-16 rounded-full bg-black/55 backdrop-blur border border-white/20 grid place-items-center shadow-xl">
                <div className="ml-1 w-0 h-0 border-l-16 border-l-white border-y-10 border-y-transparent" />
              </div>
            </div>
          </div>

          <div className="p-4 flex flex-col">
            <p className="font-semibold leading-snug line-clamp-2 text-white min-h-11">
              <span className="bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                {title}
              </span>
            </p>

            <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
              <span className="rounded-full bg-white/10 px-2.5 py-1 border border-white/10">
                {mediaType === "tv" ? "TV SHOW" : "MOVIE"}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 border border-white/10">
                HD
              </span>
            </div>

            <div className="mt-auto pt-3" />
          </div>
        </Link>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFav?.(item);
          }}
          className={
            "absolute top-3 right-3 z-10 h-10 w-10 rounded-full grid place-items-center border transition " +
            (isFav
              ? "bg-red-500/20 border-red-500/40 text-red-400"
              : "bg-black/50 border-white/10 text-white/80 hover:bg-black/70")
          }
          title={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          {isFav ? "♥" : "♡"}
        </button>
      </div>
    </div>
  );
}
