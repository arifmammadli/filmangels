import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuthError, login } from "../features/auth/authSlice";

const bg =
  "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=2400&q=80";

export default function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const loc = useLocation();

  const error = useSelector((s) => s.auth.error);
  const user = useSelector((s) => s.auth.user);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
  if (!user) return;

  const from = loc.state?.from || "/";

  if (user.role === "admin") {
    nav("/admin", { replace: true });
    return;
  }

  if (from === "/admin") {
    nav("/", { replace: true });
    return;
  }

  nav(from, { replace: true });
}, [user, nav, loc.state]);



  const submit = (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    dispatch(login({ username, password }));
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
              <span className="text-red-500">FilmAngels </span>
            </h1>
            <p className="text-slate-200/80 mt-2 text-sm">
              Sign in to continue
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
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-white/30 placeholder:text-slate-300/60"
              placeholder="m_ar1f"
              autoComplete="username"
            />

            <label className="block text-sm text-slate-200 mb-2 mt-4">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-white/30 placeholder:text-slate-300/60"
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
            />

            {error && (
              <div className="mt-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                {error}
              </div>
            )}

            <button className="mt-5 w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 transition font-semibold text-white">
              Sign In
            </button>

            

            <div className="mt-6 pt-4 border-t border-white/10 text-sm text-slate-200/80">
              New here?{" "}
              <Link
                to="/register"
                className="text-white font-semibold hover:underline"
              >
                Create account
              </Link>
            </div>
          </form>

          <p className="text-center text-xs text-slate-200/70 mt-6">
            Formulated by Arif Mammadli
          </p>
        </div>
      </div>
    </div>
  );
}
