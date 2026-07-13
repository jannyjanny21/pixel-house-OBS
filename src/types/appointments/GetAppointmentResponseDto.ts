import type { GetPackageDto } from "@/types/packages/GetPackageDto";

export type GetAppointmentResponseDto = {
   id: number;
   fullName: string;
   contactNumber: string;
   email: string;
   bookingType: string;
   serviceType: string;
   packages: GetPackageDto[];
   totalPrice: number;
   preferredDate: string;
   preferredTime: string;
   status: string;
};
