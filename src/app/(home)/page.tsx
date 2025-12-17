"use client";

import { ProductCard } from "@/components/product-card";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/types/product";
import {
  LuSearch,
  LuArrowLeft,
  LuArrowRight,
  LuChevronDown,
  LuX,
} from "react-icons/lu";
import { ProductCardSkeleton } from "@/components/skeletons/product-card";
import { Suspense } from "react";

export default function HomePage() {
  const pageSize = 12;
  const skeletonDelay = 300;

  const router = useRouter();
  const searchParams = useSearchParams();

  // 从 URL 读取分页和搜索参数，通过 URL 变化驱动参数变化
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const sortByParam = searchParams.get("sortBy");
  const sortOrderParam = searchParams.get("sortOrder");
  const sortBy: "createdAt" | "price" =
    sortByParam === "price" ? "price" : "createdAt";
  const sortOrder: "asc" | "desc" = sortOrderParam === "asc" ? "asc" : "desc";

  const [inputValue, setInputValue] = useState(search);
  const [products, setProducts] = useState<Product[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    const startTime = Date.now();
    const res = await fetch(
      `/api/products?page=${page}&pageSize=${pageSize}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    );
    const data = await res.json();

    setPageCount(data.meta.pagination.pageCount);
    setProducts(data.data);
    setTotal(data.meta.pagination.total);

    const endTime = Date.now();
    const fetchTime = endTime - startTime;
    const timeToWait =
      fetchTime < skeletonDelay ? skeletonDelay - fetchTime : 0;

    setTimeout(() => {
      setIsLoading(false);
    }, timeToWait);
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, sortBy, sortOrder]);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(event.target as Node)
      ) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (field: "createdAt" | "price", order: "asc" | "desc") => {
    setIsLoading(true);
    setShowSortMenu(false);
    updateUrl(1, search, field, order);
  };

  const getSortLabel = () => {
    if (sortBy === "createdAt") {
      return sortOrder === "desc" ? "Newest" : "Oldest";
    } else {
      return sortOrder === "desc" ? "Price: High to Low" : "Price: Low to High";
    }
  };

  const checkProduct = (product: Product) => {
    return product.id && product.name && product.price && product.images;
  };

  const updateUrl = (
    newPage: number,
    newSearch: string,
    newSortBy: "createdAt" | "price" = sortBy,
    newSortOrder: "asc" | "desc" = sortOrder
  ) => {
    const doUpdateUrl = () => {
      const params = new URLSearchParams();
      if (newSearch) params.set("search", newSearch);
      if (newPage > 1) params.set("page", String(newPage));
      params.set("sortBy", newSortBy);
      params.set("sortOrder", newSortOrder);
      router.push(`/?${params.toString()}`);
    };

    // 如果已经在顶部，直接跳转
    if (window.scrollY === 0) {
      doUpdateUrl();
    } else {
      // 需要滚动，监听滚动完成后再跳转
      let scrolled = false;

      const handleScroll = () => {
        if (window.scrollY === 0 && !scrolled) {
          scrolled = true;
          window.removeEventListener("scroll", handleScroll);
          doUpdateUrl();
        }
      };

      window.addEventListener("scroll", handleScroll);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const handleSearch = (
    value: string,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    inputRef.current?.blur();
    setIsLoading(true);
    updateUrl(1, value);
  };

  const handlePrevPage = () => {
    setIsLoading(true);
    const newPage = page === 1 ? 1 : page - 1;
    updateUrl(newPage, search);
  };

  const handleNextPage = () => {
    setIsLoading(true);
    const newPage = page === pageCount ? pageCount : page + 1;
    updateUrl(newPage, search);
  };

  return (
    <Suspense>
      <div className="">
        <nav className="bg-white h-16 w-full fixed z-10 flex items-center px-4 gap-4">
          <div className="grow h-[70%] bg-gray-200 rounded-[99999px] flex items-center px-4">
            <div className="h-[50%]">
              <LuSearch className="text-gray-600 h-full" />
            </div>
            <div className="h-[50%] pl-2 w-full">
              <input
                ref={inputRef}
                type="search"
                placeholder="Search"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch(inputValue, inputRef);
                  }
                }}
                className="focus:outline-none text-sm w-full"
              />
            </div>
            {inputValue.length > 0 && (
              <div
                className="h-[50%] flex items-center cursor-pointer"
                onClick={() => setInputValue("")}
              >
                <LuX className="text-gray-600 h-full" />
              </div>
            )}
          </div>
          <div className="relative h-[70%]" ref={sortMenuRef}>
            <button
              className="px-4 h-full rounded-[99999px] border border-gray-300 cursor-pointer hover:bg-gray-100 active:bg-gray-200 text-sm whitespace-nowrap transition flex items-center justify-center gap-2"
              onClick={() => setShowSortMenu(!showSortMenu)}
            >
              <span>{getSortLabel()}</span>
              <LuChevronDown size={18} />
            </button>
            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <button
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-100 active:bg-gray-200 transition cursor-pointer ${
                    sortBy === "createdAt" && sortOrder === "desc"
                      ? "font-extrabold"
                      : ""
                  }`}
                  onClick={() => handleSort("createdAt", "desc")}
                >
                  Newest
                </button>
                <button
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-100 active:bg-gray-200 transition cursor-pointer ${
                    sortBy === "createdAt" && sortOrder === "asc"
                      ? "font-extrabold"
                      : ""
                  }`}
                  onClick={() => handleSort("createdAt", "asc")}
                >
                  Oldest
                </button>
                <button
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-100 active:bg-gray-200 transition cursor-pointer ${
                    sortBy === "price" && sortOrder === "desc"
                      ? "font-extrabold"
                      : ""
                  }`}
                  onClick={() => handleSort("price", "desc")}
                >
                  Price: High to Low
                </button>
                <button
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-100 active:bg-gray-200 transition cursor-pointer ${
                    sortBy === "price" && sortOrder === "asc"
                      ? "font-extrabold"
                      : ""
                  }`}
                  onClick={() => handleSort("price", "asc")}
                >
                  Price: Low to High
                </button>
              </div>
            )}
          </div>
        </nav>
        {!isLoading && products.length === 0 ? (
          <div className="h-dvh flex justify-center items-center flex-col gap-4">
            <div className="text-lg font-bold">No products found.</div>
            <div className="text-sm text-gray-500">
              Try adjusting your search.
            </div>
          </div>
        ) : (
          <main className="max-w-[1440px] mx-auto pt-16 min-h-screen">
            <div className="p-4 flex flex-col gap-4">
              {search.length > 0 && !isLoading && (
                <div className="h-[--text-lg] text-lg font-bold pl-4">
                  {products.length} products of {search}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                {isLoading
                  ? Array.from({
                      length:
                        page === pageCount
                          ? total % pageSize === 0
                            ? pageSize
                            : total % pageSize
                          : pageSize,
                    }).map((_, index) => <ProductCardSkeleton key={index} />)
                  : products.map(
                      (product) =>
                        checkProduct(product) && (
                          <ProductCard key={product.id} product={product} />
                        )
                    )}
              </div>
              {!isLoading && pageCount > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-center gap-4">
                    {page > 1 && (
                      <button
                        className="px-4 py-3 rounded-[99999px] border border-gray-300 text-sm cursor-pointer flex items-center hover:bg-gray-100 active:bg-gray-200 transition"
                        onClick={handlePrevPage}
                      >
                        <span className="pr-2">
                          <LuArrowLeft className="h-full" />
                        </span>
                        <span>Previous</span>
                      </button>
                    )}
                    {page < pageCount && (
                      <button
                        className="px-4 py-3 rounded-[99999px] border border-gray-300 text-sm cursor-pointer flex items-center hover:bg-gray-100 active:bg-gray-200 transition"
                        onClick={handleNextPage}
                      >
                        <span>Next Page</span>
                        <span className="pl-2">
                          <LuArrowRight className="h-full" />
                        </span>
                      </button>
                    )}
                  </div>
                  <div className="text-center text-gray-400 text-sm">
                    Page {page} of {pageCount}
                  </div>
                </div>
              )}
            </div>
          </main>
        )}
      </div>
    </Suspense>
  );
}
