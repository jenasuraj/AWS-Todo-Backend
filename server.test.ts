import request from "supertest";
import { Request, Response } from "express";
import { app, getHealth } from "./server";

describe("getHealth controller", () => {
  it("responds with 200 and status ok", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    getHealth({} as Request, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: "ok" });
  });
});

describe("GET /health", () => {
  it("returns status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
