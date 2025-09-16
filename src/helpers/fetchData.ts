import axios from "axios";

export const fetchJson = async <T>(filename: string): Promise<T> => {
  const res = await axios.get(
    `https://api.github.com/repos/${
      import.meta.env.VITE_REPO
    }/contents/${filename}`,
    {
      headers: {
        Authorization: `token ${import.meta.env.VITE_JSON_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  const content = atob(res.data.content);
  return JSON.parse(content) as T;
};
