import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/orders",
        authConfig
      );

      setOrders(response.data);
      setError("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrderDetails = async (orderId) => {
    try {
      setDetailsLoading(true);
      setError("");

      const response = await api.get(
        `/orders/${orderId}`,
        authConfig
      );

      setOrderDetails((currentDetails) => ({
        ...currentDetails,
        [orderId]: response.data,
      }));
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load order details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const toggleOrderDetails = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);

    if (!orderDetails[orderId]) {
      await fetchOrderDetails(orderId);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      setError("");

      await api.put(
        `/orders/${orderId}/status`,
        { status },
        authConfig
      );

      await fetchOrders();

      if (orderDetails[orderId]) {
        await fetchOrderDetails(orderId);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "border-pine/30 bg-pine/10 text-pine";

      case "Cancelled":
        return "border-clay/40 bg-clay/10 text-clay";

      case "Processing":
        return "border-ink/20 bg-ink/5 text-ink";

      case "Confirmed":
        return "border-clay/30 bg-clay/10 text-clay";

      default:
        return "border-line bg-paper text-mute";
    }
  };

  return (
    <div className="min-h-screen bg-plaster text-ink">

      {/* Main */}
      <main className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8 sm:py-14">

        {/* Intro */}
        <section className="border-b border-line pb-9">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-clay">
                Store activity
              </p>

              <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                Orders
              </h1>

              <p className="mt-3 max-w-md text-sm leading-6 text-mute">
                Review customer orders, view their details and manage
                order status.
              </p>
            </div>

            <div className="hidden border-l border-line pl-5 sm:block">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-mute">
                Orders
              </p>

              <p className="mt-1 font-display text-lg">
                {String(orders.length).padStart(2, "0")}
              </p>
            </div>

          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-start justify-between gap-4 border-l-2 border-clay bg-paper px-4 py-3">

            <p className="text-sm leading-6 text-ink">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 text-lg leading-none text-mute transition hover:text-ink"
              aria-label="Dismiss error"
            >
              ×
            </button>

          </div>
        )}

        {/* Orders */}
        <section className="mt-8">

          <div className="mb-6 flex items-end justify-between gap-4">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-clay">
                Customer activity
              </p>

              <h2 className="mt-2 font-display text-2xl sm:text-3xl">
                All orders
              </h2>
            </div>

            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-mute">
              {orders.length}{" "}
              {orders.length === 1 ? "order" : "orders"}
            </p>

          </div>

          {loading ? (
            <div className="border-t border-line bg-paper px-6 py-8">
              <p className="text-sm text-mute">
                Loading orders...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="border border-line bg-paper px-6 py-12 text-center">

              <p className="font-display text-2xl italic text-mute">
                No orders yet.
              </p>

              <p className="mt-2 text-sm text-mute">
                Customer orders will appear here once they are placed.
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {orders.map((order, index) => {
                const details = orderDetails[order.id];

                return (
                  <article
                    key={order.id}
                    className="overflow-hidden border border-line bg-paper"
                  >

                    {/* Order summary */}
                    <div className="p-5 sm:p-6">

                      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

                        {/* Customer */}
                        <div className="flex min-w-0 gap-5">

                          <div className="hidden h-11 w-11 shrink-0 items-center justify-center border border-line font-display text-sm text-clay sm:flex">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-3">

                              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-mute">
                                Order #{order.id}
                              </p>

                              <span
                                className={`border px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] ${getStatusStyle(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>

                            </div>

                            <h2 className="mt-2 truncate font-display text-2xl leading-tight sm:text-3xl">
                              {order.customer_name}
                            </h2>

                            <div className="mt-2 flex flex-col gap-1 text-xs text-mute sm:flex-row sm:gap-4">

                              <span>
                                {order.email}
                              </span>

                              {order.phone && (
                                <span>
                                  {order.phone}
                                </span>
                              )}

                            </div>

                            <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-mute/70">
                              {new Date(
                                order.created_at
                              ).toLocaleString()}
                            </p>

                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                          <div className="sm:text-right">

                            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-mute">
                              Total
                            </p>

                            <p className="mt-1 font-display text-2xl text-clay">
                              $
                              {Number(
                                order.total_amount
                              ).toFixed(2)}
                            </p>

                          </div>

                          <select
                            value={order.status}
                            onChange={(event) =>
                              updateStatus(
                                order.id,
                                event.target.value
                              )
                            }
                            aria-label={`Update status for order ${order.id}`}
                            className="border border-line bg-paper px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink outline-none transition focus:border-ink"
                          >
                            <option value="Pending">
                              Pending
                            </option>

                            <option value="Confirmed">
                              Confirmed
                            </option>

                            <option value="Processing">
                              Processing
                            </option>

                            <option value="Completed">
                              Completed
                            </option>

                            <option value="Cancelled">
                              Cancelled
                            </option>
                          </select>

                          <button
                            type="button"
                            onClick={() =>
                              toggleOrderDetails(order.id)
                            }
                            className="flex items-center justify-between gap-5 bg-ink px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-paper transition hover:bg-pine"
                          >
                            <span>
                              {expandedOrderId === order.id
                                ? "Hide details"
                                : "View details"}
                            </span>

                            <span className="text-base leading-none">
                              {expandedOrderId === order.id
                                ? "↑"
                                : "→"}
                            </span>
                          </button>

                        </div>

                      </div>
                    </div>

                    {/* Details */}
                    {expandedOrderId === order.id && (
                      <div className="border-t border-line bg-plaster p-5 sm:p-6">

                        {detailsLoading && !details ? (
                          <div className="bg-paper p-6">
                            <p className="text-sm text-mute">
                              Loading order details...
                            </p>
                          </div>
                        ) : details ? (
                          <div className="space-y-7">

                            {/* Customer details */}
                            <div>

                              <div className="mb-4 flex items-end justify-between gap-4">

                                <div>
                                  <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-clay">
                                    Customer
                                  </p>

                                  <h3 className="mt-1 font-display text-2xl">
                                    Customer details
                                  </h3>
                                </div>

                                <span className="font-display text-lg italic text-mute">
                                  01
                                </span>

                              </div>

                              <div className="grid border-t border-line bg-paper sm:grid-cols-2">

                                <div className="border-b border-line p-5 sm:border-r">
                                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-mute">
                                    Name
                                  </p>

                                  <p className="mt-2 text-sm font-medium">
                                    {details.customer_name}
                                  </p>
                                </div>

                                <div className="border-b border-line p-5">
                                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-mute">
                                    Email
                                  </p>

                                  <p className="mt-2 break-all text-sm font-medium">
                                    {details.email}
                                  </p>
                                </div>

                                <div className="border-b border-line p-5 sm:border-r">
                                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-mute">
                                    Phone
                                  </p>

                                  <p className="mt-2 text-sm font-medium">
                                    {details.phone || "—"}
                                  </p>
                                </div>

                                <div className="p-5">
                                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-mute">
                                    Delivery address
                                  </p>

                                  <p className="mt-2 text-sm font-medium leading-6">
                                    {details.address || "—"}
                                  </p>
                                </div>

                              </div>
                            </div>

                            {/* Order items */}
                            <div>

                              <div className="mb-4 flex items-end justify-between gap-4">

                                <div>
                                  <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-clay">
                                    Selection
                                  </p>

                                  <h3 className="mt-1 font-display text-2xl">
                                    Order items
                                  </h3>
                                </div>

                                <span className="font-display text-lg italic text-mute">
                                  02
                                </span>

                              </div>

                              <div className="overflow-x-auto border border-line bg-paper">

                                <table className="w-full min-w-[560px] text-left">

                                  <thead>
                                    <tr className="border-b border-line">
                                      <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-mute">
                                        Product
                                      </th>

                                      <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-mute">
                                        Price
                                      </th>

                                      <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-mute">
                                        Qty
                                      </th>

                                      <th className="px-5 py-4 text-right text-[9px] font-semibold uppercase tracking-[0.18em] text-mute">
                                        Subtotal
                                      </th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {details.items.length === 0 ? (
                                      <tr>
                                        <td
                                          colSpan="4"
                                          className="px-5 py-8 text-center text-sm text-mute"
                                        >
                                          No items found.
                                        </td>
                                      </tr>
                                    ) : (
                                      details.items.map((item) => (
                                        <tr
                                          key={item.product_id}
                                          className="border-b border-line last:border-b-0"
                                        >
                                          <td className="px-5 py-4">

                                            <p className="font-display text-base">
                                              {item.name}
                                            </p>

                                          </td>

                                          <td className="px-5 py-4 text-sm text-mute">
                                            $
                                            {Number(
                                              item.price
                                            ).toFixed(2)}
                                          </td>

                                          <td className="px-5 py-4 text-sm text-mute">
                                            {item.quantity}
                                          </td>

                                          <td className="px-5 py-4 text-right font-display text-base">
                                            $
                                            {(
                                              Number(
                                                item.price
                                              ) *
                                              Number(
                                                item.quantity
                                              )
                                            ).toFixed(2)}
                                          </td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>

                                </table>
                              </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-end">

                              <div className="w-full bg-ink p-6 text-paper sm:max-w-sm">

                                <div className="flex items-center justify-between border-b border-paper/15 pb-4">
                                  <span className="text-sm text-paper/50">
                                    Order total
                                  </span>

                                  <span className="font-display text-2xl text-clay">
                                    $
                                    {Number(
                                      details.total_amount
                                    ).toFixed(2)}
                                  </span>
                                </div>

                                <p className="mt-4 text-[8px] uppercase tracking-[0.18em] text-paper/30">
                                  Malak Store · Order #{order.id}
                                </p>

                              </div>
                            </div>

                          </div>
                        ) : null}

                      </div>
                    )}

                  </article>
                );
              })}

            </div>
          )}

        </section>

      </main>
    </div>
  );
};

export default AdminOrders;