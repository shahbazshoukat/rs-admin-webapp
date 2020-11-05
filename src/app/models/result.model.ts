export interface Result {
  _id: string;
  status: boolean;
  sectionId: string;
  boardId: string;
  year: string;
  announceDate: string;
  examType: number;
  resultUrl: string;
  tags: string[];
}
