import { Link, useLocation } from "react-router-dom";

const Confirmation = () => {
  const location = useLocation();

  const orderId = location.state?.orderId;
  const totalAmount = location.state?.totalAmount;

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

          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-mute">
            Order complete
          </span>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto flex min-h-[calc(100vh-145px)] max-w-[1200px] items-center justify-center px-5 py-16 sm:px-8">

        <div className="w-full max-w-2xl text-center">

          {/* Success mark */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center border border-clay">

            <div className="flex h-12 w-12 items-center justify-center bg-ink text-xl text-paper">
              ✓
            </div>

          </div>

          <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-clay">
            Thank you for choosing Malak
          </p>

          <h1 className="mt-4 font-display text-5xl font-medium leading-none tracking-tight sm:text-6xl lg:text-7xl">
            Your order is
            <br />
            <span className="italic text-clay">
              on its way.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-mute">
            Your fragrance selection has been successfully placed.
            We’re looking forward to bringing your chosen scent to you.
          </p>

          {/* Order information */}
          {orderId && (
            <div className="mx-auto mt-10 max-w-md border-y border-line bg-paper">

              <div className="grid grid-cols-2">

                <div className="border-r border-line px-5 py-6">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-mute">
                    Order number
                  </p>

                  <p className="mt-2 font-display text-2xl">
                    #{orderId}
                  </p>
                </div>

                {totalAmount !== undefined && (
                  <div className="px-5 py-6">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-mute">
                      Total
                    </p>

                    <p className="mt-2 font-display text-2xl text-clay">
                      ${Number(totalAmount).toFixed(2)}
                    </p>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-9 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">

            <Link
              to="/"
              className="inline-flex w-full items-center justify-center gap-4 bg-ink px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper transition hover:bg-pine sm:w-auto"
            >
              Continue shopping
              <span className="text-base leading-none">→</span>
            </Link>

          </div>

          <p className="mt-10 font-display text-xl italic text-mute">
            A scent worth remembering.
          </p>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-ink text-paper">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-7 sm:px-8">

          <p className="font-display text-xl italic">
            Malak Store
          </p>

          <p className="text-[9px] uppercase tracking-[0.18em] text-paper/40">
            Fragrance, carefully chosen.
          </p>

        </div>
      </footer>

    </div>
  );
};

export default Confirmation;