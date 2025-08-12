import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { leaderboardEntry } from '../../core/models';
import { LeaderboardService } from '../../core/services/leaderBoard.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormatTimePipe } from '../../core/pipes/format.pipe';
import { Router } from '@angular/router';
import { Loading } from '../../shared';

@Component({
  standalone: true,
  selector: 'app-leaderboard',
  imports: [AsyncPipe, CommonModule, FormatTimePipe, Loading],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css'
})
export class Leaderboard implements OnInit {
  leaderBoard$!: Observable<(leaderboardEntry & { index: number })[]>;

  constructor(private leaderboardService: LeaderboardService, private route: Router) {}

  ngOnInit(): void {
    this.leaderBoard$ = this.leaderboardService.getTopUsers(20).pipe(
      map(users => users.map((user, index) => ({ ...user, index })))
    );
  }

  onUserClick(user: leaderboardEntry) {
    this.route.navigate(['user', user.id])

 
}
}