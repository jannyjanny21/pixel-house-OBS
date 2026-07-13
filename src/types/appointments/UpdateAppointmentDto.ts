export type UpdateAppointmentDto = {
   fullName?: string;
   contactNumber?: string;
   email?: string;
   bookingType?: string;
   serviceType?: string;
   packageIDs?: number[];
   preferredDate?: string;
   preferredTime?: string;
   status?: string;
};
