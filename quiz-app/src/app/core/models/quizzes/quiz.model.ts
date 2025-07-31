import { Question } from "./questions.model";

export interface Quiz {
    id? : string;
    title: string;
    description? : string;
    timeLimit?: number;
    questions: Question[];
    createdAt? :string
    createdBy: string
    category: string
}