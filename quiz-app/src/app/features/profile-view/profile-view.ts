import { Component, inject, Input, OnInit } from '@angular/core';
import { User } from '../../core';
import { Loading } from '../../shared';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as UserSelectors from "../../core/store/view-profile-store/view-profile.selectors"
import * as UserActions from '../../core/store/view-profile-store/view-profile.actions';

import { ActivatedRoute } from '@angular/router';
import { FirestoreDatePipe } from '../../core/pipes/convertFirebaseTimetampToDate.pipe';
import { FormatTimePipe } from '../../core/pipes/format.pipe';

@Component({
  selector: 'app-profile-view',
  imports: [Loading, CommonModule, FirestoreDatePipe, FormatTimePipe],
  templateUrl: './profile-view.html',
  styleUrl: './profile-view.css'
})
export class ProfileView implements OnInit {

   user$: Observable<User | null>
   loading$: Observable<boolean>;

   private route = inject(ActivatedRoute)

   constructor(private store: Store){
    this.user$ = this.store.pipe(select(UserSelectors.selectedUser));
    this.loading$ = this.store.pipe(select(UserSelectors.selectUserLoading))
   }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      if(userId){
        this.store.dispatch(UserActions.loadViewUser({ id: userId}))
      }
    })
  }

}
