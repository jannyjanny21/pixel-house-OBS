import { useEffect, useMemo, useState } from "react";
import { getAllPackages } from "@/services/packages.service.ts";
import type { GetPackageDto } from "@/types/packages/GetPackageDto";

const DEFAULT_VISIBLE_COUNT = 3;

type UsePackagesResult = {
   isLoading: boolean;
   error: string | null;
   featuredPackage: GetPackageDto | undefined;
   compactPackages: GetPackageDto[];
   morePackages: GetPackageDto[];
   refetch: () => void;
};

export function usePackages(): UsePackagesResult {
   const [allPackages, setAllPackages] = useState<GetPackageDto[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [refetchToken, setRefetchToken] = useState(0);

   useEffect(() => {
      let isCancelled = false;

      async function fetchPackages() {
         setIsLoading(true);
         setError(null);

         try {
            const data = await getAllPackages();

            if (!isCancelled) {
               setAllPackages(data);
            }
         } catch {
            if (!isCancelled) {
               setError(
                  "We couldn't load our packages right now. Please try again.",
               );
            }
         } finally {
            if (!isCancelled) {
               setIsLoading(false);
            }
         }
      }

      fetchPackages();

      return () => {
         isCancelled = true;
      };
   }, [refetchToken]);

   const { featuredPackage, compactPackages, morePackages } = useMemo(() => {
      const availablePackages = allPackages
         .filter((pkg) => pkg.isAvailable)
         .sort((a, b) => a.sortOrder - b.sortOrder);

      const visiblePackages = availablePackages.slice(0, DEFAULT_VISIBLE_COUNT);
      const remainingPackages = availablePackages.slice(DEFAULT_VISIBLE_COUNT);

      const featured =
         visiblePackages.find((pkg) => pkg.isFeatured) ??
         visiblePackages[visiblePackages.length - 1];

      const compact = visiblePackages.filter((pkg) => pkg.id !== featured?.id);

      return {
         featuredPackage: featured,
         compactPackages: compact,
         morePackages: remainingPackages,
      };
   }, [allPackages]);

   function refetch() {
      setRefetchToken((prev) => prev + 1);
   }

   return {
      isLoading,
      error,
      featuredPackage,
      compactPackages,
      morePackages,
      refetch,
   };
}
