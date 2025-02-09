import fs from "fs";
import path from "path";
import { ITEM_LITERALS } from "../utils/ItemLiterals.js";

const filePath = path.join(process.cwd(), "orders.json");

export async function GET(req) {
  let result = [];
  let orders = [];
  try {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      orders = fileData ? JSON.parse(fileData) : [];
    }
  } catch (error) {
    console.error("Error saving order:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }

  orders.forEach((order) => {
    const items = order.items.map((item) => {
      const itemLiteral = ITEM_LITERALS[item.item];
      return {
        ...item,
        items: itemLiteral,
      };
    });

    result.push({
      ...order,
      items,
    });
  });

  return Response.json(result);
}
