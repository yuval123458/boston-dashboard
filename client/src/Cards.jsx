import React from "react";
import StatCard from "./StatCard";
import {
  FaDatabase,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";
import { MdSmsFailed, MdWarning } from "react-icons/md";

const Cards = ({ summary }) => {
  return (
    <>
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
        value={summary.totalFailed}
        icon={<MdSmsFailed />}
      />
      <StatCard
        title="Failed Enrichment"
        value={summary.totalNoMetadata}
        icon={<MdWarning />}
      />
    </>
  );
};

export default Cards;
