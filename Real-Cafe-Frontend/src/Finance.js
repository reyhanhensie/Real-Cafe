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
    const updatedItems = [...selectedItems];
    updatedItems[index] = [menuData[category]?.[0]?.name || ""]; // Default to the first item in the selected category
    setSelectedItems(updatedItems);
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
        ? selectedCategories.filter(Boolean).join(",")
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
    const apiUrl = `${API_URL}/finance/${categories}/${items}/${selectedType}/${period}?time_low=${timeStart}&time_high=${timeEnd}`;
    setGeneratedApi(apiUrl); // Update the state with the generated API URL

    try {
      // Make the API request
      const response = await axios.get(apiUrl);
      setApiResponse(response.data); // Update the state with the API response
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

      {/* Add Categories */}
      <button onClick={addCategory}>Add Category</button>
      {selectedCategories.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <label htmlFor={`category-${categoryIndex}`}>Select Category:</label>
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

          {/* Remove Category Button */}
          <button onClick={() => removeCategory(categoryIndex)}>
            Remove Category
          </button>

          {/* Add Item Button */}
          <button onClick={() => addItem(categoryIndex)}>Add Item</button>

          {/* Item Dropdowns (only show if items are explicitly added) */}
{selectedItems[categoryIndex]?.length > 0 &&
  selectedItems[categoryIndex].map((item, itemIndex) => (
    <div key={itemIndex}>
      <label>Select Item:</label>
      <select
        value={item}
        onChange={(e) =>
          handleItemChange(categoryIndex, itemIndex, e.target.value)
        }
      >
        {menuData[category]?.map((menuItem) => (
          <option key={menuItem.name} value={menuItem.name}>
            {menuItem.name}
          </option>
        ))}
      </select>
      {/* Remove Item Button */}
      <button
        onClick={() => removeItem(categoryIndex, itemIndex)}
        style={{ marginLeft: "10px" }}
      >
        Remove Item
      </button>
    </div>
  ))}

        </div>
      ))}

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
      {/* {generatedApi && (
        <div>
          <h3>Generated API:</h3>
          <p>{generatedApi}</p>
        </div>
      )} */}

      {/* Display API Response */}
      {/* {apiResponse && (
        <div>
          <h3>API Response:</h3>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )} */}

      {/* Display Bar Chart */}
      {apiResponse && (
        <div>
          <h3>Bar Chart:</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}

      {/* Display Selected Filters */}
      <div>
        {/* <h3>Selected Filters:</h3>
        <p>
          Type: {selectedType} <br />
          Categories: {selectedCategories.filter(Boolean).join(", ") ||
            "All"}{" "}
          <br />
          Items:{" "}
          {selectedItems
            .flatMap((itemArray, index) =>
              itemArray.length > 0
                ? itemArray
                    .filter(Boolean)
                    .map((item) => `${selectedCategories[index]}:${item}`)
                : [`${selectedCategories[index]}`]
            )
            .filter(Boolean)
            .join(", ") || "All"}{" "}
          <br />
          Period: {selectedPeriod || "Free"} <br />
          Time Start: {timeStart} <br />
          Time End: {timeEnd}
        </p> */}
      </div>
    </div>
  );
};

export default MenuDropdown;
