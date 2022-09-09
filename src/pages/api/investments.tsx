import path from "path";
import { promises as fs } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

interface MyResponse extends NextApiResponse {
  body: {
    investment: {
      id: number;
      title: string;
      amount: number;
      percentage: number;
      status: string;
      phase: string;
    }[];
  };
}

export default async function handler(req: NextApiRequest, res: MyResponse) {
  const jsonDir = path.join(process.cwd(), "src/data");
  const fileContents = await fs.readFile(jsonDir + "/Investments.json", "utf8");

  res.status(200).json(JSON.parse(fileContents));
}
