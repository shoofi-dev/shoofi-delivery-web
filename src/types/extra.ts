export type ExtraType = "single" | "multi" | "counter" | "pizza-topping";
export type AreaOption = { id: string; name: string; price: number };
export type Option = { 
  id: string; 
  nameAR: string; 
  nameHE: string; 
  price?: number;
  areaOptions?: AreaOption[];
};

export type ExtraGroup = {
  id: string;
  nameAR: string;
  nameHE: string;
  order?: number;
  extras: Extra[];
};

export type Extra = {
  id: string;
  type: ExtraType;
  nameAR: string;
  nameHE: string;
  options?: Option[];
  maxCount?: number;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  groupId?: string;
  isGroupHeader?: boolean;
  [key: string]: any;
};

