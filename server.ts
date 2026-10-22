import express, { Request, Response } from "express";
import FirstRPAHandler from "./modules/rpa/first";

export const app = express();
app.use(express.json());


app.post("/first-rpa", FirstRPAHandler);



// Only start listening when run directly, so tests can import `app`
if (require.main === module) {
  const PORT = Number(process.env.PORT) || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}