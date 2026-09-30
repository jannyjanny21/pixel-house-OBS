import type { GetPortfolioImageDto } from "./GetPortfolioImageDto";

export type GetPortfolioDto = {
   id: number;
   title: string;
   category: string;
   description?: string;
   images: GetPortfolioImageDto[];
};
