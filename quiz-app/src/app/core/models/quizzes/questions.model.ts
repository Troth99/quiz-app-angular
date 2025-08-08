import { Answer } from "./answers.model";

export interface Question {
    id: string;
    text: string;
    type: 'multiple' | 'single' | 'truefalse' | 'open';
    answers?: Answer[];
    correctAnswers? : number[];
}