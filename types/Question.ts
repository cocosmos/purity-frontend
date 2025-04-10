export enum QuestionType {
  BOOLEAN = "boolean",
  MULTIPLE = "multiple",
}

export interface Question {
  id: number;
  question: string;
  type: QuestionType;
  options: Option[];
  min_value?: number;
  max_value?: number;
}

export interface Option {
  id: number;
  label: string;
}
