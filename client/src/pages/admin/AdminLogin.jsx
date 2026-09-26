import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await api.post("/auth/login", formData);

      localStorage.setItem("adminToken", response.data.token);

      navigate("/admin");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-plaster text-ink">

      {/* Top accent */}
      <div className="h-[3px] bg-clay" />

      {/* Header */}
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-5 sm:px-8">

          <div>
            <p className="font-display text-2xl italic leading-none">
              Malak
            </p>

            <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.3em] text-mute">
              Store
            </p>
          </div>

          <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-mute">
            Administration
          </span>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto flex min-h-[calc(100vh-145px)] max-w-[1200px] items-center justify-center px-5 py-16 sm:px-8">

        <div className="grid w-full max-w-5xl overflow-hidden border border-line bg-paper lg:grid-cols-[0.85fr_1fr]">

          {/* Brand panel */}
          <div className="relative hidden min-h-[560px] overflow-hidden bg-ink p-10 text-paper lg:flex lg:flex-col lg:justify-between">

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-clay">
                Malak Store
              </p>

              <div className="mt-20">
                <h1 className="max-w-sm font-display text-5xl font-medium leading-[0.95] tracking-tight">
                  The collection
                  <br />
                  <span className="italic text-clay">
                    behind the scenes.
                  </span>
                </h1>

                <p className="mt-7 max-w-xs text-sm leading-7 text-paper/50">
                  Manage fragrances, categories, inventory and customer
                  orders from one place.
                </p>
              </div>
            </div>

            <div className="border-t border-paper/15 pt-5">
              <p className="text-[9px] uppercase tracking-[0.2em] text-paper/35">
                Private administration area
              </p>
            </div>
          </div>

          {/* Login panel */}
          <div className="flex min-h-[560px] flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">

            {/* Mobile brand */}
            <div className="mb-12 lg:hidden">
              <p className="font-display text-2xl italic">
                Malak Store
              </p>
            </div>

            <div className="max-w-md">

              <div className="mb-9 border-b border-line pb-7">

                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-clay">
                  Admin access
                </p>

                <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                  Welcome back.
                </h2>

                <p className="mt-3 text-sm leading-6 text-mute">
                  Sign in to manage your fragrance store.
                </p>

              </div>

              <form onSubmit={handleSubmit} className="space-y-7">

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-mute"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="admin@example.com"
                    className="w-full border-b border-line bg-transparent px-0 py-3 text-sm text-ink outline-none transition placeholder:text-mute/45 focus:border-ink"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-mute"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full border-b border-line bg-transparent px-0 py-3 text-sm text-ink outline-none transition placeholder:text-mute/45 focus:border-ink"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="border-l-2 border-clay bg-plaster px-4 py-3 text-sm leading-6 text-ink">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-between bg-ink px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper transition hover:bg-pine disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>
                    {loading ? "Signing in..." : "Enter dashboard"}
                  </span>

                  <span className="text-base leading-none">
                    →
                  </span>
                </button>

              </form>

              <div className="mt-8 border-t border-line pt-5">
                <p className="text-[9px] leading-5 text-mute">
                  Authorized access only. Your store management area is
                  protected by administrator authentication.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-ink text-paper">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-6 sm:px-8">

          <p className="font-display text-lg italic">
            Malak Store
          </p>

          <p className="text-[8px] uppercase tracking-[0.2em] text-paper/35">
            Fragrance, carefully chosen.
          </p>

        </div>
      </footer>

    </div>
  );
};

export default AdminLogin;