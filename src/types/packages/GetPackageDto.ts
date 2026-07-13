export type GetPackageDto = {
   id: number;
   type: string;
   price: number;
   description: string;
   inclusion: string[];
   maxPersons: number;
   isAvailable: boolean;
   isFeatured: boolean;
   sortOrder: number;
};
