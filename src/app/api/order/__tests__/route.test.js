const { describe, expect, test } = require("@jest/globals");
const { POST } = require("../route");
const fs = require("fs");

// Mock the fs module
jest.mock("fs");

describe("Order API Route", () => {
  const mockValidOrder = {
    items: [{ item: "Valentines Box", quantity: 2 }],
    name: "Test User",
    address: "123 Test St",
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup fs mock implementation
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue("[]");
    fs.writeFileSync.mockImplementation(() => {});
  });

  test("POST creates new order successfully", async () => {
    const request = new Request("http://localhost:3000/api/order", {
      method: "POST",
      body: JSON.stringify(mockValidOrder),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(result.message).toBe("Order saved successfully!");
    expect(result.order.items).toEqual(mockValidOrder.items);
    expect(result.order.name).toBe(mockValidOrder.name);
    expect(result.order.address).toBe(mockValidOrder.address);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test("POST validates required fields", async () => {
    const invalidOrder = {
      items: [], // Empty items array
      name: "", // Empty name
      address: "Test Address",
    };

    const request = new Request("http://localhost:3000/api/order", {
      method: "POST",
      body: JSON.stringify(invalidOrder),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const result = await response.json();
    expect(result.error).toBe("At least one item is required");
  });

  test("POST validates item quantity", async () => {
    const invalidOrder = {
      items: [{ item: "Valentines Box", quantity: 0 }], // Invalid quantity
      name: "Test User",
      address: "123 Test St",
    };

    const request = new Request("http://localhost:3000/api/order", {
      method: "POST",
      body: JSON.stringify(invalidOrder),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const result = await response.json();
    expect(result.error).toBe("Missing or invalid fields");
  });

  test("POST handles file system errors", async () => {
    fs.existsSync.mockImplementation(() => {
      throw new Error("File system error");
    });

    const request = new Request("http://localhost:3000/api/order", {
      method: "POST",
      body: JSON.stringify(mockValidOrder),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);

    const result = await response.json();
    expect(result.error).toBe("Internal Server Error");
  });

  test("POST appends to existing orders", async () => {
    const existingOrders = [
      {
        id: 1,
        items: [{ item: "Birthday Box", quantity: 1 }],
        name: "Existing User",
        address: "Existing Address",
      },
    ];

    fs.readFileSync.mockReturnValue(JSON.stringify(existingOrders));

    const request = new Request("http://localhost:3000/api/order", {
      method: "POST",
      body: JSON.stringify(mockValidOrder),
    });

    await POST(request);

    // Verify that writeFileSync was called with both orders
    expect(fs.writeFileSync).toHaveBeenCalled();
    const writeCall = fs.writeFileSync.mock.calls[0];
    const writtenData = JSON.parse(writeCall[1]);
    expect(writtenData.length).toBe(2);
    expect(writtenData[0]).toEqual(existingOrders[0]);
  });
});
