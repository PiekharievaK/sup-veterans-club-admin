export type Benefit = {
  icon: string;
  ua: string;
  en: string;
};

export type ProgramData = {
  id: string;
  category: string;
  icon: string;
  image: string;
  schedule: string;
  benefits: Benefit[];
  ua: {
    title: string;
    description: string;
  };
  en: {
    title: string;
    description: string;
  };
};
