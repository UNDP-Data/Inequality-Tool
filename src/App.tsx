import { createGlobalStyle } from 'styled-components';
import { csv } from 'd3-request';
import { nest } from 'd3-collection';
import { useEffect, useState } from 'react';
import { Oval } from 'react-loader-spinner';
import { DataType, YearListDataType } from './Types';
import { MapViz } from './MapViz';
import { TimeSeriesViz } from './TimeSeriesViz';
import { DumbellChartViz } from './DumbellChartViz';

const GlobalStyle = createGlobalStyle`
  :root {
    --primary-blue: #0969FA;
    --white: #ffffff;
    --light-gray:#FAFAFA;
    --bg-blue:  #E7F1FF;
    --text-color:#110848;
    --black: #111;
    --navy: #110848;
    --medium-grey: #CCCCCC;
    --grey: #919399;
    --grey-c3: #B5BFCC;
    --dark-grey: #383838;
    --dropdown-bg: #E9ECF6;
    --yellow: #E9CE2C;
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
    font-weight: 500;
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

  .yearSelect {
    border: 0 !important;
    width: 15rem !important;
    border-radius: 3rem !important;
    background-color: var(--dropdown-bg);
    margin-left: 1rem;
    color: var(--black);
    .react-dropdown-select-type-multi{
      padding: 0 !important;
    }

    .react-dropdown-select-content {
      height: auto !important;
      margin-left: 1rem;
    }

    .react-dropdown-select-option{
      border-radius: 3rem !important;
      background-color: var(--navy) !important;
      color: var(--white) !important;
      &:nth-of-type(n + 3) {
        display: inline !important;
      }
      &:first-of-type{
        margin-left: 0 !important;
      }
    }
  }

  .countrySelect {
    border: 0 !important;
    font-weight: bold;
    background-color: transparent !important;
    text-decoration: underline;
    color: var(--navy) !important;
    margin-left: 0.7rem;
    padding-right: 1rem !important;
    .react-dropdown-select-type-multi{
      padding: 0 !important;
    }

    .react-dropdown-select-content {
      height: auto !important;
    }

    .react-dropdown-select-option{
      background-color: var(--navy) !important;
      color: var(--white) !important;
      &:nth-of-type(n + 3) {
        display: inline !important;
      }
      &:first-of-type{
        margin-left: 0 !important;
      }
    }

    .react-dropdown-select-dropdown-handle {
      display: none !important;
      width: 0 !important;
      margin: 0 !important;
      margin-top: 0.6rem !important;
    }
  }

  .dropdownMain:hover, .dropdownMain:focus {
    border: 2px solid #919399 !important;
  }

  .react-dropdown-select-dropdown-handle svg  {
    margin: -4px 0 -4px 8px !important; 
    padding-top: -2px !important;
    fill: var(--mavy) !important;
  }


  .react-dropdown-select-dropdown{
    font-size: 1.2rem !important;
    box-shadow: 0px 10px 20px 0px rgb(9 105 250 / 15%) !important;
    border: 0 !important;
  }

  .react-dropdown-select-item:hover, .react-dropdown-select-item:hover:focus{
    background-color: var(--bg-blue) !important;
  }

  .react-dropdown-select-item-selected {
    background-color: var(--navy) !important;
  }

  
  .horizontal-slider {
    width: 100%;
    margin: auto;
    margin-top: -1.1rem;
  }

  .year-slider-thumb {
    cursor: pointer;
    position: absolute;
    z-index: 100;
    background: #ffffff;
    border: 5px solid var(--primary-blue);
    border-radius: 100%;
    display: block;
    box-shadow: 0 0 2px 0 rgb(0 0 0 / 44%);
  }

  .year-slider-track {
    position: relative;
    background: #ddd;
  }

  .year-slider-track.year-slider-track-0 {
    background: var(--primary-blue);
  }

  .horizontal-slider .year-slider-track {
    top: 2.1rem;
    height: 0.7rem;
    border-radius: 1rem;
  }

  .horizontal-slider .year-slider-thumb {
    top: 1.5rem;
    width: 1rem;
    outline: none;
    height: 1rem;
    line-height: 3.8rem;
  }
`;

const App = () => {
  const [finalData, setFinalData] = useState<DataType[] | undefined>(undefined);
  const [years, setYears] = useState<YearListDataType[] | undefined>(undefined);
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
    });
  }, []);
  return (
    <>
      <GlobalStyle />
      {
        finalData && years
          ? (
            <>
              <MapViz
                data={finalData}
                years={years}
              />
              <TimeSeriesViz
                data={finalData}
              />
              <DumbellChartViz
                data={finalData}
                years={years}
              />
            </>
          )
          : (
            <>
              <Oval
                color='#0969FA'
                height={50}
                width={50}
              />
            </>
          )
      }
    </>
  );
};

export default App;
