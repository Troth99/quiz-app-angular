import { inject, Injectable, Injector, runInInjectionContext } from "@angular/core";
import { addDoc, collection, Firestore, serverTimestamp } from "@angular/fire/firestore";
import { BugReportData } from "../models";



@Injectable({
    providedIn: 'root'
})
export class BugReportService {
    private injector = inject(Injector)
  private readonly imgbbApiKey = '844b750f8696c887633d12684dff203e';

  constructor(private firestore: Firestore) {}

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${this.imgbbApiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    return data.data.url;
  }

async saveBugReport(report: { title: string; description: string; testId: string; imageUrl?: string }): Promise<string> {
  return runInInjectionContext(this.injector, () => {
    const bugReportsRef = collection(this.firestore, 'bugReports');

  
    const data: BugReportData = {
      title: report.title,
      description: report.description,
      testId: report.testId,
      createdAt: serverTimestamp(),
    };

    if (report.imageUrl) {
      data.imageUrl = report.imageUrl;
    }

    return addDoc(bugReportsRef, data).then(docRef => docRef.id);
  });
}
}