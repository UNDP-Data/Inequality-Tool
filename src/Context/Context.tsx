/* eslint-disable no-unused-vars */
import { createContext } from 'react';
import { CtxDataType } from '../Types';

const Context = createContext<CtxDataType>({
  Country: 'World',
  ISO3: '',
  Year: 2021,
  Indicator: 'b40T10RatioWID',
  updateCountry: (d: string) => {},
  // eslint-disable-next-line no-unused-vars
  updateISO3: (d: string) => {},
  // eslint-disable-next-line no-unused-vars
  updateYear: (d: number) => {},
  // eslint-disable-next-line no-unused-vars
  updateIndicator: (d: string) => {},
});

export default Context;
