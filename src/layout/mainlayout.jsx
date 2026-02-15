import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../hooks/useDebounce";
import {
  clearQuick,
  quickSearch,
  setQuickOpen,
} from "../features/search/searchSlice";
import Footer from "../components/footer";
import { logout } from "../features/auth/authSlice";

export default function MainLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [q, setQ] = useState("");
  const debounced = useDebounce(q, 400);

  const boxRef = useRef(null);
  const profileRef = useRef(null);

  const { open, list, loading } = useSelector((s) => s.search.quick);
  const user = useSelector((s) => s.auth.user);
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    if (!debounced.trim()) {
      dispatch(clearQuick());
      return;
    }
    dispatch(setQuickOpen(true));
    dispatch(quickSearch(debounced));
  }, [debounced, dispatch]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) dispatch(setQuickOpen(false));
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [dispatch]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target)) setOpenProfile(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const goFullSearch = (e) => {
    e?.preventDefault?.();
    if (!q.trim()) return;
    dispatch(setQuickOpen(false));
    navigate(`/search?q=${encodeURIComponent(q.trim())}&page=1`);
  };

  const pickItem = (x) => {
    dispatch(setQuickOpen(false));
    setQ("");

    if (x.media_type === "movie") navigate(`/details/movie/${x.id}`);
    if (x.media_type === "tv") navigate(`/details/tv/${x.id}`);
  };

  const filtered = (list || []).filter(
    (x) => x.media_type === "movie" || x.media_type === "tv"
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <img src="/favicon.png" alt="logo" className="w-6 h-6" />
            FilmAngels
          </div>

          <nav className="flex items-center gap-4">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                "px-3 py-2 rounded-xl transition " +
                (isActive ? "text-red-400" : "text-slate-200 hover:text-white")
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/movies"
              className={({ isActive }) =>
                "px-3 py-2 rounded-xl transition " +
                (isActive ? "text-red-400" : "text-slate-200 hover:text-white")
              }
            >
              Movies
            </NavLink>

            <NavLink
              to="/tv"
              className={({ isActive }) =>
                "px-3 py-2 rounded-xl transition " +
                (isActive ? "text-red-400" : "text-slate-200 hover:text-white")
              }
            >
              TV
            </NavLink>

            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                "px-3 py-2 rounded-xl transition " +
                (isActive ? "text-red-400" : "text-slate-200 hover:text-white")
              }
            >
              Favorites
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <div ref={boxRef} className="relative w-105 hidden md:block">
              <form onSubmit={goFullSearch} className="flex gap-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => q.trim() && dispatch(setQuickOpen(true))}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") dispatch(setQuickOpen(false));
                  }}
                  placeholder="Search..."
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-white/30"
                />

                <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold transition">
                  Go
                </button>
              </form>

              {open && q.trim() && (
                <div className="absolute right-0 mt-3 w-105 z-50 rounded-2xl border border-white/10 bg-slate-950/85 backdrop-blur-xl shadow-2xl overflow-hidden">
                  <div className="max-h-90 overflow-auto">
                    {loading && (
                      <div className="px-4 py-4 text-slate-300">
                        Loading...
                      </div>
                    )}

                    {!loading && filtered.length === 0 && (
                      <div className="px-4 py-4 text-slate-300">
                        No results.
                      </div>
                    )}

                    {!loading &&
                      filtered.slice(0, 8).map((x) => {
                        const title = x.title || x.name;
                        const year = (x.release_date || x.first_air_date || "")
                          .slice(0, 4);
                        const poster = x.poster_path;

                        return (
                          <button
                            key={`${x.media_type}-${x.id}`}
                            onClick={() => pickItem(x)}
                            className="w-full text-left flex gap-3 px-4 py-3 hover:bg-white/5 transition"
                          >
                            <img
                              className="h-12 w-9 rounded-lg object-cover border border-white/10 bg-white/5"
                              src={
                                poster
                                  ? `${import.meta.env.VITE_TMDB_IMG}${poster}`
                                  : "https://via.placeholder.com/140x200?text=No+Image"
                              }
                              alt={title}
                              loading="lazy"
                            />

                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-white truncate">
                                {title}
                              </p>

                              <div className="mt-1 flex items-center gap-2 text-xs text-slate-300">
                                <span className="rounded-full bg-white/10 px-2 py-0.5 border border-white/10">
                                  {x.media_type.toUpperCase()}
                                </span>
                                <span>{year || "—"}</span>
                                <span className="text-yellow-300">
                                  ★ {Number(x.vote_average || 0).toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>

                  <button
                    onClick={goFullSearch}
                    className="w-full px-4 py-3 text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 border-t border-white/10"
                  >
                    See all results →
                  </button>
                </div>
              )}
            </div>

            {!user ? (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    "px-3 py-2 rounded-xl border border-white/10 transition " +
                    (isActive
                      ? "text-red-400 border-red-400/40"
                      : "text-slate-200 hover:text-white hover:bg-white/5")
                  }
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    "px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition font-semibold " +
                    (isActive ? "ring-2 ring-red-400/40" : "")
                  }
                >
                  Sign Up
                </NavLink>
              </div>
            ) : (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setOpenProfile((p) => !p)}
                  className="h-10 w-10 rounded-full bg-white/10 border border-white/10 grid place-items-center hover:bg-white/20 transition"
                  title="Profile"
                >
                  <span className="text-sm font-semibold">
                    {user.username?.[0]?.toUpperCase() || "U"}
                  </span>
                </button>

                {openProfile && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-slate-900 shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 text-sm text-slate-300 border-b border-white/10">
                      Signed in as
                      <div className="font-semibold text-white truncate">
                        {user.username}
                      </div>
                    </div>

                    {user.role === "admin" && (
                      <NavLink
                        to="/admin"
                        onClick={() => setOpenProfile(false)}
                        className="block px-4 py-3 text-sm hover:bg-white/10 transition"
                      >
                        Admin
                      </NavLink>
                    )}

                    <button
                      onClick={() => {
                        dispatch(logout());
                        setOpenProfile(false);
                        navigate("/login");
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-24 pb-12">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
