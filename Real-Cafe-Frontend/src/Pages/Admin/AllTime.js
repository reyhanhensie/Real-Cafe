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
import style from "./Sale_Revenue.module.css";
import { useRef } from "react";
import { Chart } from "chart.js";

import API_URL from "../../apiconfig"; // Import the API_URL

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MenuDropdown = () => {
  const [menuData, setMenuData] = useState({});
  const [selectedType, setSelectedType] = useState("Revenue"); // Default type
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const firstCategory = Object.keys(menuData)[0] || ""; // Get the first category name from the menuData or default to an empty string
    return firstCategory ? [firstCategory] : []; // Return an array with the first category if it exists
  });
  const [selectedItems, setSelectedItems] = useState(() => {
    // Initialize selectedItems as an empty array
    const firstCategory = Object.keys(menuData)[0]; // Get the first category from the menuData
    if (firstCategory) {
      // Set the first item of the first category as the default selected item
      return [[menuData[firstCategory]?.[0]?.name || ""]];
    }
    return []; // Return an empty array if no category exists
  });
  const [selectedPeriod, setSelectedPeriod] = useState("Hourly");
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
        console.error("Error fetching menu items:", err);
      }
    };
    fetchMenuItems();
  }, []);

  const addCategory = () => {
    const firstCategory = Object.keys(menuData)[0]; // Get the first category from menuData
    setSelectedCategories([...selectedCategories, firstCategory]); // Add it to the selectedCategories state
    setSelectedItems([...selectedItems, []]); // Initialize empty array for the new category
  };
  const removeCategory = (categoryIndex) => {
    const updatedCategories = selectedCategories.filter(
      (category, index) => index !== categoryIndex
    );
    const updatedItems = selectedItems.filter(
      (itemArray, index) => index !== categoryIndex
    );

    setSelectedCategories(updatedCategories);
    setSelectedItems(updatedItems);
  };

  const addItem = (index) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].push(
      menuData[selectedCategories[index]]?.[0]?.name || ""
    ); // Add the first item of the category
    setSelectedItems(updatedItems);
  };
  const removeItem = (categoryIndex, itemIndex) => {
    const updatedItems = [...selectedItems];
    updatedItems[categoryIndex].splice(itemIndex, 1); // Remove the specific item
    setSelectedItems(updatedItems);
  };

  const handleCategoryChange = (index, category) => {
    const updatedCategories = [...selectedCategories];
    updatedCategories[index] = category;
    setSelectedCategories(updatedCategories);

    // Set the first item of the newly selected category as the default
    // const updatedItems = [...selectedItems];
    // updatedItems[index] = [menuData[category]?.[0]?.name || ""]; // Default to the first item in the selected category
    // setSelectedItems(updatedItems);
  };
  const handleItemChange = (categoryIndex, itemIndex, value) => {
    const updatedItems = [...selectedItems];
    updatedItems[categoryIndex][itemIndex] = value; // Update only the selected item in the specific category
    setSelectedItems(updatedItems);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  const generateApiUrl = async () => {
    // If no categories are selected, use "All"
    const categories =
      selectedCategories.length > 0
        ? selectedCategories
            .filter(Boolean)
            .map((category) => category.replace(/\s+/g, "")) // Remove spaces from each category
            .join(",")
        : "All"; // Set to "All" if no categories are selected

    // Generate the items for each category. If no items are selected, use all items from the category.
    const items =
      selectedItems.length > 0 &&
      selectedItems.some((itemArray) => itemArray.length > 0)
        ? selectedItems
            .map((itemArray, index) => {
              // If items are selected for a category, include only those items
              if (itemArray.length > 0) {
                return itemArray.filter(Boolean).join(",");
              }
              // If no items are selected for a category, include all items from that category
              return menuData[selectedCategories[index]]
                ?.map((menuItem) => menuItem.name)
                .join(",");
            })
            .filter(Boolean)
            .join(",")
        : selectedCategories
            .map((category, index) => {
              // Include all items if no items are selected for a category
              return menuData[category]?.map((item) => item.name).join(",");
            })
            .filter(Boolean)
            .join(",") || "All"; // If no items are selected, include all items

    // Default period is "Free" if not selected
    const period = selectedPeriod || "Free";

    // Construct API URL with selected parameters
    const apiUrl = `${API_URL}/AllTime/${categories}/${items}/${selectedType}/${period}?time_low=${timeStart}&time_high=${timeEnd}`;
    setGeneratedApi(apiUrl); // Update the state with the generated API URL

    try {
      // Make the API request
      const response = await axios.get(apiUrl);
      setApiResponse(response.data); // Update the state with the API response
    } catch (err) {
      setApiResponse("Error fetching data from API");
    }
  };
  // const formatTime = (dateLabel) => {
  //   const date = new Date(dateLabel);
  //   switch (selectedPeriod) {
  //     case "Free":
  //       return new Date(dateLabel)
  //         .toLocaleString("en-GB", { timeZone: "Asia/Bangkok" })
  //         .replace(", ", " ")
  //         .replace(/\//g, "-")
  //         .split(" ")
  //         .map((part, index) => {
  //           if (index === 0) {
  //             const [day, month, year] = part.split("-");
  //             return `${year}-${month}-${day}`;
  //           }
  //           return part;
  //         })
  //         .join(" ");
  //     case "Hourly":
  //       return new Date(dateLabel)
  //         .toLocaleString("en-GB", { timeZone: "Asia/Bangkok" })
  //         .replace(", ", " ")
  //         .replace(/\//g, "-")
  //         .split(" ")
  //         .map((part, index) => {
  //           if (index === 0) {
  //             const [day, month, year] = part.split("-");
  //             return `${year}-${month}-${day}`;
  //           }
  //           return part.slice(0, 5); // Only display hour and minute
  //         })
  //         .join(" ");
  //     case "Daily":
  //     case "Weekly":
  //       return new Date(dateLabel).toISOString().slice(0, 10);
  //     case "Monthly":
  //       return new Date(dateLabel).toISOString().slice(0, 7);
  //     case "Yearly":
  //       return new Date(dateLabel).toISOString().slice(0, 4);
  //     default:
  //       return new Date(dateLabel).toISOString();
  //   }
  // };

  // Prepare data for Bar Chart
  const chartData = {
    labels: apiResponse ? Object.keys(apiResponse) : [],
    datasets: [
      {
        label: selectedType === "Revenue" ? "Omset (Rp)" : "Penjualan (Qty)",
        data: apiResponse ? Object.values(apiResponse) : [],
        backgroundColor: "#3A5568",
        borderColor: "#3A5568 ",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#000",
          font: {
            weight: "bold",
            size: 18,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#FFFFFF",
        titleFont: {
          weight: "bold",
        },
        bodyColor: "#FFFFFF",
        bodyFont: {
          weight: "bold",
        },
        callbacks: {
          label: function (context) {
            let value = context.raw;
            return selectedType === "Revenue"
              ? `Rp ${value.toLocaleString("id-ID")}`
              : `${value} Qty`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#000",
          font: {
            weight: "bold",
            size: 14,
          },
          callback: function (value, index, ticks) {
            return this.getLabelForValue(value); // Use shared function
          },
        },
        title: {
          display: true,
          text:
            selectedPeriod === "Hourly"
              ? "Jam"
              : selectedPeriod === "Daily"
              ? "Hari"
              : selectedPeriod === "Monthly"
              ? "Tanggal"
              : selectedPeriod === "Yearly"
              ? "Bulan"
              : "Waktu", // Default label
          color: "#000",
          font: {
            weight: "bold",
            size: 18,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#000",
          font: {
            weight: "bold",
            size: 14,
          },
        },
        title: {
          display: true,
          text: selectedType === "Revenue" ? "Omset (Rp)" : "Penjualan (Qty)",
          color: "#000",
          font: {
            weight: "bold",
            size: 14,
          },
        },
      },
    },
  };

  const chartRef = useRef(null);

  const downloadChart = () => {
    if (chartRef.current) {
      const downloadData = {
        ...chartData,
        datasets: [
          {
            ...chartData.datasets[0],
            backgroundColor: "blue", // Blue bars for the downloaded chart
            borderColor: "blue",
          },
        ],
      };

      const downloadOptions = {
        ...chartOptions,
        plugins: {
          ...chartOptions.plugins,
          legend: {
            labels: {
              color: "black",
              font: { weight: "bold" },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "black",
              font: { weight: "bold" },
              callback: function (value, index, ticks) {
                return this.getLabelForValue(value); // Use shared function
              },
            },
            title: {
              display: true,
              text:
                selectedPeriod === "Hourly"
                  ? "Jam"
                  : selectedPeriod === "Daily"
                  ? "Hari"
                  : selectedPeriod === "Monthly"
                  ? "Tanggal"
                  : selectedPeriod === "Yearly"
                  ? "Bulan"
                  : "Waktu", // Default label
              color: "black",
              font: {
                weight: "bold",
                size: 18,
              },
            },
          },
          y: {
            ticks: {
              color: "black",
              font: { weight: "bold" },
            },
          },
        },
      };

      // Create an off-screen canvas
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");

      // Fill the background with white
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render the chart on the off-screen canvas
      new Chart(ctx, {
        type: "bar",
        data: downloadData,
        options: {
          ...downloadOptions,
          responsive: false, // Ensure static rendering for export
          animation: false, // Disable animations for faster rendering
        },
      });

      // Convert the canvas to an image and trigger the download
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "chart.png";
      link.click();
    }
  };

  return (
    <div className={style.Finance}>
      {/* Left Panel: Categories */}
      <div className={style.leftPanel}>
        <button className={style.CategoryButton} onClick={addCategory}>
          Tambah Kategori
        </button>
        {selectedCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className={style.CategoryContainer}>
            <h4>Tipe Menu {categoryIndex + 1}</h4>
            {/* <label htmlFor={`category-${categoryIndex}`}>
              Tipe Menu :
            </label> */}

            <div className={style.CategoryOption}>
              {/* Remove Category */}
              <button
                className={style.LeftPanelButton}
                onClick={() => removeCategory(categoryIndex)}
              >
                <img
                  className={style.LeftPanelXButton}
                  src="/icons/x-circle.svg"
                  alt="X"
                />
              </button>
              <select
                id={`category-${categoryIndex}`}
                value={category}
                onChange={(e) =>
                  handleCategoryChange(categoryIndex, e.target.value)
                }
              >
                {Object.keys(menuData).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Add Items */}
              <button
                className={style.LeftPanelButton}
                onClick={() => addItem(categoryIndex)}
              >
                <img
                  src="/icons/plus-solid2.svg"
                  alt="Add Icon"
                  className="add-icon"
                />
              </button>
            </div>

            {/* Items Selection */}
            <div className={style.ItemsContainer}>
              {selectedItems[categoryIndex]?.length > 0 &&
                selectedItems[categoryIndex].map((item, itemIndex) => (
                  <div className={style.ItemOption} key={itemIndex}>
                    <select
                      value={item}
                      onChange={(e) =>
                        handleItemChange(
                          categoryIndex,
                          itemIndex,
                          e.target.value
                        )
                      }
                    >
                      {menuData[category]?.map((menuItem) => (
                        <option key={menuItem.name} value={menuItem.name}>
                          {menuItem.name}
                        </option>
                      ))}
                    </select>
                    {/* Remove Item */}
                    <button
                      className={style.LeftPanelButton}
                      onClick={() => removeItem(categoryIndex, itemIndex)}
                    >
                      <img
                        className={style.LeftPanelXButton}
                        src="/icons/x-circle.svg"
                        alt="X"
                      />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right Panel: Filters and Chart */}
      <div className={style.rightPanel}>
        {/* Filters Row */}
        <div className={style.filters}>
          <div>
            <label htmlFor="type">Tipe :</label>
            <select id="type" value={selectedType} onChange={handleTypeChange}>
              <option value="Revenue">Omset</option>
              <option value="Sales">Penjualan</option>
            </select>
          </div>

          <div>
            <label htmlFor="period">Periode :</label>
            <select
              id="period"
              value={selectedPeriod}
              onChange={handlePeriodChange}
            >
              <option value="Hourly">Per-Jam</option>
              <option value="Daily">Harian</option>
              <option value="Monthly">Bulanan</option>
              <option value="Yearly">Tahunan</option>
            </select>
          </div>

          <div>
            <label htmlFor="timeStart">Mulai :</label>
            <input
              type="date"
              id="timeStart"
              value={timeStart}
              onChange={(e) => setTimeStart(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="timeEnd">Selesai :</label>
            <input
              type="date"
              id="timeEnd"
              value={timeEnd}
              onChange={(e) => setTimeEnd(e.target.value)}
            />
          </div>
          {/* Generate API */}
          <button className={style.Apply} onClick={generateApiUrl}>
            Apply
          </button>
          <button className={style.downloadButton} onClick={downloadChart}>
            Download Chart
          </button>
        </div>

        {/* Display Generated API */}
        {/* {generatedApi && (
          <div>
            <h3>Generated API:</h3>
            <p>{generatedApi}</p>
          </div>
        )} */}

        {/* Display API Response */}
        {apiResponse && (
          <div>
            <h3>API Response:</h3>
            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
          </div>
        )}

        {/* Chart Section */}
        {apiResponse && (
          <div className={style.chartContainer}>
            <h3>Bar Chart</h3>
            <Bar ref={chartRef} data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuDropdown;
