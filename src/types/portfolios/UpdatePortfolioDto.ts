export type UpdatePortfolioDto = {
   title: string;
   category: string;
   description?: string;
   newImages?: File[];
   removeImageIds?: number[];
};
