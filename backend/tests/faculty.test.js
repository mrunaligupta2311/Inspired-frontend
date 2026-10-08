 import { describe, it, expect } from "vitest";
import { api, loginAdmin } from "./test-api.js";

describe("Faculty API", () => {
  it("should return faculty successfully", async () => {
    const response = await api.get("/api/faculty");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Faculty fetched successfully");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should reject faculty without name", async () => {
    const cookie = await loginAdmin();

    const response = await api
      .post("/api/faculty")
      .set("Cookie", cookie)
      .send({
        designation: "Physics Faculty",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});