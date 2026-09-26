import { useEffect, useState } from "react";
import api, { getImageUrl } from "../services/api";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";


const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          api.get("/categories"),
          api.get("/products"),
        ]);

        setCategories(categoriesResponse.data);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error("Failed to load store data:", error);
      }
    };

    fetchStoreData();
  }, []);

  const featuredProduct =
    products.find(
      (product) =>
        product.image &&
        product.is_available &&
        product.stock > 0
    ) ||
    products.find((product) => product.image) ||
    products[0] ||
    null;

  const inStockCount = products.filter(
    (product) => product.is_available && product.stock > 0
  ).length;

  const selectedCategoryData = categories.find(
    (category) => String(category.id) === String(selectedCategory)
  );

  const filteredProducts =
    selectedCategory === null
      ? products
      : products.filter((product) => {
          const matchesId =
            product.category_id != null &&
            String(product.category_id) === String(selectedCategory);

          const matchesName =
            selectedCategoryData &&
            product.category_name &&
            product.category_name.trim().toLowerCase() ===
              selectedCategoryData.name.trim().toLowerCase();

          return matchesId || matchesName;
        });

  const chooseCategory = (categoryId) => {
    setSelectedCategory(categoryId);

    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-plaster text-ink">
      <Header />

      {/* HERO */}
      <section className="overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-[1200px] lg:grid-cols-[1fr_0.9fr]">
          {/* Hero copy */}
          <div className="flex min-w-0 flex-col justify-between px-5 pb-9 pt-12 sm:px-8 sm:pb-12 sm:pt-16 lg:min-h-[600px] lg:border-r lg:border-line lg:px-12 lg:py-20">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-7 shrink-0 bg-clay" />

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-mute sm:text-[10px] sm:tracking-[0.3em]">
                  The fragrance collection
                </p>
              </div>

              <h1 className="mt-7 max-w-[650px] font-display text-[clamp(2.8rem,10vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.045em] sm:mt-9 sm:text-[4.5rem] lg:text-[clamp(4rem,5.5vw,6rem)] lg:leading-[0.94]">
                A scent
                <br />
                <span className="italic text-clay">
                  worth remembering.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-6 text-mute sm:mt-8 sm:text-base sm:leading-7">
                Discover fragrances selected to become part of your
                everyday ritual — from timeless signatures to scents
                made to leave an impression.
              </p>

              <a
                href="#products"
                onClick={() => setSelectedCategory(null)}
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-5 bg-ink px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-paper transition hover:bg-pine sm:mt-9 sm:px-6 sm:tracking-[0.2em]"
              >
                Discover fragrances
                <span aria-hidden="true" className="text-base leading-none">
                  →
                </span>
              </a>
            </div>

            {/* Collection numbers */}
            <div className="mt-10 grid max-w-md grid-cols-2 border-t border-line pt-5 sm:mt-14">
              <div>
                <p className="font-display text-2xl text-ink sm:text-3xl">
                  {String(products.length).padStart(2, "0")}
                </p>

                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-mute sm:tracking-[0.2em]">
                  Fragrances
                </p>
              </div>

              <div className="border-l border-line pl-5">
                <p className="font-display text-2xl text-ink sm:text-3xl">
                  {String(inStockCount).padStart(2, "0")}
                </p>

                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-mute sm:tracking-[0.2em]">
                  Available now
                </p>
              </div>
            </div>
          </div>

          {/* Featured fragrance */}
          <div className="min-w-0 bg-paper p-3 sm:p-6 lg:p-8">
            {featuredProduct ? (
              <div className="relative flex h-[380px] flex-col overflow-hidden bg-white sm:h-[480px] lg:h-full lg:min-h-[600px]">
                {featuredProduct.image ? (
                  <img
                    src={getImageUrl(featuredProduct.image)}
                    alt={featuredProduct.name}
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                    <span className="font-display text-3xl italic text-ink/30">
                      {featuredProduct.name}
                    </span>
                  </div>
                )}

                <div className="absolute left-3 top-3 sm:left-5 sm:top-5">
                  <span className="inline-block bg-ink/75 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-paper backdrop-blur-sm">
                    Featured fragrance
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-ink/90 p-4 text-paper backdrop-blur-md sm:p-6">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-paper/50">
                    Signature scent
                  </p>

                  <div className="mt-2 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-xl leading-tight sm:text-3xl">
                        {featuredProduct.name}
                      </h2>

                      {featuredProduct.category_name && (
                        <p className="mt-1 text-xs text-paper/55">
                          {featuredProduct.category_name}
                        </p>
                      )}
                    </div>

                    <p className="shrink-0 font-display text-xl text-clay sm:text-2xl">
                      ${Number(featuredProduct.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-[380px] items-center justify-center border border-line p-6 sm:h-[480px] lg:h-full lg:min-h-[600px]">
                <p className="max-w-xs text-center font-display text-2xl italic text-mute">
                  Your fragrance collection will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      

      {/* PRODUCTS */}
      <section
        id="products"
        className="mx-auto max-w-[1200px] scroll-mt-20 px-3 py-12 sm:px-8 sm:py-20"
      >
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-clay">
              The collection
            </p>

            <h2 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
              Our fragrances
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-mute">
            Timeless scents, carefully selected for every mood,
            moment and occasion.
          </p>
        </div>

       {/* Category filters */}
<div
  id="categories"
  className="mb-6 flex scroll-mt-28 flex-wrap gap-2"
  aria-label="Filter fragrances"
>
          <button
            type="button"
            onClick={() => chooseCategory(null)}
            aria-pressed={selectedCategory === null}
            className={`min-h-10 border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] transition sm:px-4 ${
              selectedCategory === null
                ? "border-ink bg-ink text-paper"
                : "border-line text-mute hover:border-ink hover:text-ink"
            }`}
          >
            All Fragrances
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => chooseCategory(category.id)}
              aria-pressed={
                String(selectedCategory) === String(category.id)
              }
              className={`min-h-10 border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] transition sm:px-4 ${
                String(selectedCategory) === String(category.id)
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-mute hover:border-ink hover:text-ink"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="border-t border-line pt-6 text-sm text-mute">
            {selectedCategory === null
              ? "No fragrances available."
              : "No fragrances in this collection yet."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-7 border-t border-line pt-5 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3 lg:gap-y-12">
            {filteredProducts.map((product) => {
              const canAdd =
                product.is_available && product.stock > 0;

              return (
                <article
                  key={product.id}
                  className="group flex min-w-0 flex-col overflow-hidden bg-paper"
                >
                  {/* Product image */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-white">
                    {product.image ? (
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain transition duration-500 ease-out group-hover:scale-[1.035]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-4 text-center">
                        <span className="font-display text-lg italic text-ink/25 sm:text-2xl">
                          {product.name}
                        </span>
                      </div>
                    )}

                    {!canAdd && (
                      <span className="absolute left-2 top-2 bg-paper/95 px-2 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-mute sm:left-3 sm:top-3 sm:px-2.5 sm:text-[9px]">
                        Sold out
                      </span>
                    )}

                    {canAdd && product.stock <= 3 && (
                      <span className="absolute left-2 top-2 bg-ink px-2 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-paper sm:left-3 sm:top-3 sm:px-2.5 sm:text-[9px]">
                        Only {product.stock} left
                      </span>
                    )}
                  </div>

                  {/* Product information */}
                  <div className="flex flex-1 flex-col px-2.5 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-5">
                    <p className="truncate text-[8px] font-semibold uppercase tracking-[0.1em] text-mute sm:text-[9px] sm:tracking-[0.2em]">
                      {product.category_name || "Fragrance"}
                    </p>

                    <div className="mt-1.5 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                      <h3 className="line-clamp-2 min-h-[2.5em] min-w-0 font-display text-[1rem] leading-[1.25] sm:text-[1.4rem]">
                        {product.name}
                      </h3>

                      <span className="shrink-0 font-display text-base text-clay sm:text-lg">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </div>

                    {product.description && (
                      <p className="mt-2 hidden line-clamp-2 text-sm leading-6 text-mute sm:block">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-auto pt-4 sm:pt-5">
                      <div className="flex min-h-10 flex-col justify-center gap-2 border-t border-line pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                        <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-mute sm:text-[9px] sm:tracking-[0.16em]">
                          {canAdd
                            ? `${product.stock} available`
                            : "Currently unavailable"}
                        </span>

                        {canAdd ? (
                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className="flex min-h-8 items-center justify-center gap-1 border border-ink px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-paper sm:min-h-0 sm:justify-start sm:border-0 sm:border-b sm:border-pine sm:px-0 sm:py-0.5 sm:text-[10px] sm:tracking-[0.18em] sm:text-pine sm:hover:bg-transparent sm:hover:text-clay"
                          >
                            Add to bag
                            <span aria-hidden="true">→</span>
                          </button>
                        ) : (
                          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-mute sm:text-[10px]">
                            Sold out
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* BRAND STATEMENT */}
      <section className="border-t border-line bg-ink text-paper">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-clay">
                Malak Store
              </p>

              <h2 className="mt-5 max-w-3xl font-display text-4xl leading-[1] tracking-tight sm:text-5xl lg:text-6xl">
                Your fragrance is more than a scent.
                <span className="italic text-clay">
                  {" "}It is a memory.
                </span>
              </h2>
            </div>

            <a
              href="#products"
              onClick={() => setSelectedCategory(null)}
              className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/70 transition hover:text-paper"
            >
              Explore the collection
              <span className="text-clay">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-paper/10 bg-ink text-paper">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="font-display text-2xl italic">
              Malak Store
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-paper/45">
              Fragrance, carefully chosen.
            </p>
          </div>

          <a
            href="#products"
            onClick={() => setSelectedCategory(null)}
            className="text-[9px] font-semibold uppercase tracking-[0.2em] text-paper/60 transition hover:text-paper"
          >
            Back to collection ↑
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;