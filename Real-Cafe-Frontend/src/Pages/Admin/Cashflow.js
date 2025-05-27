import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import style from "./Cashflow.module.css";
import API_URL from "../../apiconfig";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const MenuDropdown = () => {
  // State for API data and UI control
  const [apiResponse, setApiResponse] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("Daily");
  const [timeStart, setTimeStart] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [timeEnd, setTimeEnd] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial data on mount
  useEffect(() => {
    fetchCashflowData();
  }, []);

  const fetchCashflowData = async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const timeHigh = today.toISOString().split('T')[0];

      const timeLowDate = new Date(today.getFullYear(), today.getMonth(), 1);
      const timeLow = timeLowDate.toISOString().split('T')[0];

      const response = await axios.get(
        `${API_URL}/cashflow/Daily?time_low=${timeLow}&time_high=${timeHigh}`
      );

      setApiResponse(response.data);
    } catch (err) {
      setError("Failed to fetch cashflow data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generate API URL and fetch data based on filters
  const generateApiUrl = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `${API_URL}/cashflow/${selectedPeriod}?time_low=${timeStart}&time_high=${timeEnd}`;
      const response = await axios.get(apiUrl);
      setApiResponse(response.data);
    } catch (err) {
      setError("Error fetching data from API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Format labels based on selectedPeriod
  const formatTime = (dateLabel) => {
    const date = new Date(dateLabel);
    switch (selectedPeriod) {
      case "Daily":
      case "Weekly":
        return date.toISOString().slice(0, 10);
      case "Monthly":
        return date.toISOString().slice(0, 7);
      case "Yearly":
        return date.toISOString().slice(0, 4);
      default:
        return date.toISOString().slice(0, 10);
    }
  };

  // Memoize chart data to avoid unnecessary recalculations
  const chartData = useMemo(() => {
    if (!apiResponse) return { labels: [], datasets: [] };

    // Add safety checks for API response structure
    const pendapatan = apiResponse.pendapatan || {};
    const pengeluaran = apiResponse.pengeluaran || {};
    const belanja = apiResponse.belanja || {};

    const labels = Object.keys(pendapatan);
    const pendapatanData = labels.map((date) => pendapatan[date] || 0);
    const pengeluaranData = labels.map((date) => pengeluaran[date] || 0);
    const belanjaData = labels.map((date) => belanja[date] || 0);

    // Calculate net cash flow
    const bersihData = labels.map(
      (date, i) => pendapatanData[i] - (pengeluaranData[i] + belanjaData[i])
    );

    return {
      labels,
      datasets: [
        {
          label: "Pendapatan",
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          data: pendapatanData,
          type: "bar",
        },
        {
          label: "Pengeluaran",
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          borderColor: "rgba(255, 99, 132, 1)",
          data: pengeluaranData,
          type: "bar",
        },
        {
          label: "Belanja",
          backgroundColor: "rgba(255, 206, 86, 0.6)",
          borderColor: "rgba(255, 206, 86, 1)",
          data: belanjaData,
          type: "bar",
        },
        {
          label: "Bersih",
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          data: bersihData,
          type: "line",
          fill: false,
          tension: 0.3,
          pointRadius: 4,
          borderWidth: 3,
          yAxisID: 'y',
        },
      ],
    };
  }, [apiResponse]);

  // Chart options with mixed chart support
  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#000",
          font: { weight: "bold", size: 16 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: (ctx) => {
            const val = ctx.raw;
            return `${ctx.dataset.label}: Rp ${val.toLocaleString("id-ID")}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#000",
          font: { weight: "bold", size: 14 },
          callback: (value, index) => formatTime(chartData.labels[index]),
        },
        title: {
          display: true,
          text: "Waktu",
          color: "#000",
          font: { weight: "bold", size: 16 },
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        ticks: {
          color: "#000",
          font: { weight: "bold", size: 14 },
          callback: (value) => `Rp ${value.toLocaleString("id-ID")}`,
        },
        title: {
          display: true,
          text: "Jumlah (Rp)",
          color: "#000",
          font: { weight: "bold", size: 16 },
        },
      },
    },
  };

  return (
    <div className={style.Finance}>
      <div className={style.Header}>
        <div className={style.filters} style={{ gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <label htmlFor="period">Periode:</label>
            <select
              id="period"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="Daily">Harian</option>
              <option value="Weekly">Mingguan</option>
              <option value="Monthly">Bulanan</option>
              <option value="Yearly">Tahunan</option>
            </select>
          </div>

          <div>
            <label htmlFor="timeStart">Mulai:</label>
            <input
              type="date"
              id="timeStart"
              value={timeStart}
              onChange={(e) => setTimeStart(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="timeEnd">Selesai:</label>
            <input
              type="date"
              id="timeEnd"
              value={timeEnd}
              onChange={(e) => setTimeEnd(e.target.value)}
            />
          </div>

          <button className={style.Apply} onClick={generateApiUrl} disabled={loading}>
            {loading ? "Loading..." : "Apply"}
          </button>
        </div>
      </div>

      <div className={style.Content}>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        
        {loading && <p>Loading chart data...</p>}
        
        {apiResponse && chartData.labels.length > 0 && (
          <div className={style.chartContainer} style={{ marginTop: "2rem" }}>
            <h2>Cashflow Chart</h2>
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}
        
        {apiResponse && chartData.labels.length === 0 && (
          <p>No data available for the selected period.</p>
        )}
      </div>
    </div>
  );
};

export default MenuDropdown;