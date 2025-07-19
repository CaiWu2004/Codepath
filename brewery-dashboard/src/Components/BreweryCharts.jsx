import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

export default function BreweryCharts({ breweries }) {
  const typeData = breweries.reduce((acc, brewery) => {
    const type = brewery.brewery_type || "unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const stateData = breweries.reduce((acc, brewery) => {
    const state = brewery.state || "unknown";
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(typeData).map(([name, value]) => ({
    name,
    value,
  }));

  const barData = Object.entries(stateData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const COLORS = ["#d4a76a", "#8b5a2b", "#b54c3c", "#5d4037", "#3e2723"];

  return (
    <div className="brewery-charts">
      <div className="chart-row">
        <div className="chart-container">
          <h3>Brewery Types</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div className="chart-container">
          <h3>Top States</h3>
          <BarChart width={400} height={300} data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8b5a2b" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}
