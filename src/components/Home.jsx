import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const user = useSelector((state) => state.user);

  return (
    <section className="relative overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.14),_transparent_25%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 backdrop-blur-sm">
              <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />
              Live developer discovery with modern APIs
            </div>
            <div className="space-y-6">
              <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                DevConnect for developers —{" "}
                <span className="text-cyan-300">
                  meet, connect, collaborate.
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Discover developer connections, send collaboration requests, and
                manage your profile in a clean, modern React interface backed by
                Node, Express, and MongoDB.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {!user ? (
                <>
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-8 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300"
                  >
                    Join DevConnect
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-8 py-3 text-base font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-white"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <Link
                  to="/feed"
                  className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-8 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300"
                >
                  Continue to your feed
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-800/90 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-300">
                  Featured preview
                </span>
                <span className="text-sm text-slate-500">Developer card</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-[1.75rem] bg-slate-800 ring-1 ring-slate-700">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                    alt="profile preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Aisha Patel
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Full-stack developer • React / Node
                  </p>
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-6">
                <p className="text-slate-300">
                  A simple developer profile preview that highlights skills and
                  collaboration.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Responsive UI",
                  "Fast onboarding",
                  "Profile sync",
                  "Easy networking",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-4 text-sm text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
