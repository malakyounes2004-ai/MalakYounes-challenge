import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      end: true,
      number: "01",
    },
    {
      name: "Categories",
      path: "/admin/categories",
      number: "02",
    },
    {
      name: "Products",
      path: "/admin/products",
      number: "03",
    },
    {
      name: "Orders",
      path: "/admin/orders",
      number: "04",
    },
  ];

  return (
    <div className="min-h-screen bg-plaster text-ink">
      <div className="flex min-h-screen flex-col md:flex-row">

        {/* Sidebar */}
        <aside className="w-full shrink-0 bg-ink text-paper md:sticky md:top-0 md:h-screen md:w-[250px]">
          <div className="flex h-full flex-col">

            {/* Brand */}
            <div className="border-b border-white/10 px-6 py-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-2xl italic leading-none">
                    Malak
                  </p>

                  <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.32em] text-white/45">
                    Store
                  </p>
                </div>

                <span className="mt-1 h-2 w-2 rounded-full bg-clay" />
              </div>

              <div className="mt-7">
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-clay">
                  Management
                </p>

                <p className="mt-1 text-xs text-white/45">
                  Admin Panel
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-row gap-1.5 overflow-x-auto p-4 md:flex-col md:gap-1 md:overflow-visible md:p-5">
              <p className="mb-2 hidden px-3 text-[8px] font-semibold uppercase tracking-[0.22em] text-white/30 md:block">
                Navigation
              </p>

              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `group flex items-center justify-between gap-5 px-3.5 py-3 transition-all duration-200 ${
                      isActive
                        ? "bg-paper text-ink"
                        : "text-white/55 hover:bg-white/5 hover:text-paper"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-3">
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full transition ${
                            isActive
                              ? "bg-clay"
                              : "bg-white/20 group-hover:bg-clay"
                          }`}
                        />

                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
                          {item.name}
                        </span>
                      </span>

                      <span
                        className={`font-display text-xs ${
                          isActive
                            ? "text-clay"
                            : "text-white/20 group-hover:text-white/40"
                        }`}
                      >
                        {item.number}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Bottom */}
            <div className="border-t border-white/10 p-5">
              <div className="mb-5 hidden md:block">
                <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/25">
                  Malak Store
                </p>

                <p className="mt-1 text-[10px] leading-4 text-white/40">
                  Fragrance, carefully chosen.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="group flex w-full items-center justify-between border border-white/10 px-3.5 py-3 text-left transition hover:border-white/25 hover:bg-white/5"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55 transition group-hover:text-paper">
                  Logout
                </span>

                <span className="text-clay transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;