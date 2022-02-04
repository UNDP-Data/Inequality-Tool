import styled, { createGlobalStyle } from 'styled-components';
import { csv } from 'd3-request';
import { nest } from 'd3-collection';
import { useEffect, useState, useReducer } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { DataType, YearListDataType } from './Types';
import { MapViz } from './MapViz';
import { DumbellChartViz } from './DumbellChartViz';
import Reducer from './Context/Reducer';
import Context from './Context/Context';

const GlobalStyle = createGlobalStyle`
  :root {
    --white: #FFFFFF;
    --primary-blue: #0969FA;
    --blue-medium: #018EFF;
    --navy: #082753;
    --black-100: #FAFAFA;
    --black-200: #f5f9fe;
    --black-300: #EDEFF0;
    --black-400: #E9ECF6;
    --black-500: #A9B1B7;
    --black-550: #666666;
    --black-600: #212121;
    --black-700: #000000;
    --blue-very-light: #F2F7FF;
    --yellow: #E9CE2C;
    --shadow:0px 10px 30px -10px rgb(9 105 250 / 15%);
    --shadow-bottom: 0 10px 13px -3px rgb(9 105 250 / 5%);
    --shadow-top: 0 -10px 13px -3px rgb(9 105 250 / 15%);
    --shadow-right: 10px 0px 13px -3px rgb(9 105 250 / 5%);
    --shadow-left: -10px 0px 13px -3px rgb(9 105 250 / 15%);
  }
  
  html { 
    font-size: 62.5%; 
  }

  body {
    font-family: "proxima-nova", "Helvetica Neue", "sans-serif";
    color: var(--text-color);
    background-color: var(--white);
    margin: 0;
    padding: 0 2rem;
    font-size: 1.6rem;
    line-height: 2.56rem;
    max-width: 128rem;
    margin: auto;
  }

  a {
    text-decoration: none;
    color: var(--color-blue);
  }

  h3 {
    color: var(--navy);
    font-size: 3.2rem;
    font-weight: 700;
  }

  button.secondary {
    padding: 2rem;
    border-radius: 0.2rem;
    font-size: 1.4rem;
    font-weight: 700;
    background-color: var(--bg-blue);
    color: var(--navy);
    border: 0;
    text-transform: uppercase;
    margin: 0 1rem;
    cursor: pointer;
    border-radius: 100px;
    padding: 1rem 3rem;
    &:hover {
      background: #B6D3FE;
    }
    &:active{
      background: #84B5FD;
    }
  }

  button.tertiary {
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--primary-blue);
    border: 0;
    text-transform: uppercase;
    background-color: transparent;
    cursor: pointer;
    text-decoration: underline;
    &:hover {
      color: var(--navy);
    }
    &:active{
      color: var(--navy);
    }
  }

  a:hover {
    font-weight: bold;
  }

  .bold{
    font-weight: 700;
  }
  .italics{
    font-style: italic;
  }

  .countrySelect {
    border: 0 !important;
    font-weight: bold;
    background-color: transparent !important;
    color: var(--blue-medium) !important;
    margin-left: 0;
    padding-right: 1.9rem !important;
    padding-left: 0 !important;
    &:hover {
      box-shadow: var(--shadow) !important;
    }
    &:focus-within {
      box-shadow: none !important;
    }
    .react-dropdown-select-type-multi{
      padding: 0 !important;
    }

    .react-dropdown-select-content {
      height: auto !important;
    }

    .react-dropdown-select-dropdown-handle {
      display: none !important;
      width: 0 !important;
      margin: 0 !important;
    }
    .react-dropdown-select-dropdown{
      font-size: 1.6rem !important;
      color: var(--black-550) !important;
      box-shadow: var(--shadow) !important;
      border: 0 !important;
      min-width: 24rem !important;
    }
    .react-dropdown-select-item:hover, .react-dropdown-select-item:hover:focus{
      background-color: var(--blue-very-light) !important;
      color: var(--blue-medium) !important;
    }

    .react-dropdown-select-item-selected {
      background-color: var(--blue-very-light) !important;
      color: var(--blue-medium) !important;
    }

    .react-dropdown-select-input {
      display: none;
    }
    
  }

  .horizontal-slider {
    width: 100%;
    margin: auto;
    margin-top: -1.1rem;
  }

  .year-slider-track {
    position: relative;
    background: var(--black-400);
  }

  .year-slider-track.year-slider-track-0 {
    background: var(--blue-medium);
  }

  .horizontal-slider .year-slider-track {
    top: 2.2rem;
    height: 0.5rem;
    border-radius: 1rem;
  }
`;

const LoaderEl = styled.div`
display: flex;
  width: 100%;
  height: 100px;
  align-items: center;
  justify-content: center;

`;

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
      <GlobalStyle />
      {
        finalData && years
          ? (
            <>
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
            </>
          )
          : (
            <LoaderEl>
              <TailSpin
                color='#0969FA'
                height={75}
                width={75}
              />
            </LoaderEl>
          )
        }
    </>
  );
};

export default App;
