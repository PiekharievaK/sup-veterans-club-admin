import axios from "axios";

export const fetchJson = async <T>(path: string): Promise<T> => {
  const res = await axios.get(`/api/fetch?path=${encodeURIComponent(path)}`);
  return res.data as T;
};
