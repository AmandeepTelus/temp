"use client";
import { useState, useEffect } from "react";

import Link from "next/link";

export default function PickingList() {
  const [pickingData, setPickingData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const fetchPickingList = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDate) {
        params.append("date", selectedDate);
      }

      const response = await fetch(`/api/picking?${params}`);
      const data = await response.json();
      setPickingData(data.orders);
    } catch (error) {
      console.error("Error fetching picking list:", error);
    }
  };

  useEffect(() => {
    fetchPickingList();
  }, []);

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link href="/">Orders</Link>
          </li>
          <li>
            <Link href="/OrderDashboard">Order List</Link>
          </li>
        </ul>
      </nav>
      <h1>Picking List</h1>

      <div>
        <label>Select Date: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button onClick={fetchPickingList}>Get Picking List</button>
      </div>

      <div>
        <h2>Items to Pick:</h2>
        {pickingData.length === 0 ? (
          <p>No items found for selected date</p>
        ) : (
          <ul>
            {pickingData.map((item, index) => (
              <li key={index}>
                {item.item}: {item.quantity} units
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
