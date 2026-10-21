import express, { Request, Response } from "express";

export const app = express();

app.use(express.json());

// Controller: simple health check
export const getHealth = (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
};

app.get("/health", getHealth);

// Only start listening when run directly, so tests can import `app`
if (require.main === module) {
  const PORT = Number(process.env.PORT) || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
