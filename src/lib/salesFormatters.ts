const currencyFormatter = new Intl.NumberFormat("en-PH", {
   style: "currency",
   currency: "PHP",
});

export function formatCurrency(amount: number): string {
   return currencyFormatter.format(amount);
}

export function formatShortDate(date: Date): string {
   return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
   });
}

export function formatMonthYear(date: Date): string {
   return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
   });
}
