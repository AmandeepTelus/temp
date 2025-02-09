"use client";
import { useState } from "react";

import Link from "next/link";

export default function Home() {
  const [formData, setFormData] = useState({
    items: [{ item: "Valentines Box", quantity: 1 }],
    name: "",
    address: "",
  });

  const [message, setMessage] = useState("");

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      items: newItems,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { item: "Valentines Box", quantity: 1 }],
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: newItems,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setMessage(result.message || result.error);
    } catch (error) {
      setMessage("Error submitting order");
    }
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link href="/OrderDashboard">View Orders</Link>
          </li>
          <li>
            <Link href="/PackingDashboard">Picking List</Link>
          </li>
        </ul>
      </nav>
      <h1>COZEY ORDER HOME</h1>
      <form onSubmit={handleSubmit}>
        {formData.items.map((item, index) => (
          <div key={index}>
            <div>
              <span>Item {index + 1}</span>
              {formData.items.length > 1 && (
                <button type="button" onClick={() => removeItem(index)}>
                  Remove
                </button>
              )}
            </div>
            <label>
              Item:
              <select
                value={item.item}
                onChange={(e) =>
                  handleItemChange(index, "item", e.target.value)
                }
              >
                <option value="Valentines Box">Valentines Box</option>
                <option value="Birthday Box">Birthday Box</option>
                <option value="Client Gift Box">Client Gift Box</option>
              </select>
            </label>
            <label>
              Quantity:
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", parseInt(e.target.value))
                }
                min="1"
                required
              />
            </label>
          </div>
        ))}
        <br />
        <button type="button" onClick={addItem}>
          Add Another Item
        </button>
        <br />

        <br />
        <br />
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Submit Order</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
