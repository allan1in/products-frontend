import { Suspense } from "react";
import  {HomeClient}  from "@/app/(home)/page-client";

export default function Page() {
  return (
    <Suspense>
      <HomeClient />
    </Suspense>
  )
}