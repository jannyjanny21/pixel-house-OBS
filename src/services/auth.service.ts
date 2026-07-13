import api, { clearAuthToken, setAuthToken } from "./api";
import type { LogInUserDto } from "@/types/auth/LogInUserDto";
import type { LogInUserResponseDto } from "@/types/auth/LogInUserResponseDto";
import type { RegisterUserDto } from "@/types/auth/RegisterUserDto";
import type { GetUserResponseDto } from "@/types/auth/GetUserResponseDto";

export async function loginUser(
   dto: LogInUserDto,
): Promise<LogInUserResponseDto> {
   const response = await api.post<LogInUserResponseDto>(
      "/api/auth/login",
      dto,
   );

   if (response.data.token) {
      setAuthToken(response.data.token);
   }

   return response.data;
}

export async function createUser(
   dto: RegisterUserDto,
): Promise<GetUserResponseDto> {
   const response = await api.post<GetUserResponseDto>("/user/create", dto);
   return response.data;
}

export async function getUserById(id: number): Promise<GetUserResponseDto> {
   const response = await api.get<GetUserResponseDto>(`/user/${id}`);
   return response.data;
}

export async function getAllUsers(): Promise<GetUserResponseDto[]> {
   const response = await api.get<GetUserResponseDto[]>("/users");
   return response.data;
}

export async function deleteUser(id: number): Promise<void> {
   await api.delete(`/user/delete/${id}`);
}

export function logoutUser(): void {
   clearAuthToken();
}
