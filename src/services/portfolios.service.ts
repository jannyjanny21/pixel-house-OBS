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
   const formData = new FormData();
   formData.append("Title", dto.title);
   formData.append("Category", dto.category);
   if (dto.description) formData.append("Description", dto.description);
   dto.images?.forEach((file) => formData.append("Images", file));

   const response = await api.post<GetPortfolioDto>(
      "/portfolios/create",
      formData,
      {
         headers: { "Content-Type": "multipart/form-data" },
      },
   );
   return response.data;
}

export async function updatePortfolio(
   id: number,
   dto: UpdatePortfolioDto,
): Promise<GetPortfolioDto> {
   const formData = new FormData();
   formData.append("Title", dto.title);
   formData.append("Category", dto.category);
   formData.append("Description", dto.description ?? "");
   dto.newImages?.forEach((file) => formData.append("NewImages", file));
   dto.removeImageIds?.forEach((imageId) =>
      formData.append("RemoveImageIds", imageId.toString()),
   );

   const response = await api.put<GetPortfolioDto>(
      `/portfolios/update/${id}`,
      formData,
      {
         headers: { "Content-Type": "multipart/form-data" },
      },
   );
   return response.data;
}

export async function deletePortfolio(id: number): Promise<void> {
   await api.delete(`/portfolios/delete/${id}`);
}
