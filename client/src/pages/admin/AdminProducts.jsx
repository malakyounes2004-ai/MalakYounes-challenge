import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    is_available: true,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const [productsResponse, categoriesResponse] =
        await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);

      setProducts(productsResponse.data);
      setCategories(categoriesResponse.data);
      setError("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0] || null);
  };

  const resetForm = () => {
    setFormData({
      category_id: "",
      name: "",
      description: "",
      price: "",
      stock: "",
      is_available: true,
    });

    setSelectedImage(null);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !formData.category_id ||
      !formData.name.trim() ||
      formData.price === "" ||
      formData.stock === ""
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (Number(formData.price) < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      setError("Stock must be a valid non-negative number.");
      return;
    }

    try {
      setSaving(true);

      const productData = {
        categoryId: Number(formData.category_id),
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        isAvailable: formData.is_available,
      };

      let productId = editingId;

      if (editingId) {
        await api.put(
          `/products/${editingId}`,
          productData,
          authConfig
        );
      } else {
        const response = await api.post(
          "/products",
          productData,
          authConfig
        );

        productId = response.data.id;
      }

      if (selectedImage && productId) {
        const imageData = new FormData();

        imageData.append("image", selectedImage);

        await api.post(
          `/products/${productId}/upload`,
          imageData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      resetForm();
      await fetchData();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setFormData({
      category_id: product.category_id,
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      is_available: Boolean(product.is_available),
    });

    setSelectedImage(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/products/${id}`,
        authConfig
      );

      await fetchData();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  const toggleAvailability = async (product) => {
    try {
      setError("");

      await api.put(
        `/products/${product.id}`,
        {
          categoryId: product.category_id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          stock: Number(product.stock),
          isAvailable: !product.is_available,
        },
        authConfig
      );

      await fetchData();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update availability."
      );
    }
  };

  return (
    <div className="min-h-screen bg-plaster px-4 py-6 text-ink sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-8 border-b border-line pb-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-clay">
                Malak Store · Inventory
              </p>

              <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
                Products
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-mute">
                Manage your fragrance collection, pricing, stock
                and availability.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="border border-line bg-paper px-4 py-3 text-center">
                <p className="font-display text-xl leading-none">
                  {products.length}
                </p>

                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-mute">
                  Products
                </p>
              </div>

              <div className="border border-line bg-paper px-4 py-3 text-center">
                <p className="font-display text-xl leading-none">
                  {products.filter(
                    (product) => product.is_available
                  ).length}
                </p>

                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-mute">
                  Available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-7 flex items-start justify-between gap-4 border border-clay/30 bg-paper px-4 py-4 text-sm text-clay">
            <div>
              <p className="font-semibold">
                Something went wrong
              </p>

              <p className="mt-1 text-xs text-mute">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-xs font-semibold uppercase tracking-[0.12em] text-mute transition hover:text-ink"
            >
              Close
            </button>
          </div>
        )}

        {/* Product Form */}
        <section className="mb-10 border border-line bg-paper">
          <div className="flex flex-col gap-3 border-b border-line px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-clay">
                {editingId ? "Edit collection" : "New fragrance"}
              </p>

              <h2 className="mt-1 font-display text-2xl font-medium">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
            </div>

            {editingId && (
              <span className="border border-line px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-mute">
                Editing #{editingId}
              </span>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-x-7 gap-y-6 p-5 sm:p-7 md:grid-cols-2"
          >
            {/* Product Name */}
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-mute">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Oud Étoile"
                className="w-full border-b border-line bg-transparent px-0 py-3 text-sm text-ink outline-none transition placeholder:text-mute/60 focus:border-ink"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-mute">
                Category
              </label>

              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full border-b border-line bg-transparent px-0 py-3 text-sm text-ink outline-none transition focus:border-ink"
              >
                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-mute">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Describe the fragrance..."
                className="w-full resize-none border-b border-line bg-transparent px-0 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-mute/60 focus:border-ink"
              />
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-mute">
                Price
              </label>

              <div className="flex items-center gap-2 border-b border-line">
                <span className="font-display text-lg text-clay">
                  $
                </span>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full bg-transparent py-3 text-sm text-ink outline-none placeholder:text-mute/60"
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-mute">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                step="1"
                required
                placeholder="0"
                className="w-full border-b border-line bg-transparent px-0 py-3 text-sm text-ink outline-none transition placeholder:text-mute/60 focus:border-ink"
              />
            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-mute">
                Product Image
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-line bg-plaster px-5 py-7 text-center transition hover:border-ink">
                <span className="font-display text-lg">
                  {selectedImage
                    ? selectedImage.name
                    : editingId
                      ? "Choose a new image"
                      : "Choose product image"}
                </span>

                <span className="mt-2 text-[10px] uppercase tracking-[0.14em] text-mute">
                  JPG · PNG · WEBP · Max 5MB
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Availability */}
            <label className="flex cursor-pointer items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                name="is_available"
                checked={formData.is_available}
                onChange={handleChange}
                className="h-4 w-4 accent-[#111111]"
              />

              <span>
                <span className="block text-sm font-medium">
                  Product is available
                </span>

                <span className="mt-0.5 block text-xs text-mute">
                  Customers can purchase this fragrance.
                </span>
              </span>
            </label>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-1 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-ink px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-clay disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Product"
                    : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-line px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink transition hover:border-ink hover:bg-plaster"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Products List */}
        <section className="border border-line bg-paper">
          <div className="flex flex-col gap-3 border-b border-line px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-clay">
                Collection
              </p>

              <h2 className="mt-1 font-display text-2xl font-medium">
                All Products
              </h2>
            </div>

            <p className="text-xs text-mute">
              {products.length} fragrance
              {products.length !== 1 ? "s" : ""}
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center">
              <p className="font-display text-xl">
                Loading collection...
              </p>

              <p className="mt-2 text-xs text-mute">
                Please wait a moment.
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-display text-2xl">
                No products yet.
              </p>

              <p className="mt-2 text-sm text-mute">
                Add your first fragrance using the form above.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {products.map((product, index) => (
                <article
                  key={product.id}
                  className="group px-5 py-6 transition hover:bg-plaster/50 sm:px-7"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    {/* Product Info */}
                    <div className="flex min-w-0 gap-5">
                      <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-plaster sm:h-32 sm:w-28">
                        {product.image ? (
                          <img
                            src={`http://localhost:5000/uploads/${product.image}`}
                            alt={product.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-3 text-center">
                            <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-mute">
                              No Image
                            </span>
                          </div>
                        )}

                        <div className="absolute left-2 top-2 bg-paper px-2 py-1">
                          <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-mute">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>

                      <div className="min-w-0 pt-1">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-clay">
                          {product.category_name}
                        </p>

                        <h3 className="mt-2 truncate font-display text-xl font-medium sm:text-2xl">
                          {product.name}
                        </h3>

                        {product.description && (
                          <p className="mt-2 line-clamp-2 max-w-xl text-xs leading-5 text-mute">
                            {product.description}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                          <span className="font-display text-base">
                            ${Number(product.price).toFixed(2)}
                          </span>

                          <span className="text-xs text-mute">
                            Stock:{" "}
                            <span className="font-medium text-ink">
                              {product.stock}
                            </span>
                          </span>

                          <span
                            className={`border px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.13em] ${
                              product.is_available
                                ? "border-pine/30 bg-pine/5 text-pine"
                                : "border-line bg-plaster text-mute"
                            }`}
                          >
                            {product.is_available
                              ? "Available"
                              : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 lg:shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          toggleAvailability(product)
                        }
                        className="border border-line px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.13em] text-ink transition hover:border-ink hover:bg-plaster"
                      >
                        {product.is_available
                          ? "Disable"
                          : "Enable"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="bg-ink px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.13em] text-paper transition hover:bg-clay"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(product.id)
                        }
                        className="border border-clay/30 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.13em] text-clay transition hover:bg-clay hover:text-paper"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Bottom note */}
        <div className="flex flex-col gap-2 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[9px] uppercase tracking-[0.16em] text-mute">
            Malak Store · Product management
          </p>

          <p className="text-[9px] uppercase tracking-[0.16em] text-mute">
            Keep stock & availability up to date
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;