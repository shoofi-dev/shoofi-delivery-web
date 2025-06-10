export type ExtraType = "single" | "multi" | "counter" | "pizza-topping" | "weight";
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
  required?: boolean;
  min?: number;
  max?: number;
  maxCount?: number;
  options?: Option[];
  price?: number;
  step?: number;
  defaultValue?: number;
  groupId?: string;
  isGroupHeader?: boolean;
  order?: number;
  [key: string]: any;
};

