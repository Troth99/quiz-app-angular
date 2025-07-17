import { Component, effect, inject, signal } from '@angular/core';
import { AuthService, User } from '../../core';
import { Firestore, Timestamp, doc, docData } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-profile',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

showMoreOptions = false

private authService = inject(AuthService)
private AngularFireStore = inject(Firestore)
private router = inject(Router)

user = signal<User | null>(null);
uid = this.authService.uid;

constructor(){
  if(!this.uid) return 

  const userDoc = doc(this.AngularFireStore, `users/${this.uid}`);

  docData(userDoc).subscribe(rawData => {
    if(!rawData) return;

    const parsed: User = {
      ...rawData,
      createdAt: rawData['createdAt'] instanceof Timestamp ? rawData['createdAt'].toDate() : rawData['createdAt'],
      lastLogin: rawData['lastLogin'] instanceof Timestamp ? rawData['lastLogin'].toDate() : rawData['lastLogin'],
    } as User;

    this.user.set(parsed)
  })

}
toggleMoreOptions() {
  this.showMoreOptions = !this.showMoreOptions;
}
closeMoreOptions() {
  this.showMoreOptions = false;
}

disableAccount() {

  this.showMoreOptions = false;
}


async changePassword(){

}

async changeAvatar(){
  console.log('chaning avatar')
}

async changeDisplayName(){

}

async deleteAccount(){

}
logout(){
  this.authService.logout()
  this.router.navigate([''])
}
}
