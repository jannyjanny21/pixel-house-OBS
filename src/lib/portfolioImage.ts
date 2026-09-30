import type { GetPortfolioImageDto } from "@/types/portfolios/GetPortfolioImageDto";

export function toImageSrc(image: GetPortfolioImageDto): string {
   return `data:${image.contentType};base64,${image.data}`;
}
