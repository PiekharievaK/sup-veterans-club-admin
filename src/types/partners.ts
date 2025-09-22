export type Contact = {
  title: string;
  url: string;
};

export type LocalizedPartnerData = {
  name: string;
  description: string;
};

export type Partner = {
  id: string;
  image: string;
  contacts: Contact[];
  ua: LocalizedPartnerData;
  en: LocalizedPartnerData;
};