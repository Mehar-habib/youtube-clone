import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
const Analytics = () => {
  const { channelData } = useSelector((state) => state.user);
  if (!channelData) {
    return <div>Loading Channel data...</div>;
  }
  // video chart data
  const videoChartData = (channelData.videos || []).map((video) => ({
    title:
      video.title.length > 10 ? video.title.slice(0, 10) + "..." : video.title,
    views: video.views || 0,
  }));
  // short chart data
  const shortChartData = (channelData.shorts || []).map((short) => ({
    title:
      short.title.length > 10 ? short.title.slice(0, 10) + "..." : short.title,
    views: short.views || 0,
  }));
  return (
    <div className="w-full min-h-screen p-4 sm:p-6 text-white space-y-8 mb-12">
      <h1 className="text-2xl font-bold">
        Channel Analytics (Video & Shorts Views)
      </h1>
      <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Video Views</h2>
        {/* video chart */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={videoChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/*  short Chart */}
      <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Shorts Views</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={shortChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
