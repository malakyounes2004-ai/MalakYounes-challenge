import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Header = () => {
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md">
      <div className="h-[3px] bg-clay" />

      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-5 sm:px-7">

        {/* Left */}
        <div className="hidden flex-1 items-center sm:flex">
          <p className="hidden text-[10px] font-medium uppercase tracking-[0.24em] text-mute sm:block">
            Curated goods
          </p>
        </div>

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group shrink-0 text-left sm:text-center"
        >
          <span className="font-display text-[1.7rem] font-medium italic leading-none tracking-tight text-ink transition-opacity group-hover:opacity-70 sm:text-[1.9rem]">
            Malak
          </span>

          <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.34em] text-mute">
            Store
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center justify-end gap-2 sm:flex-1 sm:gap-4">
          <nav className="hidden items-center gap-7 lg:flex">
            <a
              href="/#categories"
              className="relative text-[10px] font-semibold uppercase tracking-[0.18em] text-mute transition-colors hover:text-ink"
            >
              Categories
            </a>

            <a
              href="/#products"
              className="relative text-[10px] font-semibold uppercase tracking-[0.18em] text-mute transition-colors hover:text-ink"
            >
              Products
            </a>
          </nav>

          {/* Cart */}
          <Link
            to="/cart"
            onClick={closeMenu}
            className="group inline-flex items-center gap-2 border border-ink px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-ink transition-all duration-200 hover:bg-ink hover:text-paper"
          >
            <span>Bag</span>

            <span className="font-display text-sm tabular-nums text-clay transition-colors group-hover:text-paper">
              {String(cartCount).padStart(2, "0")}
            </span>
          </Link>

          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-[38px] w-[38px] items-center justify-center border border-line text-ink transition hover:border-ink lg:hidden"
          >
            <span className="sr-only">
              {menuOpen ? "Close menu" : "Open menu"}
            </span>

            <span className="flex w-4 flex-col gap-1.5">
              <span
                className={`block h-px w-full bg-ink transition-transform duration-200 ${
                  menuOpen
                    ? "translate-y-[4px] rotate-45"
                    : ""
                }`}
              />

              <span
                className={`block h-px w-full bg-ink transition-transform duration-200 ${
                  menuOpen
                    ? "-translate-y-[3px] -rotate-45"
                    : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-line bg-paper lg:hidden">
          <nav className="mx-auto max-w-[1200px] px-5 sm:px-7">
            <a
              href="/#categories"
              onClick={closeMenu}
              className="flex items-center justify-between border-b border-line py-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink"
            >
              <span>Categories</span>
              <span className="text-clay">01</span>
            </a>

            <a
              href="/#products"
              onClick={closeMenu}
              className="flex items-center justify-between py-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink"
            >
              <span>Products</span>
              <span className="text-clay">02</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;