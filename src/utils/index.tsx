import {FEE_DECIMAL} from "../config";

export const stringToHex = (text: string) =>{
    const encoder = new TextEncoder();
    const encoded = encoder.encode(text);
    return Array.from(encoded, (i) => i.toString(16).padStart(2, "0")).join("");
}

//@time: seconds
export const getFormatedDate = (time: number): string =>{
   let date = new Date(time *1000);
   let month = date.toLocaleString('default', { month: 'short' });
   let day = date.getDate();
   let year = date.getFullYear();
   return `${month} ${day}, ${year}`;
}

export const getStringFee = (fee: number): string => {
    return (fee / FEE_DECIMAL).toString();
}