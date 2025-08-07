import { FieldValue, Timestamp } from "firebase/firestore";

export interface BugReportData {
  title: string;
  description: string;
  testId: string;
  createdAt: FieldValue
  imageUrl?: string;
}