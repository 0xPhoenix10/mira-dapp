import { Sector } from "recharts";

export const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius * 1.07}
        startAngle={startAngle + 2}
        endAngle={endAngle - 2}
        fill={fill}
      />
    </g>
  );
};