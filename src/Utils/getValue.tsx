import { DataType } from '../Types';

export const getValue = (countryCode: string, year: number, key:'bottom40WID' | 'top10WID' | 'b40T10RatioWID', data: DataType[]) => {
  const countryIndx = data.findIndex((d) => d.ISOAlpha3 === countryCode);
  if (countryIndx === -1) return -1;
  const yearIndx = data[countryIndx].data.findIndex((d) => d.year === year);
  if (yearIndx === -1) return -1;
  return data[countryIndx].data[yearIndx][key];
};
