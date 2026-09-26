import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const response = await api.get("/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
          return;
        }

        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-plaster text-ink">
        <div className="text-center">
          <p className="font-display text-2xl italic">
            Malak
          </p>

          <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-mute">
            Loading dashboard
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-plaster px-5 text-ink">
        <div className="w-full max-w-md border border-line bg-paper p-7 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-clay">
            Something went wrong
          </p>

          <p className="mt-4 text-sm leading-6 text-mute">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 bg-ink px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-paper transition hover:bg-pine"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      number: String(stats?.totalProducts ?? 0).padStart(2, "0"),
      label: "Products",
      description: "Fragrances in your collection",
    },
    {
      number: String(stats?.totalOrders ?? 0).padStart(2, "0"),
      label: "Orders",
      description: "Orders placed by customers",
    },
    {
      number: `$${Number(stats?.totalSales ?? 0).toFixed(2)}`,
      label: "Sales",
      description: "Total completed sales",
    },
    {
      number: String(stats?.totalCustomers ?? 0).padStart(2, "0"),
      label: "Customers",
      description: "Customers in your store",
    },
  ];

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

          <div className="flex items-center gap-4 sm:gap-7">

            <span className="hidden text-[9px] font-semibold uppercase tracking-[0.22em] text-mute sm:block">
              Administration
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="border border-line px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8 sm:py-14">

        {/* Intro */}
        <section className="border-b border-line pb-9">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-clay">
                Store overview
              </p>

              <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                Dashboard
              </h1>

              <p className="mt-3 max-w-md text-sm leading-6 text-mute">
                A quick look at your fragrance store, orders and customers.
              </p>
            </div>

            <div className="hidden border-l border-line pl-5 sm:block">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-mute">
                Malak Store
              </p>

              <p className="mt-1 font-display text-lg italic">
                Administration
              </p>
            </div>

          </div>
        </section>

        {/* Stats */}
        <section className="py-8">

          <div className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">

            {statCards.map((card, index) => (
              <div
                key={card.label}
                className={`group border-b border-line bg-paper p-6 transition-colors hover:bg-[#ebe4da] sm:p-7 ${
                  index !== 0 ? "sm:border-l" : ""
                }`}
              >

                <div className="flex items-start justify-between gap-4">

                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-mute">
                    {card.label}
                  </p>

                  <span className="font-display text-sm text-clay">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                </div>

                <p className="mt-8 break-words font-display text-3xl font-medium tracking-tight sm:text-4xl">
                  {card.number}
                </p>

                <p className="mt-3 text-xs leading-5 text-mute">
                  {card.description}
                </p>

              </div>
            ))}

          </div>

        </section>

        {/* Store management */}
        <section className="border-t border-line pt-8">

          <div className="mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-clay">
              Manage your store
            </p>

            <h2 className="mt-2 font-display text-2xl sm:text-3xl">
              Quick access
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="group bg-paper p-6 text-left transition hover:bg-ink hover:text-paper sm:p-7"
            >
              <div className="flex items-center justify-between">

                <span className="font-display text-2xl text-clay">
                  01
                </span>

                <span className="text-xl text-mute transition group-hover:translate-x-1 group-hover:text-clay">
                  →
                </span>

              </div>

              <h3 className="mt-8 font-display text-xl">
                Products
              </h3>

              <p className="mt-2 text-xs leading-5 text-mute group-hover:text-paper/50">
                Add fragrances, update stock and manage availability.
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
              className="group bg-paper p-6 text-left transition hover:bg-ink hover:text-paper sm:p-7"
            >
              <div className="flex items-center justify-between">

                <span className="font-display text-2xl text-clay">
                  02
                </span>

                <span className="text-xl text-mute transition group-hover:translate-x-1 group-hover:text-clay">
                  →
                </span>

              </div>

              <h3 className="mt-8 font-display text-xl">
                Categories
              </h3>

              <p className="mt-2 text-xs leading-5 text-mute group-hover:text-paper/50">
                Organize and reorder your fragrance collections.
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/orders")}
              className="group bg-paper p-6 text-left transition hover:bg-ink hover:text-paper sm:p-7"
            >
              <div className="flex items-center justify-between">

                <span className="font-display text-2xl text-clay">
                  03
                </span>

                <span className="text-xl text-mute transition group-hover:translate-x-1 group-hover:text-clay">
                  →
                </span>

              </div>

              <h3 className="mt-8 font-display text-xl">
                Orders
              </h3>

              <p className="mt-2 text-xs leading-5 text-mute group-hover:text-paper/50">
                Review customer orders and update their status.
              </p>
            </button>

          </div>

        </section>

        {/* Brand statement */}
        <section className="mt-8 border-t border-line bg-ink p-7 text-paper sm:p-9">

          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-clay">
            Malak Store
          </p>

          <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <h2 className="max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
              Every detail matters.
              <span className="italic text-clay">
                {" "}So does every scent.
              </span>
            </h2>

            <p className="max-w-xs text-xs leading-6 text-paper/40">
              Keep your collection organized and your customers close.
            </p>

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-paper">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-7 sm:px-8">

          <p className="font-display text-xl italic">
            Malak Store
          </p>

          <p className="text-[8px] uppercase tracking-[0.2em] text-mute">
            Administration
          </p>

        </div>
      </footer>

    </div>
  );
};

export default AdminDashboard;