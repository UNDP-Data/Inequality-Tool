import { useEffect, useRef, useState } from 'react';
import { scaleThreshold } from 'd3-scale';
import { select } from 'd3-selection';
import { geoEqualEarth } from 'd3-geo';
import { zoom } from 'd3-zoom';
import styled from 'styled-components';
import world from './worldMap.json';
import {
  TOP10WIDBINS, BOTTOM40WIDBINS, RATIOBINS, COLORSCALE, BOTTOM40KEY, TOP10KEY, RATIOKEY,
} from '../Constants';
import { DataType, HoverDataType } from '../Types';
import { getValue } from '../Utils/getValue';
import { Tooltip } from '../Components/Tooltip';
import { MapBanner } from './MapBanner';
import { ArrowDown, ArrowUp } from '../icons';

interface Props {
  year: number;
  mapWidth: number | undefined;
  mapHeight: number | undefined;
  data: DataType[];
  country: string;
  ISO3: string;
  // eslint-disable-next-line no-unused-vars
  setCountry: (d: string) => void;
  // eslint-disable-next-line no-unused-vars
  setISO3: (d: string) => void;
}

const RootEl = styled.div`
  background-color: var(--blue-very-light);
  position: relative;
`;
interface MarginProps {
  marginTop: string;
}
const ColorScaleEl = styled.div<MarginProps>`
  margin-top: ${(props) => props.marginTop};
  padding: 1rem 1rem 0 1rem;
  border-radius: 0.2rem;
  box-shadow: var(--shadow);
  background-color: rgba(255,255,255,0.3);
  z-index: 10;
  position: relative;
  margin-right: 1rem;
  float:right;
`;

const FlexDiv = styled.div`
  display: flex;
  margin-top: 1rem;
`;

interface ColorKeySquareProps {
  fill: string;
}
const ColorKeyRect = styled.div<ColorKeySquareProps>`
  width: 4rem;
  height: 1rem;
  background-color: ${(props) => props.fill};
`;
interface ColorKeyElProps {
  flex?: boolean;
}

const ColorKeyEl = styled.div<ColorKeyElProps>`
  margin: ${(props) => (props.flex ? '0 1rem' : '0')};
  font-size: 1.2rem;
  color: var(--navy);
  display: ${(props) => (props.flex ? 'flex' : 'inline')};
  align-items: center;
  width: fit-content;
  justify-content: flex-start;
`;

const KeyValue = styled.div`
  text-align: center;
  font-size: 1rem;
`;

const OptionContainerEl = styled.div`
  font-size: 1.2rem;
`;

const OptionEl = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  text-transform: uppercase;
`;

interface SelectedProps{
  selected?: boolean;
}

const RadioEl = styled.div`
  border: 2px solid var(--black-550);
  border-radius: 2rem;
  background-color: transparent;
  padding: 0.2rem;
  margin-right: 0.5rem;
`;

const RadioIcon = styled.div<SelectedProps>`
  width: 0.8rem;
  height: 0.8rem;
  background-color: ${(props) => (props.selected ? 'var(--black-550)' : 'transparent')};
  border-radius: 0.6rem;
`;

const TitleEl = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  background-color: transparent !important;
  border: 0 !important;
  padding: 0 !important;
`;

export const Map = (props: Props) => {
  const {
    year,
    data,
    country,
    ISO3,
    mapWidth,
    mapHeight,
    setISO3,
    setCountry,
  } = props;
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(undefined);
  const [colorKeyHover, setColorKeyHover] = useState<string | undefined>(undefined);
  const [colorSettingVisible, setColorSettingVisible] = useState(mapWidth && mapHeight ? !(mapHeight < 400 || mapWidth < 400) : false);
  const [indicator, setIndicator] = useState<'bottom40WID' | 'top10WID' | 'b40T10RatioWID'>('b40T10RatioWID');
  const width = 960;
  const height = 730;
  const map: any = world;
  const projection = geoEqualEarth().rotate([0, 0]).scale(225).translate([400, 410]);
  const GraphRef = useRef(null);
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const colorScale = scaleThreshold<number, string>().domain(indicator === 'top10WID' ? TOP10WIDBINS : indicator === 'bottom40WID' ? BOTTOM40WIDBINS : RATIOBINS).range(COLORSCALE);
  const array = indicator === 'top10WID' ? TOP10KEY : indicator === 'bottom40WID' ? BOTTOM40KEY : RATIOKEY;

  useEffect(() => {
    const mapGSelect = select(mapG.current);
    const mapSvgSelect = select(mapSvg.current);
    const zoomBehaviour = zoom()
      .scaleExtent([0.8, 6])
      .translateExtent([[0, 0], [width, height]])
      .on('zoom', ({ transform }) => {
        mapGSelect.attr('transform', transform);
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapSvgSelect.call(zoomBehaviour as any);
  }, [height, width, mapG, mapSvg, mapWidth, mapHeight]);

  useEffect(() => {
    setColorSettingVisible((mapWidth && mapHeight ? !(mapHeight < 400 || mapWidth < 400) : false));
  }, [mapWidth, mapHeight, GraphRef]);

  return (
    <RootEl>
      {
      mapWidth && mapHeight ? (
        <>
          <MapBanner
            year={year}
            data={data}
            indicator={indicator}
            country={country}
            ISO3={ISO3}
          />
          <div id='graph-node' ref={GraphRef}>
            <svg width={mapWidth} height={mapHeight} viewBox={`0 0 ${width} ${height}`} ref={mapSvg}>
              <rect
                x={0}
                y={0}
                width={mapWidth * (height / mapHeight)}
                height={mapHeight * (width / mapWidth)}
                transform={`translate(${((mapWidth * (height / mapHeight)) - width) / 2},${((mapHeight * (width / mapWidth)) - height) / 2})`}
                fill='#fff'
                fillOpacity={0}
                onClick={() => {
                  setCountry('World');
                  setISO3('');
                }}
              />
              <g ref={mapG}>
                {
                  map.features.map((d: any, i: any) => {
                    if (d.properties.NAME === 'Antarctica') return null;
                    return (
                      <g
                        key={i}
                        onClick={() => {
                          if (d.properties.ISO3 === ISO3) {
                            setCountry('World');
                            setISO3('');
                          } else {
                            const indx = data.findIndex((el) => el.ISOAlpha3 === d.properties.ISO3);
                            if (indx !== -1) {
                              setCountry(d.properties.NAME);
                              setISO3(d.properties.ISO3);
                            }
                          }
                        }}
                        onMouseEnter={(event) => {
                          setHoverData({
                            country: d.properties.NAME,
                            xPosition: event.clientX,
                            yPosition: event.clientY,
                            indicator,
                            year,
                            data: data.findIndex((el) => el.ISOAlpha3 === d.properties.ISO3) === -1 ? undefined : data[data.findIndex((el) => el.ISOAlpha3 === d.properties.ISO3)],
                          });
                        }}
                        onMouseMove={(event) => {
                          setHoverData({
                            country: d.properties.NAME,
                            xPosition: event.clientX,
                            yPosition: event.clientY,
                            indicator,
                            year,
                            data: data.findIndex((el) => el.ISOAlpha3 === d.properties.ISO3) === -1 ? undefined : data[data.findIndex((el) => el.ISOAlpha3 === d.properties.ISO3)],
                          });
                        }}
                        onMouseLeave={() => {
                          setHoverData(undefined);
                        }}
                      >
                        {
                        d.properties.NAME === 'Antarctica' ? null
                          : d.geometry.type === 'MultiPolygon' ? d.geometry.coordinates.map((el:any, j: any) => {
                            let masterPath = '';
                            el.forEach((geo: number[][]) => {
                              let path = ' M';
                              geo.forEach((c: number[], k: number) => {
                                const point = projection([c[0], c[1]]) as [number, number];
                                if (k !== geo.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                                else path = `${path}${point[0]} ${point[1]}`;
                              });
                              masterPath += path;
                            });
                            return (
                              <path
                                key={j}
                                opacity={hoverData
                                  ? hoverData.country === d.properties.NAME ? 1 : 0.2
                                  : colorKeyHover ? colorScale(getValue(d.properties.ISO3, year, indicator, data)) === colorKeyHover ? 1 : 0.2
                                    : country === 'World' || ISO3 === d.properties.ISO3 ? 1 : 0.2}
                                d={masterPath}
                                className='streetPath'
                                stroke={getValue(d.properties.ISO3, year, indicator, data) === -1 ? '#DADADA' : '#FFF'}
                                strokeWidth={0.5}
                                fill={getValue(d.properties.ISO3, year, indicator, data) === -1 ? '#FAFAFA' : colorScale(getValue(d.properties.ISO3, year, indicator, data))}
                              />
                            );
                          }) : d.geometry.coordinates.map((el:any, j: number) => {
                            let path = 'M';
                            el.forEach((c: number[], k: number) => {
                              const point = projection([c[0], c[1]]) as [number, number];
                              if (k !== el.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                              else path = `${path}${point[0]} ${point[1]}`;
                            });
                            return (
                              <path
                                key={j}
                                opacity={hoverData
                                  ? hoverData.country === d.properties.NAME ? 1 : 0.2
                                  : colorKeyHover ? colorScale(getValue(d.properties.ISO3, year, indicator, data)) === colorKeyHover ? 1 : 0.2
                                    : country === 'World' || ISO3 === d.properties.ISO3 ? 1 : 0.2}
                                d={path}
                                className='streetPath'
                                stroke={getValue(d.properties.ISO3, year, indicator, data) === -1 ? '#DADADA' : '#FFF'}
                                strokeWidth={0.5}
                                fill={getValue(d.properties.ISO3, year, indicator, data) === -1 ? '#FAFAFA' : colorScale(getValue(d.properties.ISO3, year, indicator, data))}
                              />
                            );
                          })
                      }
                      </g>
                    );
                  })
                }
              </g>
            </svg>
            <ColorScaleEl marginTop={colorSettingVisible ? '-18rem' : '-10.32rem'}>
              <TitleEl>
                <div>Color Settings</div>
                <Button type='button' onClick={() => { setColorSettingVisible(!colorSettingVisible); }}>
                  {
                    colorSettingVisible ? <ArrowDown size={24} /> : <ArrowUp size={24} />
                  }
                </Button>
              </TitleEl>
              {
                colorSettingVisible
                  ? (
                    <OptionContainerEl>
                      <OptionEl onClick={() => { setIndicator('b40T10RatioWID'); }}>
                        <RadioEl>
                          {' '}
                          <RadioIcon selected={indicator === 'b40T10RatioWID'} />
                          {' '}
                        </RadioEl>
                        <>Income Share Ratio: Bottom 40% / Top 10%</>
                      </OptionEl>
                      <OptionEl onClick={() => { setIndicator('bottom40WID'); }}>
                        <RadioEl>
                          {' '}
                          <RadioIcon selected={indicator === 'bottom40WID'} />
                          {' '}
                        </RadioEl>
                        <>Income Share: Bottom 40%</>
                      </OptionEl>
                      <OptionEl onClick={() => { setIndicator('top10WID'); }}>
                        <RadioEl>
                          {' '}
                          <RadioIcon selected={indicator === 'top10WID'} />
                          {' '}
                        </RadioEl>
                        <>Income Share: Top 10%</>
                      </OptionEl>
                    </OptionContainerEl>
                  )
                  : null
              }
              <FlexDiv>
                {
                  array.map((d, i) => (
                    <ColorKeyEl
                      key={i}
                      onMouseEnter={() => {
                        setColorKeyHover(COLORSCALE[i]);
                      }}
                      onMouseLeave={() => {
                        setColorKeyHover(undefined);
                      }}
                    >
                      <ColorKeyRect
                        fill={COLORSCALE[i]}
                      />
                      <KeyValue>
                        {d}
                      </KeyValue>
                    </ColorKeyEl>
                  ))
                }
              </FlexDiv>
            </ColorScaleEl>
          </div>
          {
        hoverData
          ? (
            <Tooltip
              data={hoverData}
            />
          )
          : null
      }
        </>
      ) : null
}
    </RootEl>
  );
};
