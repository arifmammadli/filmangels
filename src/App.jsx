import { Routes, Route } from "react-router-dom";

import MainLayout from "./layout/mainlayout";
import AdminLayout from "./layout/adminlayout";

import Home from "./pages/home";
import Movies from "./pages/movies";
import MovieDetails from "./pages/moviedetails";
import Tv from "./pages/tv";
import TvDetails from "./pages/tvdetails";
import Favorites from "./pages/favorites";
import Search from "./pages/search";

import Login from "./pages/login";
import Register from "./pages/register";

import ProtectedRoute from "./routes/protectedroute";
import AdminRoute from "./routes/adminroute";
import AdminDashboard from "./pages/admin/admindashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/movies" element={<Movies />} />
        <Route path="/details/movie/:id" element={<MovieDetails />} />

        <Route path="/tv" element={<Tv />} />
        <Route path="/details/tv/:id" element={<TvDetails />} />

        <Route path="/search" element={<Search />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/favorites" element={<Favorites />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}
