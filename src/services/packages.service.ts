import api from "./api";
import type { GetPackageDto } from "@/types/packages/GetPackageDto";
import type { CreatePackageDto } from "@/types/packages/CreatePackageDto";
import type { UpdatePackageDto } from "@/types/packages/UpdatePackageDto";
import type { UpdatePackageAvailabilityDto } from "@/types/packages/UpdatePackageAvailabilityDto";

export async function getAllPackages(): Promise<GetPackageDto[]> {
   const response = await api.get<GetPackageDto[]>("/packages");
   return response.data;
}

export async function getPackageById(id: number): Promise<GetPackageDto> {
   const response = await api.get<GetPackageDto>(`/packages/${id}`);
   return response.data;
}

export async function createPackage(
   dto: CreatePackageDto,
): Promise<GetPackageDto> {
   const response = await api.post<GetPackageDto>("/packages/create", dto);
   return response.data;
}

export async function updatePackage(
   id: number,
   dto: UpdatePackageDto,
): Promise<GetPackageDto> {
   const response = await api.put<GetPackageDto>(`/packages/update/${id}`, dto);
   return response.data;
}

export async function updatePackageAvailability(
   id: number,
   dto: UpdatePackageAvailabilityDto,
): Promise<GetPackageDto> {
   const response = await api.patch<GetPackageDto>(
      `/packages/availability/${id}`,
      dto,
   );
   return response.data;
}

export async function deletePackage(id: number): Promise<void> {
   await api.delete(`/packages/delete/${id}`);
}
