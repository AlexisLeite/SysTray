import express, { Request, Response } from "express";

export class Rest {
  constructor() {
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(express.json());

    app.get("/", (req: Request, res: Response) => {
      res.send("Hello, World!");
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }
}
