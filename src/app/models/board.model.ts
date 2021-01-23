export interface Board {
  _id: string;
  key: string;
  title: string;
  description: string;
  province: string;
  city: string;
  examTypes: object[];
  sections: string[];
  type: string;
  webUrl: string;
  resultUrl: string;
  tags: string[];
}
