 import { describe, it, expect } from "vitest";
import { api, loginAdmin } from "./test-api.js";

describe("Institute API", () => {
  it("should return institute information successfully", async () => {
    const response = await api.get("/api/institute");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Institute information fetched successfully"
    );
    expect(response.body.data).toBeDefined();
  });

  it("should reject institute information without name", async () => {
    const cookie = await loginAdmin();

    const response = await api
      .post("/api/institute")
      .set("Cookie", cookie)
      .send({
        phone: "9876543210",
        email: "test@example.com",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});