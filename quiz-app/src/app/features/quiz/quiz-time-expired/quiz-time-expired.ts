import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-quiz-time-expired',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './quiz-time-expired.html',
  styleUrl: './quiz-time-expired.css'
})
export class QuizTimeExpired {

   private dialogRef = inject(MatDialogRef<QuizTimeExpired>);

  close() {
    this.dialogRef.close();
  }
}
