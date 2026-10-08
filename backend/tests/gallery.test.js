 import { describe, it, expect } from "vitest";
import { api, loginAdmin } from "./test-api.js";

describe("Gallery API", () => {
  it("should return gallery successfully", async () => {
    const response = await api.get("/api/gallery");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Gallery fetched successfully");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should reject gallery item without image URL", async () => {
    const cookie = await loginAdmin();

    const response = await api
      .post("/api/gallery")
      .set("Cookie", cookie)
      .send({
        title: "Annual Event",
        category: "Events",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});