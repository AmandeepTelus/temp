"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/database");
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load orders");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link href="/"> Order</Link>
          </li>
          <li>
            <Link href="/PackingDashboard">Picking List</Link>
          </li>
        </ul>
      </nav>
      <h1>Orders List</h1>
      <div>
        {orders.map((order) => (
          <div key={order.id}>
            <div>
              <h2>Order #{order.id}</h2>
              <span>{new Date(order.orderDate).toLocaleDateString()}</span>
            </div>

            <div>
              <p>
                <strong>Customer:</strong> {order.name}
              </p>
              <p>
                <strong>Address:</strong> {order.address}
              </p>
            </div>

            <div>
              <h3>Items:</h3>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    <span>{item.item}</span>
                    <span>
                      <ul>
                        {item.items.map((item2, index) => (
                          <li key={index}>
                            <span>{item2}</span>
                            <span>: {item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
