 import "dotenv/config";
import request from "supertest";

export const API_URL =
  process.env.TEST_API_URL || "http://127.0.0.1:5000";

export const api = {
  get: (path) => request(API_URL).get(path),
  post: (path) => request(API_URL).post(path),
  patch: (path) => request(API_URL).patch(path),
  delete: (path) => request(API_URL).delete(path),
};

export const loginAdmin = async () => {
  const response = await request(API_URL)
    .post("/api/auth/login")
    .send({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

  if (response.status !== 200) {
    throw new Error(
      `Admin login failed with status ${response.status}: ${JSON.stringify(
        response.body
      )}`
    );
  }

  const cookies = response.headers["set-cookie"];

  if (!cookies?.length) {
    throw new Error(
      "Admin login succeeded but no authentication cookie was returned."
    );
  }

  return cookies[0];
};