import { FEE_DECIMAL } from "../config";

export const stringToHex = (text: string) => {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(text);
  return Array.from(encoded, (i) => i.toString(16).padStart(2, "0")).join("");
};

//@time: seconds
export const getFormatedDate = (time: number | undefined): string => {
  if (!time) return "";
  let date = new Date(time * 1000);
  let month = date.toLocaleString("default", { month: "short" });
  let day = date.getDate();
  let year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

export const getStringFee = (fee: number): string => {
  return (fee / FEE_DECIMAL).toString();
};

export const getRandomizeString = (length): string => {
  let result = "user_";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
