import { useEffect, useState } from "react";
import { getAllPortfolios } from "@/services/portfolios.service";
import type { GetPortfolioDto } from "@/types/portfolios/GetPortfolioDto";

type UsePortfoliosResult = {
   portfolios: GetPortfolioDto[];
   isLoading: boolean;
   error: string | null;
   refetch: () => void;
};

export function usePortfolios(): UsePortfoliosResult {
   const [portfolios, setPortfolios] = useState<GetPortfolioDto[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [refetchToken, setRefetchToken] = useState(0);

   useEffect(() => {
      let isCancelled = false;

      async function fetchPortfolios() {
         setIsLoading(true);
         setError(null);

         try {
            const data = await getAllPortfolios();

            if (!isCancelled) {
               setPortfolios(data);
            }
         } catch {
            if (!isCancelled) {
               setError(
                  "We couldn't load the portfolio list right now. Please try again.",
               );
            }
         } finally {
            if (!isCancelled) {
               setIsLoading(false);
            }
         }
      }

      fetchPortfolios();

      return () => {
         isCancelled = true;
      };
   }, [refetchToken]);

   function refetch() {
      setRefetchToken((prev) => prev + 1);
   }

   return {
      portfolios,
      isLoading,
      error,
      refetch,
   };
}
