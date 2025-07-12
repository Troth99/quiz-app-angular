import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/users/user.service';

import {  Subscription } from 'rxjs';


@Component({
  selector: 'app-quiz-login-component',
  imports: [],
  templateUrl: './quiz-login-component.html',
  styleUrl: './quiz-login-component.css'
})
export class QuizLoginComponent implements OnInit, OnDestroy {
  private allUsersSub!: Subscription;
  private singleUserSub!: Subscription;

  constructor(private userService: UserService){}

  ngOnInit(): void {
    this.allUsersSub = this.userService.getAllUsers().subscribe(users => {
      console.log('All users:', users)
    })
    this.singleUserSub = this.userService.getUser('n5mXqFvPydhS3yIWalhkHB43eFT2').subscribe((user) => {
      console.log('single user', user)
    })
    
  }

  ngOnDestroy(): void {
    this.singleUserSub.unsubscribe()
    this.allUsersSub.unsubscribe()
  }
}
