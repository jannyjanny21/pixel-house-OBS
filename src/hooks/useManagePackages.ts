import { useCallback, useEffect, useState } from "react";
import type { GetPackageDto } from "@/types/packages/GetPackageDto";
import type { CreatePackageDto } from "@/types/packages/CreatePackageDto";
import type { UpdatePackageDto } from "@/types/packages/UpdatePackageDto";
import {
   getAllPackages,
   createPackage,
   updatePackage,
   deletePackage,
} from "@/services/packages.service.ts";

type UsePackagesResult = {
   packages: GetPackageDto[];
   isLoading: boolean;
   error: string | null;
   refetch: () => Promise<void>;
   addPackage: (dto: CreatePackageDto) => Promise<GetPackageDto>;
   editPackage: (id: number, dto: UpdatePackageDto) => Promise<GetPackageDto>;
   removePackage: (id: number) => Promise<void>;
};

export function usePackages(): UsePackagesResult {
   const [packages, setPackages] = useState<GetPackageDto[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const fetchPackages = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
         const data = await getAllPackages();
         setPackages([...data].sort((a, b) => a.sortOrder - b.sortOrder));
      } catch {
         setError("Failed to load packages. Please try again.");
      } finally {
         setIsLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchPackages();
   }, [fetchPackages]);

   const addPackage = useCallback(async (dto: CreatePackageDto) => {
      const created = await createPackage(dto);
      setPackages((prev) => [...prev, created]);
      return created;
   }, []);

   const editPackage = useCallback(
      async (id: number, dto: UpdatePackageDto) => {
         const updated = await updatePackage(id, dto);
         setPackages((prev) => prev.map((p) => (p.id === id ? updated : p)));
         return updated;
      },
      [],
   );

   const removePackage = useCallback(async (id: number) => {
      await deletePackage(id);
      setPackages((prev) => prev.filter((p) => p.id !== id));
   }, []);

   return {
      packages,
      isLoading,
      error,
      refetch: fetchPackages,
      addPackage,
      editPackage,
      removePackage,
   };
}
