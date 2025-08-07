import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReportBugForm } from '../../auth/forms/bugReport.form';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../../core/services/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { BugReportService } from '../../../core/services/bugReport.service';
import { Loading } from '../../../shared';

@Component({
  selector: 'app-quiz-bug-report',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './quiz-bug-report.html',
  styleUrls: ['./quiz-bug-report.css']
})
export class QuizBugReport implements OnInit {

  screenshotFile: File | null = null;
  
  currentTestId: string = '';
  quizName: string = '';

  successMessageVisible = false

  private reportBugForm = inject(ReportBugForm);
  private quizService = inject(QuizService);
  private route = inject(ActivatedRoute);
  private bugReportService = inject(BugReportService)
  
  form: FormGroup = this.reportBugForm.createForm('');

  categoryName: string = '';

  loading = false;
selectedFileName: string | null = null;



 ngOnInit() {
  this.route.params.subscribe(params => {
    this.categoryName = params['categoryName'];
    this.currentTestId = params['quizId'];

    this.quizService.getQuizById(this.categoryName, this.currentTestId).subscribe({
      next: quiz => {
        this.quizName = quiz ? quiz.title : 'Quiz not found';
        this.form = this.reportBugForm.createForm(this.currentTestId);
      },
      error: () => {
        this.quizName = 'Error loading quiz';
        this.form = this.reportBugForm.createForm(this.currentTestId);
      }
    });
  });
}

onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.screenshotFile = input.files[0];    
    this.selectedFileName = input.files[0].name;
  } else {
    this.screenshotFile = null;            
    this.selectedFileName = null;
  }
}

async submit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.successMessageVisible = false;

  try {
    let imageUrl: string | undefined;
    if (this.screenshotFile) {
      imageUrl = await this.bugReportService.uploadImage(this.screenshotFile);
    }

    const reportId = await this.bugReportService.saveBugReport({
      testId: this.form.get('testId')!.value,
      title: this.form.get('title')!.value,
      description: this.form.get('description')!.value,
      imageUrl,
    });

    this.successMessageVisible = true;
    this.form.reset();
    this.selectedFileName = null;
  } catch (error) {
    console.error('Failed to save bug report:', error);
  } finally {
    this.loading = false;
  }
}

}
