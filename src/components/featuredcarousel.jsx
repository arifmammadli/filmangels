import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function FeaturedCarousel({ items = [] }) {
    const slides = useMemo(
        () => items.filter((x) => x.poster_path).slice(0, 12),
        [items]
    );

    const [active, setActive] = useState(2);

    const prev = () => setActive((p) => (p === 0 ? slides.length - 1 : p - 1));
    const next = () => setActive((p) => (p === slides.length - 1 ? 0 : p + 1));

    useEffect(() => {
        if (slides.length <= 1) return;
        const t = setInterval(next, 5000);
        return () => clearInterval(t);
    }, [slides.length]);

    if (!slides.length) return null;

    const CARD_W = 320; 
    const GAP = 18; 

    const translateX = (active * (CARD_W + GAP));

    return (
        <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide mb-5">
                FEATURED FILMS
            </h2>

            <div className="relative overflow-hidden rounded-2xl">
                <div
                    className="flex items-stretch"
                    style={{
                        gap: `${GAP}px`,
                        transform: `translateX(calc(50% - ${CARD_W / 2}px - ${translateX}px))`,
                        transition: "transform 500ms ease",
                        willChange: "transform",
                    }}
                >
                    {slides.map((m, idx) => {
                        

                        return (
                            <Link
  key={m.id}
  to={`/details/movie/${m.id}`}
  className="group relative shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-white/5"
  style={{ width: `${CARD_W}px` }}
  onClick={() => setActive(idx)}
>
  <img
    src={`${import.meta.env.VITE_TMDB_IMG}${m.poster_path}`}
    alt={m.title}
    className="h-105 w-full object-cover"
  />

  <div className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

  <div
    className="
      pointer-events-none
      absolute inset-0 z-20
      flex items-center justify-center
      opacity-0 scale-90
      group-hover:opacity-100 group-hover:scale-100
      transition-all duration-300
    "
  >
    <div className="h-20 w-20 rounded-full bg-black/60 backdrop-blur-sm border-2 border-white/80 grid place-items-center shadow-xl">
      <div className="ml-1 w-0 h-0 border-l-18 border-l-white border-y-12 border-y-transparent" />
    </div>
  </div>

  <div className="absolute bottom-0 left-0 right-0 z-30 p-4">
    <p className="text-lg font-semibold line-clamp-1">{m.title}</p>
    <div className="flex justify-between text-sm text-slate-300 mt-1">
      <span>{m.release_date?.slice(0, 4)}</span>
      <span className="text-yellow-400">{m.vote_average.toFixed(1)}</span>
    </div>
  </div>
</Link>

                        );
                    })}
                </div>

                <button
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-black/40 border border-white/10 grid place-items-center hover:bg-black/60"
                    aria-label="Prev"
                >
                    <span className="text-4xl">‹</span>
                </button>
                <button
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-black/40 border border-white/10 grid place-items-center hover:bg-black/60"
                    aria-label="Next"
                >
                    <span className="text-4xl">›</span>
                </button>
            </div>
        </div>
    );
}
