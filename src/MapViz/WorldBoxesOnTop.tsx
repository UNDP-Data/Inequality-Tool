import { useContext } from 'react';
import meanBy from 'lodash.meanby';
import { CtxDataType, DataType } from '../Types';
import Context from '../Context/Context';
import { SideBarCard } from '../Components/SideBarCard';

interface Props {
  data: DataType[];
}

export const WorldBoxesOnTop = (props: Props) => {
  const {
    data,
  } = props;
  const {
    Year,
  } = useContext(Context) as CtxDataType;

  const filteredData = data.filter((d) => d.data.findIndex((el) => el.year === Year) !== -1);
  const meanRatio = meanBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === Year)].b40T10RatioWID);
  const meanBottom40 = meanBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === Year)].bottom40WID);
  const meanTop10 = meanBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === Year)].top10WID);
  return (
    <div className='flex-div flex-wrap'>
      <SideBarCard
        title='Income Share: Bottom 40%'
        titleSubNote={`Avg. of ${filteredData.length} countries`}
        value={`${(meanBottom40 * 100).toFixed(1)}%`}
      />
      <SideBarCard
        title='Income Share: Top 10%'
        titleSubNote={`Avg. of ${filteredData.length} countries`}
        value={`${(meanTop10 * 100).toFixed(1)}%`}
      />
      <SideBarCard
        title='Income Share Ratio'
        tooltip
        titleSubNote={`Bottom 40% / Top 10%, Avg. of ${filteredData.length} countries`}
        value={`${(meanRatio).toFixed(3)}`}
      />
    </div>
  );
};
