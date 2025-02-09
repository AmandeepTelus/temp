import fs from "fs";
import path from "path";
import { ITEM_LITERALS } from "../utils/ItemLiterals.js";

const filePath = path.join(process.cwd(), "orders.json");

const readOrdersFile = () => {
  try {
    if (!fs.existsSync(filePath)) return [];
    const fileData = fs.readFileSync(filePath, "utf-8");
    return fileData ? JSON.parse(fileData) : [];
  } catch (error) {
    console.error("Error reading orders file:", error);
    throw new Error("Failed to read orders file");
  }
};

const filterOrdersByDate = (orders, selectedDate) => {
  if (!selectedDate) return orders;

  return orders.filter(
    (order) => new Date(order.orderDate).toLocaleDateString() === selectedDate
  );
};

const calculateTotalItems = (orders) => {
  return orders.reduce((totals, order) => {
    order.items.forEach(({ item, quantity }) => {
      totals[item] = (totals[item] || 0) + Number(quantity);
    });
    return totals;
  }, {});
};

const expandItemsWithLiterals = (totalItems) => {
  return Object.entries(totalItems).flatMap(([itemName, quantity]) =>
    ITEM_LITERALS[itemName].map((item) => ({
      item,
      quantity,
    }))
  );
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const selectedDate = searchParams.get("date");

    // Process orders
    const orders = readOrdersFile();
    const filteredOrders = filterOrdersByDate(orders, selectedDate);
    const totalItems = calculateTotalItems(filteredOrders);
    const result = expandItemsWithLiterals(totalItems);

    return Response.json({
      orders: result,
      totalOrders: filteredOrders.length,
      date: selectedDate || "all",
    });
  } catch (error) {
    console.error("Error processing picking list:", error);
    return Response.json(
      {
        error: "Internal Server Error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
