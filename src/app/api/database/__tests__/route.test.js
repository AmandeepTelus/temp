const { describe, expect, test } = require("@jest/globals");
const { GET } = require("../route");
const fs = require("fs");

// Mock the fs module
jest.mock("fs");

// Mock the ItemLiterals
jest.mock("../../utils/ItemLiterals.js", () => ({
  ITEM_LITERALS: {
    "Valentines Box": ["Item 1", "Item 2"],
    "Birthday Box": ["Item 3", "Item 4"],
  },
}));

describe("Database API Route", () => {
  const mockOrders = [
    {
      id: 1,
      items: [{ item: "Valentines Box", quantity: 1 }],
      name: "Test User",
      address: "Test Address",
    },
  ];

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup fs mock implementation
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify(mockOrders));
  });
  test("GET returns orders with expanded items", async () => {
    const request = new Request("http://localhost:3000/api/database");
    const response = await GET(request);
    const result = await response.json();

    expect(Array.isArray(result)).toBe(true);
    expect(result[0].items[0].items).toEqual(["Item 1", "Item 2"]);
  });

  test("GET handles empty orders file", async () => {
    fs.readFileSync.mockReturnValue("");

    const request = new Request("http://localhost:3000/api/database");
    const response = await GET(request);
    const result = await response.json();

    expect(result).toEqual([]);
  });

  test("GET handles file system errors", async () => {
    fs.existsSync.mockImplementation(() => {
      throw new Error("File system error");
    });

    const request = new Request("http://localhost:3000/api/database");
    const response = await GET(request);

    expect(response.status).toBe(500);
    const result = await response.json();
    expect(result.error).toBe("Internal Server Error");
  });

  // ...rest of your test cases...
});
