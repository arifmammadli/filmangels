import { useEffect, useMemo, useState } from "react";
import tmdb from "../../services/tmdb";

const USERS_KEY = "fa_users";
const FEATURED_KEY = "fa_admin_featured";

const loadUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};
const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

const loadFeatured = () => {
  try {
    return JSON.parse(localStorage.getItem(FEATURED_KEY)) || [];
  } catch {
    return [];
  }
};
const saveFeatured = (items) => localStorage.setItem(FEATURED_KEY, JSON.stringify(items));

export default function AdminDashboard() {
  const [tab, setTab] = useState("users");

  const [users, setUsers] = useState([]);
  const [featured, setFeatured] = useState([]);

  const [q, setQ] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchList, setSearchList] = useState([]);
  const [userSearch, setUserSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(userSearch.toLowerCase())
  );


  useEffect(() => {
    setUsers(loadUsers());
    setFeatured(loadFeatured());
  }, []);

  const deleteUser = (id) => {
    const next = users.filter((u) => u.id !== id);
    setUsers(next);
    saveUsers(next);
  };

  const toggleRole = (id) => {
    const next = users.map((u) =>
      u.id === id ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u
    );
    setUsers(next);
    saveUsers(next);
  };

  const toggleBan = (id) => {
    const next = users.map((u) =>
      u.id === id ? { ...u, banned: !u.banned } : u
    );
    setUsers(next);
    saveUsers(next);
  };

  const featuredKeys = useMemo(
    () => new Set(featured.map((x) => `${x.media_type}-${x.id}`)),
    [featured]
  );

  const addFeatured = (x) => {
    const key = `${x.media_type}-${x.id}`;
    if (featuredKeys.has(key)) return;

    const title = x.title || x.name;
    const item = {
      id: x.id,
      media_type: x.media_type,
      title,
      poster_path: x.poster_path,
      vote_average: x.vote_average,
    };

    const next = [item, ...featured];
    setFeatured(next);
    saveFeatured(next);
  };

  const removeFeatured = (key) => {
    const next = featured.filter((x) => `${x.media_type}-${x.id}` !== key);
    setFeatured(next);
    saveFeatured(next);
  };

  const moveFeatured = (index, dir) => {
    const next = [...featured];
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= next.length) return;
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    setFeatured(next);
    saveFeatured(next);
  };

  const doSearch = async () => {
    const query = q.trim();
    if (!query) return;

    try {
      setSearchLoading(true);
      setSearchError(null);

      const res = await tmdb.get("/search/multi", {
        params: { query, page: 1, include_adult: false },
      });

      const items = (res.data.results || []).filter(
        (x) => x.media_type === "movie" || x.media_type === "tv"
      );

      setSearchList(items);
    } catch (e) {
      setSearchError(e?.response?.data?.status_message || "Search error");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-slate-300 text-sm">Users • Carousel</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setTab("users")}
            className={
              "px-4 py-2 rounded-xl border border-white/10 transition " +
              (tab === "users"
                ? "bg-white text-slate-900 font-semibold"
                : "bg-white/10 hover:bg-white/15")
            }
          >
            Users
          </button>
          <button
            onClick={() => setTab("carousel")}
            className={
              "px-4 py-2 rounded-xl border border-white/10 transition " +
              (tab === "carousel"
                ? "bg-white text-slate-900 font-semibold"
                : "bg-white/10 hover:bg-white/15")
            }
          >
            Carousel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-300">Total Users</p>
          <p className="text-2xl font-bold mt-1">{users.length}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-300">Carousel Items</p>
          <p className="text-2xl font-bold mt-1">{featured.length}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-300">Latest User</p>
          <p className="text-sm mt-2 text-slate-100 truncate">
            {users[0]?.username || "—"}
          </p>
        </div>
      </div>

      {tab === "users" && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-lg font-semibold mb-3">Registered Users</h2>
          <div className="mb-4">
  <input
    value={userSearch}
    onChange={(e) => setUserSearch(e.target.value)}
    placeholder="Search user..."
    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-white/30"
  />
</div>


          {filteredUsers.length === 0 ? (
            <div className="text-slate-300 text-sm">No users found.</div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{u.username}</p>
                    <p className="text-xs text-slate-300">
                      role: {u.role || "user"} •{" "}
                      {u.banned ? "🚫 banned" : "✅ active"} •{" "}
                      {u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleRole(u.id)}
                      className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                    >
                      Make {u.role === "admin" ? "User" : "Admin"}
                    </button>

                    <button
                      onClick={() => toggleBan(u.id)}
                      className={
                        "px-3 py-2 rounded-xl border transition " +
                        (u.banned
                          ? "bg-green-500/15 border-green-500/30 text-green-300 hover:bg-green-500/25"
                          : "bg-yellow-500/15 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/25")
                      }
                    >
                      {u.banned ? "Unban" : "Ban"}
                    </button>

                    <button
                      onClick={() => deleteUser(u.id)}
                      className="px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "carousel" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold mb-3">Carousel Items</h2>

            {featured.length === 0 ? (
              <div className="text-slate-300 text-sm">
                The carousel is currently empty. Use the search on the right and click “Add” to add items.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featured.map((f, idx) => {
                  const key = `${f.media_type}-${f.id}`;
                  return (
                    <div key={key} className="relative">
                      <img
                        className="w-full h-56 object-cover rounded-xl border border-white/10"
                        src={
                          f.poster_path
                            ? `${import.meta.env.VITE_TMDB_IMG}${f.poster_path}`
                            : "https://via.placeholder.com/300x450?text=No+Image"
                        }
                        alt={f.title}
                      />

                      <div className="absolute top-2 left-2 flex gap-2">
                        <button
                          onClick={() => moveFeatured(idx, -1)}
                          className="h-9 w-9 rounded-full bg-black/60 border border-white/10 hover:bg-black/80 transition grid place-items-center"
                          title="Up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveFeatured(idx, 1)}
                          className="h-9 w-9 rounded-full bg-black/60 border border-white/10 hover:bg-black/80 transition grid place-items-center"
                          title="Down"
                        >
                          ↓
                        </button>
                      </div>

                      <button
                        onClick={() => removeFeatured(key)}
                        className="absolute top-2 right-2 h-10 w-10 rounded-full bg-black/60 border border-white/10 hover:bg-black/80 transition grid place-items-center"
                        title="Remove"
                      >
                        ✕
                      </button>

                      <p className="mt-2 text-sm font-medium line-clamp-2">
                        {f.title}
                      </p>
                      <p className="text-xs text-slate-300">
                        {f.media_type.toUpperCase()} • ⭐{" "}
                        {Number(f.vote_average || 0).toFixed(1)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 h-fit rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold mb-3">Add to Carousel</h2>

            <div className="flex gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search movie/tv..."
                className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-white/30"
              />
              <button
                onClick={doSearch}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold"
              >
                Search
              </button>
            </div>

            {searchLoading && (
              <div className="mt-3 text-slate-300">Loading...</div>
            )}
            {searchError && <div className="mt-3 text-red-400">{searchError}</div>}

            {!searchLoading && !searchError && searchList.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchList.slice(0, 8).map((x) => {
                  const title = x.title || x.name;
                  const key = `${x.media_type}-${x.id}`;
                  const added = featuredKeys.has(key);

                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <img
                        className="w-12 h-16 rounded-lg object-cover bg-white/5"
                        src={
                          x.poster_path
                            ? `${import.meta.env.VITE_TMDB_IMG}${x.poster_path}`
                            : "https://via.placeholder.com/140x200?text=No+Image"
                        }
                        alt={title}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold truncate">{title}</p>
                        <p className="text-xs text-slate-300">
                          {x.media_type.toUpperCase()} • ⭐{" "}
                          {Number(x.vote_average || 0).toFixed(1)}
                        </p>
                      </div>

                      <button
                        disabled={added}
                        onClick={() => addFeatured(x)}
                        className={
                          "px-3 py-2 rounded-xl border transition " +
                          (added
                            ? "bg-white/5 border-white/10 text-slate-400 cursor-not-allowed"
                            : "bg-white text-slate-900 font-semibold border-white hover:opacity-90")
                        }
                      >
                        {added ? "Added" : "Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {!searchLoading && !searchError && q.trim() && searchList.length === 0 && (
              <div className="mt-3 text-slate-300 text-sm">No results.</div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
