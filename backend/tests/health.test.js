import request from "supertest";
import { describe, it, expect } from "vitest";

const { default: app } = await import("../src/app.js");

describe("Health API", () => {
  it("should return backend health status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Inspired Institute backend is running"
    );
  });
});
