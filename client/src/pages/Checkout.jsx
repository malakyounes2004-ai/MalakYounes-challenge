import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (cartItems.length === 0) {
      setError("Your bag is empty.");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        customer: formData,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post("/orders", orderData);

      clearCart();

      navigate("/confirmation", {
        state: {
          orderId: response.data.orderId,
          totalAmount: response.data.totalAmount,
        },
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-plaster text-ink">
        <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col">

          <div className="border-b border-line bg-paper px-5 py-6 sm:px-8">
            <Link
              to="/"
              className="font-display text-2xl italic transition-opacity hover:opacity-60"
            >
              Malak
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center px-5 py-20">
            <div className="max-w-xl text-center">

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-clay">
                Checkout
              </p>

              <h1 className="mt-5 font-display text-5xl font-medium tracking-tight sm:text-6xl">
                Your bag is
                <span className="italic text-clay"> empty.</span>
              </h1>

              <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-mute">
                Add a fragrance to your bag before continuing to checkout.
              </p>

              <Link
                to="/"
                className="mt-9 inline-flex items-center gap-4 bg-ink px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper transition hover:bg-pine"
              >
                Browse fragrances
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

      {/* Top bar */}
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-6 sm:px-8">

          <Link
            to="/"
            className="font-display text-2xl italic transition-opacity hover:opacity-60"
          >
            Malak
          </Link>

          <Link
            to="/cart"
            className="text-[9px] font-semibold uppercase tracking-[0.2em] text-mute transition hover:text-ink"
          >
            ← Back to bag
          </Link>

        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16">

        {/* Intro */}
        <div className="mb-10 border-b border-line pb-8">

          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-clay">
            Final step
          </p>

          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
            Complete your order
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-mute">
            Enter your details below and we’ll prepare your fragrance selection.
          </p>

        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">

          {/* Customer information */}
          <form onSubmit={handleSubmit}>

            <div className="bg-paper p-6 sm:p-8">

              <div className="mb-8 flex items-end justify-between gap-4 border-b border-line pb-5">

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-mute">
                    01
                  </p>

                  <h2 className="mt-1 font-display text-2xl sm:text-3xl">
                    Your details
                  </h2>
                </div>

                <p className="text-[9px] uppercase tracking-[0.16em] text-mute">
                  Required fields marked *
                </p>

              </div>

              <div className="space-y-6">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-mute"
                  >
                    Full name *
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                    className="w-full border-b border-line bg-transparent px-0 py-3 text-sm text-ink outline-none transition placeholder:text-mute/50 focus:border-ink"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-mute"
                  >
                    Email address *
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full border-b border-line bg-transparent px-0 py-3 text-sm text-ink outline-none transition placeholder:text-mute/50 focus:border-ink"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-mute"
                  >
                    Phone
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    placeholder="Your phone number"
                    className="w-full border-b border-line bg-transparent px-0 py-3 text-sm text-ink outline-none transition placeholder:text-mute/50 focus:border-ink"
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-mute"
                  >
                    Delivery address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    autoComplete="street-address"
                    placeholder="Where should we deliver your order?"
                    className="w-full resize-none border-b border-line bg-transparent px-0 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-mute/50 focus:border-ink"
                  />
                </div>

              </div>

              {error && (
                <div className="mt-7 border-l-2 border-clay bg-plaster px-4 py-3 text-sm leading-6 text-ink">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-8 flex w-full items-center justify-between bg-ink px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper transition hover:bg-pine disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  {loading ? "Placing order..." : "Place order"}
                </span>

                <span className="text-base leading-none">
                  →
                </span>
              </button>

              <p className="mt-4 text-center text-[9px] leading-5 text-mute">
                By placing your order, you confirm that the information
                provided is correct.
              </p>

            </div>
          </form>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-28">

            <div className="bg-ink p-6 text-paper sm:p-7">

              <div className="flex items-end justify-between gap-4 border-b border-paper/15 pb-5">

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-paper/45">
                    02
                  </p>

                  <h2 className="mt-1 font-display text-2xl">
                    Your selection
                  </h2>
                </div>

                <span className="font-display text-lg italic text-clay">
                  Malak
                </span>

              </div>

              <div className="divide-y divide-paper/10">

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 py-4"
                  >

                    <div className="h-16 w-14 shrink-0 overflow-hidden bg-[#ddd4c6]">

                      {item.image ? (
                        <img
                          src={`http://localhost:5000/uploads/${item.image}`}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center p-1 text-center">
                          <span className="font-display text-[8px] italic text-ink/30">
                            {item.name}
                          </span>
                        </div>
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="font-display text-base leading-tight">
                        {item.name}
                      </p>

                      <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-paper/45">
                        Qty {item.quantity}
                      </p>

                    </div>

                    <p className="shrink-0 font-display text-base text-clay">
                      $
                      {(
                        Number(item.price) * item.quantity
                      ).toFixed(2)}
                    </p>

                  </div>
                ))}

              </div>

              <div className="mt-2 border-t border-paper/15 pt-5">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-paper/55">
                    Subtotal
                  </span>

                  <span className="font-display text-xl">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-paper/55">
                    Shipping
                  </span>

                  <span className="text-[9px] uppercase tracking-[0.12em] text-paper/40">
                    Calculated at checkout
                  </span>
                </div>

                <div className="mt-5 border-t border-paper/15 pt-5">

                  <div className="flex items-end justify-between">

                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-paper/40">
                        Total
                      </p>

                      <p className="mt-1 font-display text-3xl">
                        ${cartTotal.toFixed(2)}
                      </p>
                    </div>

                  </div>

                </div>
              </div>

            </div>

          </aside>
        </div>
      </main>

      <footer className="border-t border-line bg-paper">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-7 sm:px-8">

          <p className="font-display text-xl italic">
            Malak Store
          </p>

          <p className="text-[9px] uppercase tracking-[0.18em] text-mute">
            Fragrance, carefully chosen.
          </p>

        </div>
      </footer>

    </div>
  );
};

export default Checkout;