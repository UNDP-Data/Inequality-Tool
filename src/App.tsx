import { csv } from 'd3-request';
import { nest } from 'd3-collection';
import { useEffect, useState, useReducer } from 'react';
import { DataType, YearListDataType } from './Types';
import { MapViz } from './MapViz';
import { DumbellChartViz } from './DumbellChartViz';
import Reducer from './Context/Reducer';
import Context from './Context/Context';

import './style/style.css';

const App = () => {
  const [finalData, setFinalData] = useState<DataType[] | undefined>(undefined);
  const [years, setYears] = useState<YearListDataType[] | undefined>(undefined);

  const initialState = {
    Country: 'World',
    ISO3: '',
    Year: 2021,
    Indicator: 'b40T10RatioWID',
  };

  const [state, dispatch] = useReducer(Reducer, initialState);

  const updateCountry = (country: string) => {
    dispatch({
      type: 'UPDATE_COUNTRY',
      payload: country,
    });
  };
  const updateISO3 = (iso3: string) => {
    dispatch({
      type: 'UPDATE_ISO3',
      payload: iso3,
    });
  };
  const updateIndicator = (indicator: string) => {
    dispatch({
      type: 'UPDATE_INDICATOR',
      payload: indicator,
    });
  };
  const updateYear = (year: number) => {
    dispatch({
      type: 'UPDATE_YEAR',
      payload: year,
    });
  };
  useEffect(() => {
    csv('./data/b40t10share_wid.csv', (error, data) => {
      if (error) throw error;
      const dataFetched = data.map((d:any) => ({
        country: d.country,
        iso_a3: d.iso_a3,
        iso_a2: d.iso_a2,
        year: +d.year,
        bottom40_wid: +d.bottom40_wid,
        top10_wid: +d.top10_wid,
        b40_t10_ratio_wid: +d.b40_t10_ratio_wid,
      }));
      const dataNestedByCountries = nest()
        .key((d:any) => d.country)
        .entries(dataFetched);
      const dataNestedByYears = nest()
        .key((d:any) => d.year)
        .entries(dataFetched);
      const yearList = dataNestedByYears.map((d:any) => +d.key).sort((a: number, b: number) => a - b).map((d:number) => ({ label: d }));
      const formattedData = dataNestedByCountries.map((d:any) => {
        const yearData = d.values.map((el:any) => ({
          year: el.year,
          bottom40WID: el.bottom40_wid,
          top10WID: el.top10_wid,
          b40T10RatioWID: el.b40_t10_ratio_wid,
        }));
        return {
          country: d.values[0].country,
          ISOAlpha3: d.values[0].iso_a3,
          ISOAlpha2: d.values[0].iso_a2,
          data: yearData,
        };
      });
      setFinalData(formattedData);
      setYears(yearList);
      updateYear(yearList[yearList.length - 1].label);
    });
  }, []);
  return (
    <>
      {
        finalData && years
          ? (
            <div className='undp-container max-width-1440'>
              <Context.Provider
                value={{
                  Country: state.Country,
                  ISO3: state.ISO3,
                  Year: state.Year,
                  Indicator: state.Indicator,
                  updateCountry,
                  updateISO3,
                  updateYear,
                  updateIndicator,
                }}
              >
                <MapViz
                  data={finalData}
                  years={years}
                />
                <DumbellChartViz
                  data={finalData}
                  years={years}
                />
              </Context.Provider>
            </div>
          )
          : (
            <div className='undp-loader' />
          )
        }
    </>
  );
};

export default App;
