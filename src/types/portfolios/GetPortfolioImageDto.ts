export type GetPortfolioImageDto = {
   id: number;
   fileName?: string;
   contentType: string;
   data: string; // base64 — byte[] is serialized as base64 by ASP.NET
};
