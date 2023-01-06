import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { scaleThreshold } from 'd3-scale';
import { select } from 'd3-selection';
import { geoEqualEarth } from 'd3-geo';
import { zoom, zoomIdentity } from 'd3-zoom';
import styled from 'styled-components';
import { Radio, Space } from 'antd';
import world from './worldMap.json';
import {
  TOP10WIDBINS, BOTTOM40WIDBINS, RATIOBINS, BOTTOM40KEY, TOP10KEY, RATIOKEY, GREENCOLORSCALE, REDCOLORSCALE, REDFLIPPEDCOLORSCALE,
} from '../Constants';
import { CtxDataType, DataType, HoverDataType } from '../Types';
import { getValue } from '../Utils/getValue';
import { Tooltip } from '../Components/Tooltip';
import { ArrowDown, ArrowUp } from '../icons';
import Context from '../Context/Context';

import '../style/radioStyle.css';
import '../style/buttonStyle.css';
import { SideBarBody } from './SideBarBody';

interface Props {
  mapWidth: number | undefined;
  mapHeight: number | undefined;
  data: DataType[];
}

const RootEl = styled.div`
  position: relative;
`;
interface MarginProps {
  marginTop: string;
}

const ColorScaleEl = styled.div<MarginProps>`
  margin-top: ${(props) => props.marginTop};
  padding: 1rem;
  border-radius: 0.2rem;
  background-color: rgba(255,255,255,0.8);
  z-index: 10;
  position: relative;
  margin-right: 1rem;
  float: right;
`;

const FlexDiv = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

interface ColorKeySquareProps {
  fill: string;
}
const ColorKeyRect = styled.div<ColorKeySquareProps>`
  width: 3rem;
  height: 0.75rem;
  background-color: ${(props) => props.fill};
`;
interface ColorKeyElProps {
  flex?: boolean;
}

const ColorKeyEl = styled.div<ColorKeyElProps>`
  margin: ${(props) => (props.flex ? '0 1rem' : '0')};
  font-size: 0.75rem;
  display: ${(props) => (props.flex ? 'flex' : 'inline')};
  align-items: center;
  width: fit-content;
  justify-content: flex-start;
`;

const KeyValue = styled.p`
  text-align: center;
  font-size: 0.75rem;
  font-weight: normal;
  margin: 0;
`;

const Button = styled.button`
  background-color: transparent !important;
  border: 0 !important;
  padding: 0 !important;
  &:active{
    border: 0 !important;
  }
  &:focus{
    border: 0 !important;
  }
`;

const ColorHelpEl = styled.div`
  color: var(--black-700);
  font-weight: bold;
  font-size: 0.875rem;
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  margin-bottom: 0;
`;

const InfoPanelEl = styled.div`
  margin-top: 1rem;
  background-color: rgba(255,255,255,0.8);
  z-index: 10;
  position: absolute;
  left: 1rem;
  width: 17.5rem;
  top: 0;
`;

export const Map = (props: Props) => {
  const {
    data,
    mapWidth,
    mapHeight,
  } = props;
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(undefined);
  const [colorKeyHover, setColorKeyHover] = useState<string | undefined>(undefined);
  const [colorSettingVisible, setColorSettingVisible] = useState(mapWidth && mapHeight ? !(mapHeight < 400 || mapWidth < 400) : false);
  const width = 960;
  const height = 650;
  const map: any = world;
  const projection = geoEqualEarth().rotate([0, 0]).scale(210).translate([475, 350]);
  const GraphRef = useRef(null);
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const {
    Country,
    ISO3,
    Year,
    Indicator,
    updateCountry,
    updateISO3,
    updateIndicator,
  } = useContext(Context) as CtxDataType;
  const colorScale = scaleThreshold<number, string>().domain(Indicator === 'top10WID' ? TOP10WIDBINS : Indicator === 'bottom40WID' ? BOTTOM40WIDBINS : RATIOBINS).range(Indicator === 'top10WID' ? REDCOLORSCALE : Indicator === 'b40T10RatioWID' ? REDFLIPPEDCOLORSCALE : GREENCOLORSCALE);
  const array = Indicator === 'top10WID' ? TOP10KEY : Indicator === 'bottom40WID' ? BOTTOM40KEY : RATIOKEY;

  useEffect(() => {
    const mapGSelect = select(mapG.current);
    const mapSvgSelect = select(mapSvg.current);

    function zoomed(event: any) {
      mapGSelect.attr('transform', event.transform);
    }
    const zoomBehaviour = zoom()
      .scaleExtent([0.8, 6])
      .translateExtent([[0, 0], [width, height]])
      .on('zoom', zoomed);
    mapSvgSelect.call(zoomBehaviour as any);
    if ((ISO3 !== '') && mapWidth && mapHeight) {
      const countryG = select(`.${ISO3}`);
      const bbox = (countryG.node() as SVGGElement).getBBox();
      const centerX = bbox.x + (bbox.width / 2);
      const centerY = bbox.y + (bbox.height / 2);
      const scale = Math.max(1, Math.min(8, 0.9 / Math.max(bbox.width / mapWidth, bbox.height / mapHeight)));
      const translate = [mapWidth / 2 - scale * centerX, mapHeight / 2 - scale * centerY];
      mapSvgSelect
        .transition()
        .duration(750)
        .call(zoomBehaviour.transform as any, zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    }
    if (ISO3 === '') {
      mapSvgSelect
        .transition()
        .duration(750)
        .call(zoomBehaviour.transform as any, zoomIdentity);
    }
  }, [height, width, mapG, mapSvg, mapWidth, mapHeight, ISO3]);

  useEffect(() => {
    setColorSettingVisible((mapWidth && mapHeight ? !(mapHeight < 400 || mapWidth < 400) : false));
  }, [mapWidth, mapHeight, GraphRef]);

  return (
    <RootEl>
      {
        mapWidth && mapHeight ? (
          <>
            <div id='graph-node' ref={GraphRef}>
              <InfoPanelEl className='undp-scrollbar'>
                {
                  Country !== 'World' ? <button onClick={() => { updateCountry('World'); updateISO3(''); }} type='button' className='undp-button button-tertiary' style={{ marginLeft: 'var(--spacing-05)', paddingBottom: 0, fontSize: '0.75rem' }}>← Back to Global View</button> : null
                }
                <h4 style={{ margin: 'var(--spacing-05)' }}>
                  {Country}
                </h4>
                <hr className='undp-style margin-bottom-00' />
                <SideBarBody data={data} />
              </InfoPanelEl>
              <svg width={mapWidth} height={mapHeight + 10} viewBox={`0 0 ${width} ${height}`} ref={mapSvg}>
                <rect
                  x={0}
                  y={0}
                  width={mapWidth * (height / mapHeight)}
                  height={mapHeight * (width / mapWidth)}
                  transform={`translate(${((mapWidth * (height / mapHeight)) - width) / 2},${((mapHeight * (width / mapWidth)) - height) / 2})`}
                  fill='#fff'
                  fillOpacity={0}
                  onClick={() => {
                    updateCountry('World');
                    updateISO3('');
                  }}
                />
                <g ref={mapG}>
                  {
                    map.features.map((d: any, i: any) => {
                      if (d.properties.NAME === 'Antarctica') return null;
                      return (
                        <g
                          key={i}
                          className={d.properties.ISO3}
                          onClick={() => {
                            if (d.properties.ISO3 === ISO3) {
                              updateCountry('World');
                              updateISO3('');
                            } else {
                              const indx = data.findIndex((el) => el.ISOAlpha3 === d.properties.ISO3);
                              if (indx !== -1) {
                                updateCountry(d.properties.NAME);
                                updateISO3(d.properties.ISO3);
                              }
                            }
                          }}
                          onMouseEnter={(event) => {
                            setHoverData({
                              country: d.properties.NAME,
                              xPosition: event.clientX,
                              yPosition: event.clientY,
                              indicator: Indicator,
                              year: Year,
                              data: data.findIndex((el) => el.ISOAlpha3 === d.properties.ISO3) === -1 ? undefined : data[data.findIndex((el) => el.ISOAlpha3 === d.properties.ISO3)],
                            });
                          }}
                          onMouseMove={(event) => {
                            setHoverData({
                              country: d.properties.NAME,
                              xPosition: event.clientX,
                              yPosition: event.clientY,
                              indicator: Indicator,
                              year: Year,
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
                                    : colorKeyHover ? colorScale(getValue(d.properties.ISO3, Year, Indicator, data)) === colorKeyHover ? 1 : 0.2
                                      : Country === 'World' || ISO3 === d.properties.ISO3 ? 1 : 0.2}
                                  d={masterPath}
                                  className='streetPath'
                                  stroke={getValue(d.properties.ISO3, Year, Indicator, data) === -1 ? '#DADADA' : '#FFF'}
                                  strokeWidth={0.5}
                                  fill={getValue(d.properties.ISO3, Year, Indicator, data) === -1 ? '#FAFAFA' : colorScale(getValue(d.properties.ISO3, Year, Indicator, data))}
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
                                    : colorKeyHover ? colorScale(getValue(d.properties.ISO3, Year, Indicator, data)) === colorKeyHover ? 1 : 0.2
                                      : Country === 'World' || ISO3 === d.properties.ISO3 ? 1 : 0.2}
                                  d={path}
                                  className='streetPath'
                                  stroke={getValue(d.properties.ISO3, Year, Indicator, data) === -1 ? '#DADADA' : '#FFF'}
                                  strokeWidth={0.5}
                                  fill={getValue(d.properties.ISO3, Year, Indicator, data) === -1 ? '#FAFAFA' : colorScale(getValue(d.properties.ISO3, Year, Indicator, data))}
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
              <ColorScaleEl marginTop={colorSettingVisible ? '-17rem' : '-10.25rem'}>
                <div className='flex-div flex-space-between flex-vert-aling-center margin-bottom-05'>
                  <div className='bold'>Color Settings</div>
                  <Button type='button' onClick={() => { setColorSettingVisible(!colorSettingVisible); }}>
                    {
                      colorSettingVisible ? <ArrowDown size={24} /> : <ArrowUp size={24} />
                    }
                  </Button>
                </div>
                {
                  colorSettingVisible
                    ? (
                      <Radio.Group defaultValue='b40T10RatioWID' onChange={(el) => { updateIndicator(el.target.value); }}>
                        <Space direction='vertical'>
                          <Radio className='undp-radio' value='b40T10RatioWID'>Income Share Ratio: Bottom 40% / Top 10%</Radio>
                          <Radio className='undp-radio' value='bottom40WID'>Income Share: Bottom 40%</Radio>
                          <Radio className='undp-radio' value='top10WID'>Income Share: Top 10%</Radio>
                        </Space>
                      </Radio.Group>
                    )
                    : null
                }
                <ColorHelpEl>
                  <div>
                    ←
                    {' '}
                    {Indicator === 'b40T10RatioWID' ? 'Higher Inequality' : 'Lower Income Share'}
                  </div>
                  <div>
                    {Indicator === 'b40T10RatioWID' ? 'Lower Inequality' : 'Higher Income Share'}
                    {' '}
                    →
                  </div>
                </ColorHelpEl>
                <FlexDiv>
                  {
                    array.map((d, i) => (
                      <ColorKeyEl
                        key={i}
                        onMouseEnter={() => {
                          setColorKeyHover(Indicator === 'top10WID' ? REDCOLORSCALE[i] : Indicator === 'b40T10RatioWID' ? REDFLIPPEDCOLORSCALE[i] : GREENCOLORSCALE[i]);
                        }}
                        onMouseLeave={() => {
                          setColorKeyHover(undefined);
                        }}
                      >
                        <ColorKeyRect
                          fill={Indicator === 'top10WID' ? REDCOLORSCALE[i] : Indicator === 'b40T10RatioWID' ? REDFLIPPEDCOLORSCALE[i] : GREENCOLORSCALE[i]}
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
