
import { Sector } from 'recharts';

export const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill } = props;
  let _cx, _cy = 0;

  _cx = cx + Math.cos((startAngle + endAngle) / 2 * Math.PI / 180) * 5;
  _cy = cy + Math.sin((startAngle + endAngle) / 2 * Math.PI / 180) * (-5);

  return (
    <g>
      <Sector
        cx={_cx}
        cy={_cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius * 1.07}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};