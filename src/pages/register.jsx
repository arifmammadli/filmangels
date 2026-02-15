import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const bg =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2400&q=80";

const USERS_KEY = "fa_users";

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export default function Register() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);

  const submit = (e) => {
    e.preventDefault();

    const u = username.trim();
    const p = password.trim();

    if (u.length < 5) return setMsg("Username must be at least 5 characters long.");
    if (p.length < 4) return setMsg("The password must be at least 4 characters long.");

    const users = loadUsers();
    const exists = users.some((x) => x.username.toLowerCase() === u.toLowerCase());
    if (exists) return setMsg("Bu username artıq mövcuddur.");

    users.unshift({
      id: Date.now(),
      username: u,
      password: p,
      role: "user",
      createdAt: Date.now(),
    });
    saveUsers(users);


    setMsg("Account created ✅ Login now.");
    setTimeout(() => nav("/login"), 700);
  };

  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-105">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="text-red-500">FilmAngels</span>
            </h1>
            <p className="text-slate-200/80 mt-2 text-sm">
              Create your account
            </p>
          </div>

          <form
            onSubmit={submit}
            className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl p-6"
          >
            <label className="block text-sm text-slate-200 mb-2">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-white/30"
              placeholder="choose a username"
              autoComplete="username"
            />

            <label className="block text-sm text-slate-200 mb-2 mt-4">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-white/30"
              placeholder="min 4 chars"
              type="password"
              autoComplete="new-password"
            />

            {msg && (
              <div className="mt-4 text-sm text-slate-100 bg-white/10 border border-white/10 rounded-xl p-3">
                {msg}
              </div>
            )}

            <button className="mt-5 w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 transition font-semibold text-white">
              Create Account
            </button>

            <div className="mt-6 pt-4 border-t border-white/10 text-sm text-slate-200/80">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-white font-semibold hover:underline"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
