// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   LineChart,
//   Line,
//   ResponsiveContainer,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
// } from "recharts";
// import { setContentRevenue } from "../redux/userSlice";
// const calculateRevenue = (views, type)=>{
//   if(type === "video"){
//     if(views<1000) return 0
//     return Math.floor(views/1000) * 50
//   }
//   if(type === "short"){
//     if(views<10000) return 0
//     return Math.floor(views/10000) * 50
//   }
//   return 0
// }
// const Revenue = () => {
//   const { channelData } = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   if (!channelData) {
//     return <div>Loading Channel data...</div>;
//   }
//   // video chart data
//   const videoRevenueData = (channelData.videos || []).map((video) => ({
//     title:
//       video.title.length > 10 ? video.title.slice(0, 15) + "..." : video.title,
//     revenue: calculateRevenue(video.views || 0, "video"),
//   }));
//   // short chart data
//   const shortRevenueData = (channelData.shorts || []).map((short) => ({
//     title:
//       short.title.length > 10 ? short.title.slice(0, 15) + "..." : short.title,
//     revenue: calculateRevenue(short.views || 0, "short"),
//   }));
//   // total revenue
//   const totalRevenue = videoRevenueData.reduce((sum, v) => {
//     sum + v.revenue
//   }, 0) + shortRevenueData.reduce((sum, s) => {
//     sum + s.revenue
//   },0)
//   useEffect(() => {
//     dispatch(setContentRevenue(totalRevenue));
//   }, [totalRevenue]);
//   return (
//     <div className="w-full min-h-screen p-4 sm:p-6 text-white space-y-8 mb-12">
//       <h1 className="text-2xl font-bold">
//         Channel Analytics (Video & Shorts Views)
//       </h1>
//       <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
//         <h2 className="text-lg font-semibold mb-3">Video Views</h2>
//         {/* video chart */}
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={videoChartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="title" tick={{ fontSize: 10 }} />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="views"
//               stroke="#8884d8"
//               strokeWidth={2}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//       {/*  short Chart */}
//       <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
//         <h2 className="text-lg font-semibold mb-3">Shorts Views</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={shortChartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="title" tick={{ fontSize: 10 }} />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="views"
//               stroke="#8884d8"
//               strokeWidth={2}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default Revenue;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { setContentRevenue } from "../redux/userSlice";

// revenue logic
const calculateRevenue = (views, type) => {
  if (type === "video") {
    if (views < 1000) return 0;
    return Math.floor(views / 1000) * 50;
  }
  if (type === "short") {
    if (views < 10000) return 0;
    return Math.floor(views / 10000) * 50;
  }
  return 0;
};

const Revenue = () => {
  const { channelData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  if (!channelData) {
    return <div className="text-white p-6">Loading channel data...</div>;
  }

  // video revenue data
  const videoRevenueData = (channelData.videos || []).map((video) => ({
    title:
      video.title.length > 12 ? video.title.slice(0, 12) + "..." : video.title,
    revenue: calculateRevenue(video.views || 0, "video"),
  }));

  // shorts revenue data
  const shortRevenueData = (channelData.shorts || []).map((short) => ({
    title:
      short.title.length > 12 ? short.title.slice(0, 12) + "..." : short.title,
    revenue: calculateRevenue(short.views || 0, "short"),
  }));

  // total revenue (FIXED)
  const totalRevenue =
    videoRevenueData.reduce((sum, v) => sum + v.revenue, 0) +
    shortRevenueData.reduce((sum, s) => sum + s.revenue, 0);

  useEffect(() => {
    dispatch(setContentRevenue(totalRevenue));
  }, [totalRevenue, dispatch]);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 text-white space-y-8 mb-12">
      {/* Header */}
      <h1 className="text-2xl font-bold">Channel Revenue Analytics</h1>

      {/* Total Revenue Card */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 shadow-md">
        <p className="text-sm opacity-80">Total Estimated Revenue</p>
        <h2 className="text-3xl font-bold mt-1">Rs {totalRevenue}</h2>
      </div>

      {/* Video Revenue Chart */}
      <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Video Revenue</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={videoRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#a78bfa"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Shorts Revenue Chart */}
      <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Shorts Revenue</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={shortRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#34d399"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Revenue;
