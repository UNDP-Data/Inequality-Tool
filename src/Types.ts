export interface YearDataType {
  year: number;
  bottom40WID: number;
  top10WID: number;
  b40T10RatioWID: number;
}

export interface DataType {
  country: string;
  ISOAlpha3: string;
  ISOAlpha2: string;
  data: YearDataType[];
}

export interface YearListDataType {
  label: number;
}

export interface HoverDataType {
  country: string;
  data?: DataType;
  xPosition: number;
  yPosition: number;
  indicator: 'bottom40WID' | 'top10WID' | 'b40T10RatioWID',
  year: number;
}

export interface AreaGraphHoverDataType {
  country: string;
  xPosition: number;
  yPosition: number;
  bottom40WID: number;
  top10WID: number;
  year: number;
}
