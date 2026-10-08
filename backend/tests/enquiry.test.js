 import { describe, it, expect } from "vitest";
import { api, loginAdmin } from "./test-api.js";

describe("Enquiries API", () => {
  it("should return enquiries successfully", async () => {
    const cookie = await loginAdmin();

    const response = await api
      .get("/api/enquiries")
      .set("Cookie", cookie);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Enquiries fetched successfully");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should reject enquiry without student name", async () => {
    const response = await api
      .post("/api/enquiries")
      .send({
        phoneNumber: "9876543210",
        message: "I want admission information",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});