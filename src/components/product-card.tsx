"use client";

import Image from "next/image";
import type { Product } from "@/types/product";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const src =
  product.images[0].url.startsWith("http")
    ? product.images[0].url
    : `${baseURL}${product.images[0].url}`;

  return (
    <div className="flex flex-col flex-1 overflow-hidden hover:bg-gray-100 active:bg-gray-200 p-4 rounded-xl cursor-pointer transition">
      <div className={`aspect-square w-full rounded-md relative overflow-hidden bg-gray-200 ${isImageLoaded ? "" : "animate-pulse"}`}>
        <Image
          src={src}
          alt={product.name}
          fill
          className={`absolute object-cover ${isImageLoaded ? "opacity-100" : "opacity-0"} transition`}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>
      <div className="flex flex-col w-full">
        <p className="text-sm font-bold pt-2">{product.name}</p>
        <p className="text-sm">￥{product.price}</p>
      </div>
    </div>
  );
}
