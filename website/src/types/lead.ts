export type LeadPayload = {
  event_date: string;
  email: string;
  phone?: string;
  location?: string;
  type?: string;
  people?: string;
  recaptcha_token: string;
  company_website?: string;
};
