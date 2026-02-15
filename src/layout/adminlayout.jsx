import { Outlet, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function AdminLayout() {
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-bold">Admin Panel</div>

          <div className="flex items-center gap-3 text-sm">
            <NavLink to="/" className="text-slate-300 hover:text-white">
              Back to site
            </NavLink>
            <button
              onClick={() => dispatch(logout())}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
