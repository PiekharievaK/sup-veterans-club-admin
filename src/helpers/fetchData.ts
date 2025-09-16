import axios from "axios";

export const fetchJson = async <T>(path: string): Promise<T> => {
  const res = await axios.get(`/api/read?path=${encodeURIComponent(path)}`);
  return res.data as T;
};
