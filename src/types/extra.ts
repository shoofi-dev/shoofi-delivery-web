export type ExtraType = "single" | "multi" | "counter" | "pizza-topping";
export type AreaOption = { id: string; name: string; price: number };
export type Option = { 
  id: string; 
  nameAR: string; 
  nameHE: string; 
  price?: number;
  areaOptions?: AreaOption[];
};
export type Extra = {
  id: string;
  type: ExtraType;
  nameAR: string;
  nameHE: string;
  options?: Option[];
  maxCount?: number;
  [key: string]: any;
};

