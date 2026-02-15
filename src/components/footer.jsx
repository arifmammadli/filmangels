export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-slate-950/80">
            <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between text-sm text-slate-400">
                <p>
                    © {new Date().getFullYear()} <span className="text-white font-semibold">FilmAngels</span>
                </p>

                <p className="text-slate-400">
                    Formulated by <span className="text-white font-semibold">Arif Mammadli</span>
                </p>

            </div>
        </footer>
    );
}
