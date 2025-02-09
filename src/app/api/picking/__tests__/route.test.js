const { describe, expect, test } = require("@jest/globals");
const { GET } = require("../route");
const fs = require("fs");

// Mock the fs module
jest.mock("fs");

// Mock the ItemLiterals
jest.mock("../../utils/ItemLiterals.js", () => ({
  ITEM_LITERALS: {
    "Valentines Box": ["Chocolate", "Card", "Rose"],
    "Birthday Box": ["Cake", "Balloon", "Card"],
  },
}));

describe("Picking API Route", () => {
  const mockOrders = [
    {
      id: 1,
      items: [
        { item: "Valentines Box", quantity: 2 },
        { item: "Birthday Box", quantity: 1 },
      ],
      orderDate: "2025-02-08T00:00:00.000Z",
    },
    {
      id: 2,
      items: [{ item: "Valentines Box", quantity: 1 }],
      orderDate: "2025-02-09T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default mock implementations
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify(mockOrders));
    fs.writeFileSync.mockImplementation(() => {}); // Add mock for write operations
  });

  afterEach(() => {
    // Clean up after each test
    jest.restoreAllMocks();
  });

  test("GET returns expanded items for all dates", async () => {
    const request = new Request("http://localhost:3000/api/picking");
    const response = await GET(request);
    const result = await response.json();

    expect(result.totalOrders).toBe(2); // Fixed: should be 2 orders total
    expect(result.date).toBe("all");
    expect(result.orders).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          item: expect.any(String),
          quantity: expect.any(Number),
        }),
      ])
    );
  });

  test("GET filters by date correctly", async () => {
    const request = new Request(
      "http://localhost:3000/api/picking?date=2025-02-08"
    );
    const response = await GET(request);
    const result = await response.json();

    expect(result.totalOrders).toBe(1);
    expect(result.date).toBe("2025-02-08");

    // Check if quantities are correct for filtered date
    const valentinesItems = result.orders.filter(
      (item) =>
        item.item.includes("Chocolate") ||
        item.item.includes("Card") ||
        item.item.includes("Rose")
    );
    expect(valentinesItems[0].quantity).toBe(1);
  });

  test("GET handles empty orders file", async () => {
    fs.readFileSync.mockReturnValue("[]");

    const request = new Request("http://localhost:3000/api/picking");
    const response = await GET(request);
    const result = await response.json();

    expect(result.totalOrders).toBe(0);
    expect(result.orders).toHaveLength(0);
  });

  test("GET handles file system errors", async () => {
    // Mock fs.existsSync to throw an error
    fs.existsSync.mockImplementation(() => {
      throw new Error("File system error");
    });

    const request = new Request("http://localhost:3000/api/picking");
    const response = await GET(request);

    expect(response.status).toBe(500);
    const result = await response.json();
    expect(result.error).toBe("Internal Server Error");
  });

  test("GET calculates total quantities correctly", async () => {
    const request = new Request("http://localhost:3000/api/picking");
    const response = await GET(request);
    const result = await response.json();

    // Total Valentines Boxes across all dates should be 3
    const valentinesItems = result.orders.filter(
      (item) =>
        item.item.includes("Chocolate") ||
        item.item.includes("Card") ||
        item.item.includes("Rose")
    );
    expect(valentinesItems[0].quantity).toBe(3);
  });
});
