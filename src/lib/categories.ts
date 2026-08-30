import bakeryItem from "@/assets/worktop-undershelf.png";
import burnerItem from "@/assets/hood-1.png";
import butcheryItem from "@/assets/meat-trolley.png";
import coldRoomItem from "@/assets/coldroom-1.png";
import dishwasherItem from "@/assets/dishwasher-2.png";
import sinkItem from "@/assets/sink-triple.png";
import storageItem from "@/assets/rack-system.png";

export interface CategoryDef {
  name: string;
  image: string;
}

/**
 * Category thumbnails intentionally use fabricated products from the workshop
 * catalogue rather than generic AI illustrations. Reusing real product assets
 * keeps the catalogue grounded in the work the business actually delivers.
 */
export const CATEGORIES: CategoryDef[] = [
  { name: "Bakery Appliances", image: bakeryItem },
  { name: "Burners Jikos & Stoves", image: burnerItem },
  { name: "Butchery Equipment", image: butcheryItem },
  { name: "Fast Food Equipment", image: bakeryItem },
  { name: "Food Processor", image: dishwasherItem },
  { name: "Home Kitchen", image: sinkItem },
  { name: "Home Wares", image: sinkItem },
  { name: "Hotel Appliances", image: storageItem },
  { name: "Juice Parlour", image: sinkItem },
  { name: "Kitchen Appliances", image: dishwasherItem },
  { name: "Large Appliances", image: coldRoomItem },
  { name: "Medical Equipment", image: bakeryItem },
  { name: "Office Kitchen", image: bakeryItem },
  { name: "Sinks & Wash Stations", image: sinkItem },
  { name: "Small Appliances", image: dishwasherItem },
  { name: "Storage & Shelving", image: storageItem },
  { name: "Water Refilling Equipment", image: sinkItem },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export function imageForCategory(name: string | null | undefined): string | undefined {
  if (!name) return undefined;
  const key = name.trim().toLowerCase();
  return CATEGORIES.find((c) => c.name.toLowerCase() === key)?.image;
}
