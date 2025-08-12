import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription, switchMap, take } from 'rxjs';

import { QuizService } from '../../core/services/quiz.service';
import { Comment } from '../../core/models';
import { AuthService, UserService } from '../../core';
import { RouterModule } from '@angular/router';
import { FirestoreDatePipe } from '../../core/pipes/convertFirebaseTimetampToDate.pipe';

@Component({
  selector: 'app-comments-component',
  imports: [CommonModule, FormsModule, RouterModule, FirestoreDatePipe],
  templateUrl: './comments-component.html',
  styleUrl: './comments-component.css',
  standalone: true,
})
export class CommentsComponent implements OnInit, OnDestroy{
@Input() categoryName! : string;
@Input() quizId!: string;
@Input() quizOwnerId!: string;
@Input() currentUrl: string = ''

private subscription = new Subscription();


comments$!: Observable<Comment[]>
newComment: string = '';


private quizService = inject(QuizService);
private authService = inject(AuthService);
private userService = inject(UserService)

currentuserId = this.authService.uid;

 ngOnInit(): void {

    if (this.categoryName && this.quizId) {
      this.comments$ = this.quizService.getComments(this.categoryName, this.quizId);
    }
  }

canDelete(comment: Comment): boolean {
  return comment.userId === this.currentuserId;
}

deleteComent(commentId: string) {
  const sub = this.quizService.deleteComment(this.categoryName, this.quizId, commentId)
    .subscribe({
      next: () => {
        this.comments$ = this.quizService.getComments(this.categoryName, this.quizId);
      },
      error: (err) => console.error('Failed to delete comment', err)
    });
  this.subscription.add(sub);
}

submitComment() {
  if (!this.newComment.trim()) return;

  const categoryName = this.categoryName;
  const quizId = this.quizId;
  const userId = this.userService.getCurrentUserId();

  if (!categoryName || !quizId || !userId) {
    console.error('Missing categoryName, quizId or userId');
    return;
  }

  this.userService.getUser(userId).pipe(
    take(1),
    switchMap(user => {
      const userName = user.displayName || 'No name';
      const userPhotoUrl = user.photoUrl || null;
      return this.quizService.addComment(
        categoryName, quizId, this.newComment.trim(), userId, userName, userPhotoUrl
      );
    })
  ).subscribe({
    next: () => {
      this.newComment = '';
      this.comments$ = this.quizService.getComments(categoryName, quizId);
    },
    error: err => console.error('Failed to add comment', err),
  });
}
isLoggedIn(): boolean {
  return this.authService.isLoggedIn();
}

ngOnDestroy(): void {
  this.subscription.unsubscribe();
}

}
