export function formatDuration(minutes: number): string {
   return `${minutes} mins session`;
}

export function formatMaxPeople(maxPeople: number): string {
   return maxPeople === 1 ? "Max 1 person" : `Max ${maxPeople} persons`;
}

export function formatPrice(price: number): string {
   return price.toLocaleString("en-PH");
}
