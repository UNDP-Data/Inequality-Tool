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

export interface CtxDataType {
  Country: string;
  ISO3: string;
  Year: number;
  Indicator: 'bottom40WID' | 'top10WID' | 'b40T10RatioWID';
  // eslint-disable-next-line no-unused-vars
  updateCountry: (d: string) => void;
  // eslint-disable-next-line no-unused-vars
  updateISO3: (d: string) => void;
  // eslint-disable-next-line no-unused-vars
  updateYear: (d: number) => void;
  // eslint-disable-next-line no-unused-vars
  updateIndicator: (d: 'bottom40WID' | 'top10WID' | 'b40T10RatioWID') => void;
}
