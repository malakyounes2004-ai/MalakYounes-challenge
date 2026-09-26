import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getImageUrl } from "../services/api";
const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-plaster text-ink">
        <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col">

          {/* Top */}
          <div className="border-b border-line px-5 py-6 sm:px-8">
            <Link
              to="/"
              className="font-display text-2xl italic transition-opacity hover:opacity-60"
            >
              Malak
            </Link>
          </div>

          {/* Empty state */}
          <div className="flex flex-1 items-center justify-center px-5 py-20 sm:px-8">
            <div className="w-full max-w-xl text-center">

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-clay">
                Your bag
              </p>

              <h1 className="mt-5 font-display text-5xl font-medium tracking-tight sm:text-6xl">
                Nothing here
                <span className="italic text-clay"> yet.</span>
              </h1>

              <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-mute">
                Your fragrance selection is waiting for you.
                Explore the collection and find your next signature scent.
              </p>

              <Link
                to="/"
                className="mt-9 inline-flex items-center gap-4 bg-ink px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper transition hover:bg-pine"
              >
                Discover fragrances
                <span className="text-base leading-none">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-plaster text-ink">

      {/* Header */}
      <div className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-6 sm:px-8">

          <Link
            to="/"
            className="font-display text-2xl italic transition-opacity hover:opacity-60"
          >
            Malak
          </Link>

          <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-mute">
            Shopping bag
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16">

        {/* Page intro */}
        <div className="mb-10 flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-clay">
              Your selection
            </p>

            <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
              Shopping bag
            </h1>
          </div>

          <p className="text-sm text-mute">
            {cartItems.length}{" "}
            {cartItems.length === 1 ? "fragrance" : "fragrances"} selected
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">

          {/* Items */}
          <section>
            <div className="border-t border-line">

              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="grid grid-cols-[96px_1fr] gap-4 border-b border-line py-5 sm:grid-cols-[130px_1fr] sm:gap-6"
                >

                  {/* Image */}
                  <div className="aspect-[4/5] overflow-hidden bg-[#ddd4c6]">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-3 text-center">
                        <span className="font-display text-sm italic text-ink/30">
                          {item.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex min-w-0 flex-col justify-between py-1">

                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-mute">
                        Fragrance
                      </p>

                      <h2 className="mt-1.5 font-display text-xl leading-tight sm:text-2xl">
                        {item.name}
                      </h2>

                      <p className="mt-2 font-display text-base text-clay">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">

                      {/* Quantity */}
                      <div className="flex items-center border border-line bg-paper">

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1
                            )
                          }
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="flex h-9 w-9 items-center justify-center text-lg text-mute transition hover:bg-plaster hover:text-ink"
                        >
                          −
                        </button>

                        <span className="flex h-9 min-w-9 items-center justify-center border-x border-line px-2 text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          }
                          aria-label={`Increase quantity of ${item.name}`}
                          className="flex h-9 w-9 items-center justify-center text-lg text-mute transition hover:bg-plaster hover:text-ink"
                        >
                          +
                        </button>

                      </div>

                      {/* Subtotal + remove */}
                      <div className="flex items-center gap-5">

                        <p className="font-display text-lg text-ink">
                          $
                          {(
                            Number(item.price) * item.quantity
                          ).toFixed(2)}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[9px] font-semibold uppercase tracking-[0.16em] text-mute transition hover:text-clay"
                        >
                          Remove
                        </button>

                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Continue shopping */}
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-mute transition hover:text-ink"
            >
              <span>←</span>
              Continue shopping
            </Link>
          </section>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28">

            <div className="bg-ink p-6 text-paper sm:p-7">

              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-paper/50">
                Order summary
              </p>

              <div className="mt-7 border-t border-paper/15 pt-5">

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-paper/60">
                    Subtotal
                  </span>

                  <span className="font-display text-xl">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="text-sm text-paper/60">
                    Shipping
                  </span>

                  <span className="text-xs uppercase tracking-[0.12em] text-paper/50">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-paper/15 pt-5">

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-paper/45">
                      Total
                    </p>

                    <p className="mt-1 font-display text-3xl">
                      ${cartTotal.toFixed(2)}
                    </p>
                  </div>

                  <span className="font-display text-xl italic text-clay">
                    Malak
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-7 flex w-full items-center justify-between bg-paper px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-clay hover:text-paper"
              >
                <span>Proceed to checkout</span>
                <span className="text-base leading-none">→</span>
              </Link>

              <p className="mt-4 text-center text-[9px] leading-5 text-paper/35">
                Review your fragrance selection before completing your order.
              </p>
            </div>

          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-paper">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-7 sm:px-8">
          <p className="font-display text-xl italic">
            Malak Store
          </p>

          <Link
            to="/"
            className="text-[9px] font-semibold uppercase tracking-[0.18em] text-mute transition hover:text-ink"
          >
            Continue browsing
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Cart;