import api from "./api";
import type { LifetimeSalesDto } from "@/types/sales/LifetimeSalesDto";
import type { MonthlySalesDto } from "@/types/sales/MonthlySalesDto";
import type { YearlySalesDto } from "@/types/sales/YearlySalesDto";

export async function getSalesByMonth(): Promise<MonthlySalesDto[]> {
   const response = await api.get<MonthlySalesDto[]>(
      "/appointments/sales-by-month",
   );
   return response.data;
}

export async function getSalesByYear(): Promise<YearlySalesDto[]> {
   const response = await api.get<YearlySalesDto[]>(
      "/appointments/sales-by-year",
   );
   return response.data;
}

export async function getTotalLifetimeSales(): Promise<LifetimeSalesDto> {
   const response = await api.get<LifetimeSalesDto>(
      "/appointments/total-lifetime-sales",
   );
   return response.data;
}
