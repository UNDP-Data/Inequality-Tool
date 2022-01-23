import { useEffect, useRef, useState } from 'react';
import { scaleThreshold } from 'd3-scale';
import { select } from 'd3-selection';
import { geoEqualEarth } from 'd3-geo';
import { zoom } from 'd3-zoom';
import styled from 'styled-components';
import world from './world.json';
import {
  TOP10WIDBINS, BOTTOM40WIDBINS, RATIOBINS, COLORSCALE, BOTTOM40KEY, TOP10KEY, RATIOKEY,
} from '../Constants';
import { DataType, HoverDataType } from '../Types';
import { getValue } from '../Utils/getValue';
import { Tooltip } from '../Components/Tooltip';

interface Props {
  year: number;
  data: DataType[];
  indicator: 'bottom40WID' | 'top10WID' | 'b40T10RatioWID';
}

interface FlexDivProps {
  marginTop: string;
  padding: string;
}

const FlexDiv = styled.div<FlexDivProps>`
  display: flex;
  margin-top: ${(props) => props.marginTop};
  margin-left: 2rem;
  padding: ${(props) => props.padding};
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0.2rem;
  box-shadow: 0 0 1rem rgb(0 0 0 / 10%);
  z-index: 10;
  position: absolute;
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

export const Map = (props: Props) => {
  const {
    year,
    data,
    indicator,
  } = props;
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(undefined);
  const [colorKeyHover, setColorKeyHover] = useState<string | undefined>(undefined);
  const width = 1280;
  const height = 720;
  const GraphRef = useRef(null);
  const map: any = world;
  const projection = geoEqualEarth().rotate([0, 0]).scale(265).translate([610, 380]);
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const colorScale = scaleThreshold<number, string>().domain(indicator === 'top10WID' ? TOP10WIDBINS : indicator === 'bottom40WID' ? BOTTOM40WIDBINS : RATIOBINS).range(COLORSCALE);
  const array = indicator === 'top10WID' ? TOP10KEY : indicator === 'bottom40WID' ? BOTTOM40KEY : RATIOKEY;

  useEffect(() => {
    const mapGSelect = select(mapG.current);
    const mapSvgSelect = select(mapSvg.current);
    const zoomBehaviour = zoom()
      .scaleExtent([1, 3])
      .translateExtent([[0, 0], [width, height]])
      .on('zoom', ({ transform }) => {
        mapGSelect.attr('transform', transform);
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapSvgSelect.call(zoomBehaviour as any);
  }, [height, width]);

  return (
    <>
      <div ref={GraphRef} id='graph-node'>
        <svg style={{ width: '100%' }} viewBox={`0 0 ${width} ${height}`} ref={mapSvg}>
          <g ref={mapG}>
            {
            map.features.map((d: any, i: any) => {
              if (d.properties.NAME === 'Antarctica') return null;
              return (
                <g
                  key={i}
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
                            : colorKeyHover ? colorScale(getValue(d.properties.ISO3, year, indicator, data)) === colorKeyHover ? 1 : 0.2 : 1}
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
                            : colorKeyHover ? colorScale(getValue(d.properties.ISO3, year, indicator, data)) === colorKeyHover ? 1 : 0.2 : 1}
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
        <FlexDiv marginTop='-8rem' padding='2rem 1rem 0 1rem'>
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
  );
};
