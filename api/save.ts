import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios, { AxiosError } from "axios";

const TOKEN = process.env.JSON_TOKEN;
const REPO = process.env.REPO;
const BRANCH = process.env.BRANCH || "main";
const FILE_PATH = "schedule.json";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PUT") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  if (!TOKEN) {
    res.status(500).json({ message: "GitHub token is not set in env" });
    return;
  }

  try {
    const getRes = await axios.get(
      `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
      {
        headers: {
          Authorization: `token ${TOKEN}`,
          Accept: "application/vnd.github+json",
        },
        params: {
          ref: BRANCH,
        },
      }
    );

    const sha = getRes.data.sha;

    const content = Buffer.from(JSON.stringify(req.body, null, 2)).toString(
      "base64"
    );

    const updateRes = await axios.put(
      `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
      {
        message: `Update ${FILE_PATH} via admin panel`,
        content,
        sha,
        branch: BRANCH,
      },
      {
        headers: {
          Authorization: `token ${TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    res.status(200).json({ message: "File updated", data: updateRes.data });
  } catch (err) {
    const error = err as AxiosError;
    console.error("GitHub API error:", error.response?.data || error.message);
    res
      .status(500)
      .json({
        message: "Error updating file",
        error: error.response?.data || error.message,
      });
  }
}
