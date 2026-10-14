export const STATUS_STYLES: Record<
   string,
   { label: string; className: string }
> = {
   pending: {
      label: "Pending",
      className:
         "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50",
   },
   confirmed: {
      label: "Confirmed",
      className:
         "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
   },
   rejected: {
      label: "Rejected",
      className: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50",
   },
   cancelled: {
      label: "Cancelled",
      className:
         "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-100",
   },
};

export function normalizeStatus(status: string): string {
   return status.trim().toLowerCase();
}

export function getStatusMeta(status: string) {
   return (
      STATUS_STYLES[normalizeStatus(status)] ?? {
         label: status,
         className:
            "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-100",
      }
   );
}
