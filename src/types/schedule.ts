export type ScheduleItem = {
  id: string;
  date: string;
  type: string;
  timeStart: string;
  timeEnd: string;
  location: string;
  link?: string;
  instructors: string[];
  slots: number;
};
