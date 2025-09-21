import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios, { AxiosError } from "axios";

const TOKEN = process.env.JSON_TOKEN;
const REPO = process.env.REPO;
const BRANCH = process.env.BRANCH || "main";

export default async function handler(req: VercelRequest, res: VercelResponse) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { path } = req.query;

  if (!path || typeof path !== "string") {
    res.status(400).json({ message: "Missing or invalid path parameter" });
    return;
  }

  try {
    const response = await axios.get(
      `https://api.github.com/repos/${REPO}/contents/${path}`,
      {
        headers: {
          Authorization: `token ${TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        params: {
          ref: BRANCH,
        },
      }
    );

    const content = Buffer.from(response.data.content, "base64").toString("utf-8");
    const json = JSON.parse(content);

    res.status(200).json(json);
  } catch (error) {
    const err = error as AxiosError;
    console.error("Fetch error:", err.response?.data || err.message);
    res.status(500).json({
      message: "Failed to fetch file",
      error: err.response?.data || err.message,
    });
  }
}
