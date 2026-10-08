 import { describe, it, expect } from "vitest";
import { api, loginAdmin } from "./test-api.js";

describe("Results API", () => {
  it("should return results successfully", async () => {
    const response = await api.get("/api/results");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Results fetched successfully");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should reject result without student name", async () => {
    const cookie = await loginAdmin();

    const response = await api
      .post("/api/results")
      .set("Cookie", cookie)
      .send({
        exam: "JEE Advanced",
        year: 2026,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});