import React from "react";
import StatCard from "./StatCard";
import Charts from "./Charts";
import DataTable from "./DataTable";
import { useState, useEffect } from "react";
import {
  FaDatabase,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";
import { MdOutlineSmsFailed } from "react-icons/md";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [monthlyJobsData, setMonthlyJobsData] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [countryData, setCountryData] = useState([]);
  const [countryLoading, setCountryLoading] = useState(true);
  const [dataTableLoading, setDataTableLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/deals/summary");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Failed to fetch summary:", err);
      } finally {
        setSummaryLoading(false);
      }
    };
    const fetchMonthlyJobsData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/deals/monthly");
        const data = await res.json();
        setMonthlyJobsData(data);
      } catch (err) {
        console.error("Failed to fetch jobs by month:", err);
      } finally {
        setJobsLoading(false);
      }
    };
    const fetchCountryData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/deals/by-country");
        const data = await res.json();
        setCountryData(data);
      } catch (err) {
        console.error("Failed to fetch country data:", err);
      } finally {
        setCountryLoading(false);
      }
    };

    fetchSummary();
    fetchMonthlyJobsData();
    fetchCountryData();
  }, []);

  if (summaryLoading || jobsLoading || countryLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Records"
          value={summary.totalRecords}
          icon={<FaDatabase />}
        />
        <StatCard
          title="No Coordinates"
          value={summary.totalNoCoords}
          icon={<FaMapMarkerAlt />}
        />
        <StatCard
          title="Completed Feeds"
          value={summary.totalDeals}
          icon={<FaCheckCircle />}
        />
        <StatCard
          title="Unique Sources"
          value={summary.uniqueSources}
          icon={<FaUsers />}
        />
        <StatCard
          title="Failed Indexing"
          value="200"
          icon={<MdOutlineSmsFailed />}
        />
      </div>
      <Charts lineData={monthlyJobsData} countryData={countryData} />
      <DataTable loading={dataTableLoading} setLoading={setDataTableLoading} />
    </div>
  );
};
export default Dashboard;
