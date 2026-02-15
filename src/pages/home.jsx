import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopularMovies } from "../features/discover/discoverSlice";
import { Link } from "react-router-dom";
import { toggleFavorite } from "../features/favorites/favoritesSlice";
import FeaturedCarousel from "../components/featuredcarousel";
import MovieCard from "../components/moviecard";

export default function Home() {
  const dispatch = useDispatch();
  const { movies, loading, error } = useSelector((s) => s.discover.home);

  const favIds = useSelector((s) => s.favorites.items.map((x) => x.id));
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    dispatch(fetchPopularMovies(1));
  }, [dispatch]);

  useEffect(() => {
    setFeatured(JSON.parse(localStorage.getItem("fa_admin_featured") || "[]"));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <FeaturedCarousel items={featured.length ? featured : movies} />

      <h1 className="text-2xl font-bold mb-4">Popular Movies</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6
">
  {movies.map((m) => (
    <MovieCard
      key={m.id}
      item={m}
      mediaType="movie"
      isFav={favIds.includes(m.id)}
      onToggleFav={(movie) =>
        dispatch(toggleFavorite({ ...movie, media_type: "movie", title: movie.title }))
      }
    />
  ))}
</div>

    </div>
  );
}
