import { Car } from "@/types/car";

export const fleet: Car[] = [
  {
    slug: "civic-lx",
    name: "Civic LX",
    carClass: "Economy",
    pricePerDay: 42,
    seats: 5,
    transmission: "Automatic",
    location: "Downtown",
    pickupMinutes: 8,
    available: true,
    description:
      "The default choice for a quick errand or a weekend out of town. Cheap to fuel, easy to park, always available same-day.",
  },
  {
    slug: "corolla-se",
    name: "Corolla SE",
    carClass: "Economy",
    pricePerDay: 39,
    seats: 5,
    transmission: "Automatic",
    location: "Midtown",
    pickupMinutes: 12,
    available: true,
    description:
      "Reliable and efficient. The car you book when you just need to get somewhere without thinking about it.",
  },
  {
    slug: "cx-5",
    name: "CX-5",
    carClass: "SUV",
    pricePerDay: 68,
    seats: 5,
    transmission: "Automatic",
    location: "Downtown",
    pickupMinutes: 10,
    available: true,
    description:
      "Room for the whole trip's worth of gear. A composed, confident SUV for a family run or a gear-heavy weekend.",
  },
  {
    slug: "tahoe",
    name: "Tahoe",
    carClass: "SUV",
    pricePerDay: 94,
    seats: 7,
    transmission: "Automatic",
    location: "Airport",
    pickupMinutes: 15,
    available: true,
    description:
      "Full-size and three rows. Built for a group trip or a job that needs the extra space, not the extra hassle.",
  },
  {
    slug: "model-3",
    name: "Model 3",
    carClass: "Electric",
    pricePerDay: 79,
    seats: 5,
    transmission: "Automatic",
    location: "Downtown",
    pickupMinutes: 9,
    available: true,
    description:
      "Quiet, quick, and zero stops for gas. Charged and ready before you even finish the reservation.",
  },
  {
    slug: "ioniq-6",
    name: "Ioniq 6",
    carClass: "Electric",
    pricePerDay: 74,
    seats: 5,
    transmission: "Automatic",
    location: "Midtown",
    pickupMinutes: 11,
    available: false,
    description:
      "Aerodynamic, efficient, and genuinely comfortable for a longer drive. Back in rotation tomorrow morning.",
  },
  {
    slug: "a6",
    name: "A6 Quattro",
    carClass: "Luxury",
    pricePerDay: 138,
    seats: 5,
    transmission: "Automatic",
    location: "Downtown",
    pickupMinutes: 14,
    available: true,
    description:
      "For the meeting that matters or the drive that should feel like one. Detailed before every handoff.",
  },
  {
    slug: "range-rover-sport",
    name: "Range Rover Sport",
    carClass: "Luxury",
    pricePerDay: 189,
    seats: 5,
    transmission: "Automatic",
    location: "Airport",
    pickupMinutes: 16,
    available: true,
    description:
      "Presence without trying. The car for the trip you've been meaning to make an occasion.",
  },
];

export const carClasses: Array<Car["carClass"] | "All"> = [
  "All",
  "Economy",
  "SUV",
  "Electric",
  "Luxury",
];

export const locations = [
  {
    name: "Downtown",
    address: "412 Market St, Downtown",
    hours: "24/7",
    cars: fleet.filter((c) => c.location === "Downtown").length,
  },
  {
    name: "Midtown",
    address: "88 Union Ave, Midtown",
    hours: "6am – 12am",
    cars: fleet.filter((c) => c.location === "Midtown").length,
  },
  {
    name: "Airport",
    address: "Terminal B, Arrivals Level",
    hours: "24/7",
    cars: fleet.filter((c) => c.location === "Airport").length,
  },
];
