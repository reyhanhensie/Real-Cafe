import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import style from "./Finance.module.css";

import API_URL from "./apiconfig"; // Import the API_URL

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MenuDropdown = () => {
  const [menuData, setMenuData] = useState({});
  const [selectedType, setSelectedType] = useState("Revenue"); // Default type
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [timeStart, setTimeStart] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [timeEnd, setTimeEnd] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [error, setError] = useState("");
  const [generatedApi, setGeneratedApi] = useState("");
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/Menu`);
        setMenuData(response.data);
      } catch (err) {
        setError("Error fetching menu items");
      }
    };

    fetchMenuItems();
  }, []);

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedItem(""); // Reset selected item when category changes
  };

  const handleItemChange = (e) => {
    setSelectedItem(e.target.value);
  };

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  const generateApiUrl = async () => {
    const category = selectedCategory ? selectedCategory.replace(/\s+/g, "") : "All";
    const item = selectedCategory && selectedItem ? selectedItem : "All";
    const period = selectedPeriod || "Free";
    const apiUrl = `${API_URL}/finance/${category}/${item}/${selectedType}/${period}?time_low=${timeStart}&time_high=${timeEnd}`;
    setGeneratedApi(apiUrl);

    try {
      const response = await axios.get(apiUrl);
      setApiResponse(response.data);
    } catch (err) {
      setApiResponse("Error fetching data from API");
    }
  };

  // Prepare data for Bar Chart
  const chartData = {
    labels: apiResponse ? Object.keys(apiResponse) : [],
    datasets: [
      {
        label: selectedType === "Revenue" ? "Revenue (Rp)" : "Sales (Qty)",
        data: apiResponse ? Object.values(apiResponse) : [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let value = context.raw;
            if (selectedType === "Revenue") {
              return `Rp ${value.toLocaleString("id-ID")}`;
            }
            return `${value} Qty`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={style.Finance}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Dropdown for Type */}
      <label htmlFor="type">Select Type:</label>
      <select id="type" value={selectedType} onChange={handleTypeChange}>
        <option value="Revenue">Revenue</option>
        <option value="Sales">Sales</option>
      </select>

      {/* Dropdown for Categories */}
      <label htmlFor="category">Select Category:</label>
      <select
        id="category"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value="">All</option>
        {Object.keys(menuData).map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Dropdown for Items */}
      <label htmlFor="item">Select Item:</label>
      <select
        id="item"
        value={selectedItem}
        onChange={handleItemChange}
        disabled={!selectedCategory}
      >
        <option value="">
          {selectedCategory ? "All" : "Pilih Kategori"}
        </option>
        {selectedCategory &&
          menuData[selectedCategory]?.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
      </select>

      {/* Dropdown for Period */}
      <label htmlFor="period">Select Period:</label>
      <select id="period" value={selectedPeriod} onChange={handlePeriodChange}>
        <option value="Free">Free</option>
        <option value="Hourly">Hourly</option>
        <option value="Daily">Daily</option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
        <option value="Yearly">Yearly</option>
      </select>

      {/* Time Start and Time End */}
      <label htmlFor="timeStart">Time Start:</label>
      <input
        type="date"
        id="timeStart"
        value={timeStart}
        onChange={(e) => setTimeStart(e.target.value)}
      />

      <label htmlFor="timeEnd">Time End:</label>
      <input
        type="date"
        id="timeEnd"
        value={timeEnd}
        onChange={(e) => setTimeEnd(e.target.value)}
      />

      {/* Generate API Button */}
      <button onClick={generateApiUrl}>Generate API</button>

      {/* Display Generated API */}
      {generatedApi && (
        <div>
          <h3>Generated API:</h3>
          <p>{generatedApi}</p>
        </div>
      )}

      {/* Display API Response */}
      {apiResponse && (
        <div>
          <h3>API Response:</h3>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )}

      {/* Display Bar Chart */}
      {apiResponse && (
        <div>
          <h3>Bar Chart:</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}

      {/* Display Selected Filters */}
      <div>
        <h3>Selected Filters:</h3>
        <p>
          Type: {selectedType} <br />
          Category: {selectedCategory || "All"} <br />
          Item: {selectedItem || "All"} <br />
          Period: {selectedPeriod || "Free"} <br />
          Time Start: {timeStart} <br />
          Time End: {timeEnd}
        </p>
      </div>
    </div>
  );
};

export default MenuDropdown;
