export type SocialContact = {
  platform: string;
  url: string;
};

export type RepresentativeLocalized = {
  name: string;
  role: string;
  instagram?: string;
};

export type LocalizedData = {
  officialName: string;
  shortName: string;
  address: string;
  representatives: RepresentativeLocalized[];
};

export type ContactsData = {
  phone: string;
  email: string;
  contacts: SocialContact[];
  ua: LocalizedData;
  en: LocalizedData;
};