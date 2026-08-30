import bakeryAppliances from "@/assets/source-bakery-appliances.jpg";
import burnersJikosStoves from "@/assets/source-burners-jikos-stoves.jpg";
import butcheryEquipment from "@/assets/source-butchery-equipment.jpg";
import fastFoodEquipment from "@/assets/source-fast-food-equipment.jpg";
import foodProcessor from "@/assets/source-food-processor.jpg";
import homeKitchen from "@/assets/source-home-kitchen.jpg";
import homeWares from "@/assets/source-home-wares.jpg";
import hotelAppliances from "@/assets/source-hotel-appliances.jpg";
import juiceParlour from "@/assets/source-juice-parlour.jpg";
import kitchenAppliances from "@/assets/source-kitchen-appliances.png";
import largeAppliances from "@/assets/source-large-appliances.jpg";
import medicalEquipment from "@/assets/source-medical-equipment.jpg";
import officeKitchen from "@/assets/source-office-kitchen.jpg";
import sinksWashStations from "@/assets/source-sinks-wash-stations.jpg";
import smallAppliances from "@/assets/source-small-appliances.jpg";
import storageShelving from "@/assets/source-storage-shelving.jpg";
import waterRefillingEquipment from "@/assets/source-water-refilling-equipment.jpg";

export interface CategoryDef {
  name: string;
  image: string;
}

/**
 * Category thumbnails use authorized photographs from the source catalog.
 * The images are specific to each department, keeping the browsing experience
 * grounded in real fabricated equipment rather than generic illustrations.
 */
export const CATEGORIES: CategoryDef[] = [
  { name: "Bakery Appliances", image: bakeryAppliances },
  { name: "Burners Jikos & Stoves", image: burnersJikosStoves },
  { name: "Butchery Equipment", image: butcheryEquipment },
  { name: "Fast Food Equipment", image: fastFoodEquipment },
  { name: "Food Processor", image: foodProcessor },
  { name: "Home Kitchen", image: homeKitchen },
  { name: "Home Wares", image: homeWares },
  { name: "Hotel Appliances", image: hotelAppliances },
  { name: "Juice Parlour", image: juiceParlour },
  { name: "Kitchen Appliances", image: kitchenAppliances },
  { name: "Large Appliances", image: largeAppliances },
  { name: "Medical Equipment", image: medicalEquipment },
  { name: "Office Kitchen", image: officeKitchen },
  { name: "Sinks & Wash Stations", image: sinksWashStations },
  { name: "Small Appliances", image: smallAppliances },
  { name: "Storage & Shelving", image: storageShelving },
  { name: "Water Refilling Equipment", image: waterRefillingEquipment },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export function imageForCategory(name: string | null | undefined): string | undefined {
  if (!name) return undefined;
  const key = name.trim().toLowerCase();
  return CATEGORIES.find((c) => c.name.toLowerCase() === key)?.image;
}
