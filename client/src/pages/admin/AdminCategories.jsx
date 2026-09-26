import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

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

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await api.get("/categories");

      setCategories(response.data);
      setError("");
    } catch (error) {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await api.put(
          `/categories/${editingId}`,
          formData,
          authConfig
        );
      } else {
        await api.post(
          "/categories",
          formData,
          authConfig
        );
      }

      resetForm();
      await fetchCategories();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);

    setFormData({
      name: category.name,
      description: category.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/categories/${id}`,
        authConfig
      );

      await fetchCategories();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete category."
      );
    }
  };

  const moveCategory = async (index, direction) => {
    const newIndex = index + direction;

    if (
      newIndex < 0 ||
      newIndex >= categories.length
    ) {
      return;
    }

    const reorderedCategories = [...categories];

    [
      reorderedCategories[index],
      reorderedCategories[newIndex],
    ] = [
      reorderedCategories[newIndex],
      reorderedCategories[index],
    ];

    setCategories(reorderedCategories);

    try {
      await api.put(
        "/categories/reorder",
        {
          ids: reorderedCategories.map(
            (category) => category.id
          ),
        },
        authConfig
      );
    } catch (error) {
      setError("Failed to reorder categories.");
      await fetchCategories();
    }
  };

  return (
    <div className="min-h-screen bg-plaster text-ink">

      {/* Page */}
      <main className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8 sm:py-14">

        {/* Intro */}
        <section className="border-b border-line pb-9">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-clay">
                Store organization
              </p>

              <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                Categories
              </h1>

              <p className="mt-3 max-w-md text-sm leading-6 text-mute">
                Create, organize and arrange the fragrance collections
                shown in your store.
              </p>
            </div>

            <div className="hidden border-l border-line pl-5 sm:block">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-mute">
                Collections
              </p>

              <p className="mt-1 font-display text-lg">
                {String(categories.length).padStart(2, "0")}
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

        {/* Add / Edit form */}
        <section className="mt-8 border border-line bg-paper">

          <div className="border-b border-line px-6 py-6 sm:px-8">

            <div className="flex items-center justify-between gap-4">

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-clay">
                  {editingId ? "Edit collection" : "New collection"}
                </p>

                <h2 className="mt-1 font-display text-2xl sm:text-3xl">
                  {editingId ? "Edit category" : "Add category"}
                </h2>
              </div>

              <span className="font-display text-xl italic text-mute">
                {editingId ? "Edit" : "01"}
              </span>

            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-7 p-6 sm:p-8 md:grid-cols-2"
          >

            {/* Name */}
            <div>
              <label
                htmlFor="category-name"
                className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-mute"
              >
                Category name *
              </label>

              <input
                id="category-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Floral"
                className="w-full border-b border-line bg-transparent px-0 py-3 text-sm text-ink outline-none transition placeholder:text-mute/45 focus:border-ink"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="category-description"
                className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-mute"
              >
                Description
              </label>

              <input
                id="category-description"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="A short description of this collection"
                className="w-full border-b border-line bg-transparent px-0 py-3 text-sm text-ink outline-none transition placeholder:text-mute/45 focus:border-ink"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 md:col-span-2">

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-4 bg-ink px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper transition hover:bg-pine disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update category"
                      : "Add category"}
                </span>

                {!saving && (
                  <span className="text-base leading-none">
                    →
                  </span>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-line px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:border-ink"
                >
                  Cancel
                </button>
              )}

            </div>
          </form>
        </section>

        {/* Categories list */}
        <section className="mt-8">

          <div className="mb-6 flex items-end justify-between gap-4">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-clay">
                Current collection
              </p>

              <h2 className="mt-2 font-display text-2xl sm:text-3xl">
                All categories
              </h2>
            </div>

            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-mute">
              {categories.length}{" "}
              {categories.length === 1
                ? "category"
                : "categories"}
            </p>

          </div>

          {loading ? (
            <div className="border-t border-line bg-paper px-6 py-8">
              <p className="text-sm text-mute">
                Loading categories...
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="border border-line bg-paper px-6 py-12 text-center">

              <p className="font-display text-2xl italic text-mute">
                No collections yet.
              </p>

              <p className="mt-2 text-sm text-mute">
                Add your first fragrance category above.
              </p>

            </div>
          ) : (
            <div className="border-t border-line">

              {categories.map((category, index) => (
                <article
                  key={category.id}
                  className="group border-b border-line bg-paper px-5 py-5 transition-colors hover:bg-[#ebe4da] sm:px-6 sm:py-6"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    {/* Category info */}
                    <div className="flex min-w-0 items-start gap-5">

                      <span className="shrink-0 pt-1 font-display text-sm text-clay">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0">

                        <h3 className="font-display text-2xl leading-tight sm:text-3xl">
                          {category.name}
                        </h3>

                        {category.description ? (
                          <p className="mt-2 max-w-xl text-sm leading-6 text-mute">
                            {category.description}
                          </p>
                        ) : (
                          <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-mute/60">
                            No description
                          </p>
                        )}

                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">

                      <div className="mr-2 flex items-center border border-line bg-paper">

                        <button
                          type="button"
                          onClick={() =>
                            moveCategory(index, -1)
                          }
                          disabled={index === 0}
                          aria-label={`Move ${category.name} up`}
                          className="flex h-9 w-9 items-center justify-center text-sm text-mute transition hover:bg-plaster hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          ↑
                        </button>

                        <span className="h-5 w-px bg-line" />

                        <button
                          type="button"
                          onClick={() =>
                            moveCategory(index, 1)
                          }
                          disabled={
                            index === categories.length - 1
                          }
                          aria-label={`Move ${category.name} down`}
                          className="flex h-9 w-9 items-center justify-center text-sm text-mute transition hover:bg-plaster hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          ↓
                        </button>

                      </div>

                      <button
                        type="button"
                        onClick={() => handleEdit(category)}
                        className="border border-line px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.17em] text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(category.id)
                        }
                        className="border border-line px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.17em] text-clay transition hover:border-clay hover:bg-clay hover:text-paper"
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
        <section className="mt-8 border-t border-line pt-6">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-[9px] uppercase tracking-[0.18em] text-mute">
              Categories control how fragrances are organized in your store.
            </p>

            <span className="font-display text-lg italic text-clay">
              Malak Store
            </span>

          </div>

        </section>

      </main>
    </div>
  );
};

export default AdminCategories;