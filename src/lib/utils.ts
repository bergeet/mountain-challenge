import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBooleanValueYesOrNo = (value: boolean) =>
  value ? "Ja" : "Nej";
export const getValidityClass = (value: boolean) =>
  value ? "bg-green-200" : "bg-red-200";
export const getFeelingClass = (value: number) => {
  switch (value) {
    case 1:
      return "bg-red-500";
    case 2:
    case 3:
      return "bg-yellow-500";
    case 4:
      return "bg-green-500";
    case 5:
      return "bg-blue-500";
  }
};

export const getAttributesTypes = (attribute: unknown) => {
  {
    if (attribute instanceof Date) {
      return (attribute as Date).toLocaleDateString("sv-SE");
    } else if (typeof attribute === "boolean") {
      return getBooleanValueYesOrNo(attribute);
    } else if (typeof attribute === "number") {
      return Number(attribute).toString();
    } else if (typeof attribute === "string") {
      return attribute;
    } else return null;
  }
};
