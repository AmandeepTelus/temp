const { ITEM_LITERALS } = require("../ItemLiterals.js");

describe("ItemLiterals", () => {
  test("should have all required box types", () => {
    expect(ITEM_LITERALS).toHaveProperty("Valentines Box");
    expect(ITEM_LITERALS).toHaveProperty("Birthday Box");
    expect(ITEM_LITERALS).toHaveProperty("Client Gift Box");
  });

  test("Valentines Box should have correct items", () => {
    expect(ITEM_LITERALS["Valentines Box"]).toEqual([
      "Red Roses Bouquet",
      "Box of chocolates",
      "Teddy bear",
      "Women's perfume",
    ]);
  });

  test("Birthday Box should have correct items", () => {
    expect(ITEM_LITERALS["Birthday Box"]).toEqual([
      "Birthday cupcake",
      "$100 Visa Gift Card",
      "Birthday card",
    ]);
  });

  test("Client Gift Box should have correct items", () => {
    expect(ITEM_LITERALS["Client Gift Box"]).toEqual([
      "Bottle of wine",
      "Fruit basket",
      "Pen",
    ]);
  });

  test("all box types should have at least one item", () => {
    Object.values(ITEM_LITERALS).forEach((items) => {
      expect(items.length).toBeGreaterThan(0);
    });
  });

  test("all items should be strings", () => {
    Object.values(ITEM_LITERALS).forEach((items) => {
      items.forEach((item) => {
        expect(typeof item).toBe("string");
      });
    });
  });
});
