import { useEffect, useState } from 'react';

import {
  Users,
  CalendarDays,
  Clock3,
  Download,
  TrendingUp,
} from 'lucide-react';

import {
  getSummary,
  getDailyStats,
  getPeakHours,
  exportCSV,
} from '../api/reportApi';


export default function Reports() {

  const [summary, setSummary] = useState(null);

  const [dailyStats, setDailyStats] = useState([]);

  const [peakHours, setPeakHours] = useState([]);

  const [loading, setLoading] = useState(true);


  // =========================
  // fetch reports
  // =========================
  useEffect(() => {

    const fetchReports = async () => {

      try {

        const [
          summaryData,
          dailyData,
          peakData,
        ] = await Promise.all([
          getSummary(),
          getDailyStats(),
          getPeakHours(),
        ]);


        setSummary(summaryData);

        setDailyStats(
          Array.isArray(dailyData)
            ? dailyData
            : dailyData.stats || []
        );


        setPeakHours(
          Array.isArray(peakData)
            ? peakData
            : peakData.hours || []
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };


    fetchReports();

  }, []);


  // =========================
  // export csv
  // =========================
  const handleExport = async () => {

    try {

      const data = await exportCSV();

      // if backend sends direct file url
      if (data.url) {
        window.open(data.url, '_blank');
        return;
      }

      alert('CSV Exported Successfully');

    } catch (error) {

      console.error(error);
      alert('Failed to export CSV');
    }
  };


  // loading
  if (loading) {

    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-lg">
        Loading reports...
      </div>
    );
  }


  const statsCards = [
    {
      title: 'Total Visitors',
      value: summary?.totalVisitors || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Appointments',
      value: summary?.totalAppointments || 0,
      icon: CalendarDays,
      color: 'bg-green-500',
    },
    {
      title: 'Check-ins Today',
      value: summary?.todayCheckins || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'Peak Hour',
      value: summary?.peakHour || 'N/A',
      icon: Clock3,
      color: 'bg-orange-500',
    },
  ];


  return (

    <div className="space-y-8">

      {/* top section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Reports & Analytics
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor visitors, appointments, and peak activity.
          </p>

        </div>


        {/* export */}
        <button
          onClick={handleExport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition"
        >
          <Download size={20} />
          Export CSV
        </button>

      </div>


      {/* summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {
          statsCards.map((item, index) => {

            const Icon = item.icon;

            return (

              <div
                key={index}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
              >

                <div className="flex items-center justify-between mb-4">

                  <div className={`${item.color} text-white p-3 rounded-2xl`}>
                    <Icon size={24} />
                  </div>

                </div>


                <h2 className="text-gray-500 text-sm mb-2">
                  {item.title}
                </h2>


                <p className="text-3xl font-bold text-gray-800">
                  {item.value}
                </p>

              </div>
            );
          })
        }

      </div>


      {/* daily stats */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Daily Visitor Stats
        </h2>


        {
          dailyStats.length > 0 ? (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b text-gray-500 text-sm">
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Visitors</th>
                  </tr>
                </thead>


                <tbody>

                  {
                    dailyStats.map((item, index) => (

                      <tr
                        key={index}
                        className="border-b last:border-none"
                      >

                        <td className="py-4 text-gray-700">
                          {
                            new Date(item.date)
                              .toLocaleDateString()
                          }
                        </td>


                        <td className="py-4 font-semibold text-gray-800">
                          {item.count}
                        </td>

                      </tr>
                    ))
                  }

                </tbody>

              </table>

            </div>

          ) : (

            <div className="text-gray-500">
              No daily stats available
            </div>
          )
        }

      </div>


      {/* peak hours */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Peak Visiting Hours
        </h2>


        {
          peakHours.length > 0 ? (

            <div className="space-y-4">

              {
                peakHours.map((item, index) => (

                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 rounded-2xl px-5 py-4"
                  >

                    <span className="font-medium text-gray-700">
                      {item.hour}
                    </span>


                    <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
                      {item.count} visitors
                    </span>

                  </div>
                ))
              }

            </div>

          ) : (

            <div className="text-gray-500">
              No peak hour data available
            </div>
          )
        }

      </div>

    </div>
  );
}