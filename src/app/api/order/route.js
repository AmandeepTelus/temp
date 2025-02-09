import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "orders.json");

export async function POST(req) {
  try {
    const data = await req.json(); // Changed from formData to json

    const newOrder = {
      id: Date.now(),
      items: data.items, // Now expects an array of items
      name: data.name,
      address: data.address,
      orderDate: new Date().toISOString(),
    };

    // Validate the order
    if (!Array.isArray(newOrder.items) || newOrder.items.length === 0) {
      return Response.json(
        { error: "At least one item is required" },
        { status: 400 }
      );
    }

    // Validate each item in the order
    const invalidItems = newOrder.items.some(
      (item) => !item.item || !item.quantity || item.quantity < 1
    );

    if (invalidItems || !newOrder.name || !newOrder.address) {
      return Response.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    // Read existing orders
    let orders = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      orders = fileData ? JSON.parse(fileData) : [];
    }

    // Append new order
    orders.push(newOrder);

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

    return Response.json({
      message: "Order saved successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error saving order:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
