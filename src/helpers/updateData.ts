import axios from "axios";

export const saveJsonFile = async <T>(path: string, data: T) => {
  const res = await axios.put(
    `/api/save?path=${encodeURIComponent(path)}`,
    data
  );
  return res.data;
};
