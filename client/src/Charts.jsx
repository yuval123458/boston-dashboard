import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const dummyBarData = [
  { name: "US", value: 500 },
  { name: "UK", value: 300 },
  { name: "DE", value: 400 },
  { name: "FR", value: 250 },
];

const Charts = ({ lineData, countryData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">
          Total jobs successfully indexed
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(value) =>
                value >= 1_000_000
                  ? `${(value / 1_000_000).toFixed(1)}M`
                  : value >= 1_000
                  ? `${(value / 1_000).toFixed(0)}k`
                  : value
              }
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalJobs" stroke="#4f46e5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Deals by Country</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={countryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
