 import { describe, it, expect } from "vitest";
import { api, loginAdmin } from "./test-api.js";

describe("Courses API", () => {
  it("should return courses successfully", async () => {
    const response = await api.get("/api/courses");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Courses fetched successfully");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should reject course without title", async () => {
    const cookie = await loginAdmin();

    const response = await api
      .post("/api/courses")
      .set("Cookie", cookie)
      .send({
        shortDescription: "Test course",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});