import api from "./api";
import type { CreateAppointmentDto } from "@/types/appointments/CreateAppointmentDto";
import type { GetAppointmentResponseDto } from "@/types/appointments/GetAppointmentResponseDto";
import type { UpdateAppointmentDto } from "@/types/appointments/UpdateAppointmentDto";
import type { UpdateAppointmentStatusDto } from "@/types/appointments/UpdateAppointmentStatusDto";

export async function createAppointment(
   dto: CreateAppointmentDto,
): Promise<GetAppointmentResponseDto> {
   const response = await api.post<GetAppointmentResponseDto>(
      "/appointments/create",
      dto,
   );
   return response.data;
}

export async function getTotalSales(): Promise<number> {
   const response = await api.get<number>("/appointments/total-sales");
   return response.data;
}

export async function getAppointmentById(
   id: number,
): Promise<GetAppointmentResponseDto> {
   const response = await api.get<GetAppointmentResponseDto>(
      `/appointments/${id}`,
   );
   return response.data;
}

export async function getAppointments(): Promise<GetAppointmentResponseDto[]> {
   const response = await api.get<GetAppointmentResponseDto[]>("/appointments");
   return response.data;
}

export async function updateAppointment(
   id: number,
   dto: UpdateAppointmentDto,
): Promise<GetAppointmentResponseDto> {
   const response = await api.put<GetAppointmentResponseDto>(
      `/appointments/update/${id}`,
      dto,
   );
   return response.data;
}

export async function updateAppointmentStatus(
   id: number,
   dto: UpdateAppointmentStatusDto,
): Promise<GetAppointmentResponseDto> {
   const response = await api.patch<GetAppointmentResponseDto>(
      `/appointments/update-status/${id}`,
      dto,
   );
   return response.data;
}

export async function deleteAppointment(id: number): Promise<void> {
   await api.delete(`/appointments/delete/${id}`);
}
