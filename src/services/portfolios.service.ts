import api from "./api";
import type { GetPortfolioDto } from "@/types/portfolios/GetPortfolioDto";
import type { CreatePortfolioDto } from "@/types/portfolios/CreatePortfolioDto";
import type { UpdatePortfolioDto } from "@/types/portfolios/UpdatePortfolioDto";

export async function getAllPortfolios(): Promise<GetPortfolioDto[]> {
   const response = await api.get<GetPortfolioDto[]>("/portfolios");
   return response.data;
}

export async function getPortfolioById(id: number): Promise<GetPortfolioDto> {
   const response = await api.get<GetPortfolioDto>(`/portfolios/${id}`);
   return response.data;
}

export async function createPortfolio(
   dto: CreatePortfolioDto,
): Promise<GetPortfolioDto> {
   const response = await api.post<GetPortfolioDto>("/portfolios/create", dto);
   return response.data;
}

export async function updatePortfolio(
   id: number,
   dto: UpdatePortfolioDto,
): Promise<GetPortfolioDto> {
   const response = await api.put<GetPortfolioDto>(
      `/portfolios/update/${id}`,
      dto,
   );
   return response.data;
}

export async function deletePortfolio(id: number): Promise<void> {
   await api.delete(`/portfolios/delete/${id}`);
}
