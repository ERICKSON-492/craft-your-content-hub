import bakeryAppliances from "@/assets/cat-bakery-appliances.jpg";
import burnersJikosStoves from "@/assets/cat-burners-jikos-stoves.jpg";
import butcheryEquipment from "@/assets/cat-butchery-equipment.jpg";
import fastFoodEquipment from "@/assets/cat-fast-food-equipment.jpg";
import foodProcessor from "@/assets/cat-food-processor.jpg";
import homeKitchen from "@/assets/cat-home-kitchen.jpg";
import homeWares from "@/assets/cat-home-wares.jpg";
import hotelAppliances from "@/assets/cat-hotel-appliances.jpg";
import juiceParlour from "@/assets/cat-juice-parlour.jpg";
import kitchenAppliances from "@/assets/cat-kitchen-appliances.jpg";
import largeAppliances from "@/assets/cat-large-appliances.jpg";
import medicalEquipment from "@/assets/cat-medical-equipment.jpg";
import officeKitchen from "@/assets/cat-office-kitchen.jpg";
import sinksWashStations from "@/assets/cat-sinks-wash-stations.jpg";
import smallAppliances from "@/assets/cat-small-appliances.jpg";
import storageShelving from "@/assets/cat-storage-shelving.jpg";
import waterRefillingEquipment from "@/assets/cat-water-refilling-equipment.jpg";

export interface CategoryDef {
  name: string;
  image: string;
}

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
