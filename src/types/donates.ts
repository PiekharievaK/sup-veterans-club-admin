export type Donation = {
  id: string;
  icon: string;
  url: string;
  ua: DonationText;
  en: DonationText;
};

interface DonationText {
    title: string;
    summary: string;
}
