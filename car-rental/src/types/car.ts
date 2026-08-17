export type CarClass = "Economy" | "SUV" | "Electric" | "Luxury";

export interface Car {
  slug: string;
  name: string;
  carClass: CarClass;
  pricePerDay: number;
  seats: number;
  transmission: "Automatic" | "Manual";
  location: string;
  pickupMinutes: number;
  available: boolean;
  description: string;
}
