import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-succesfully-changed-name',
  imports: [],
  templateUrl: './succesfully-changed-name.html',
  styleUrl: './succesfully-changed-name.css'
})
export class SuccesfullyChangedName {

  constructor(private router: Router) {
  }
    goToProfile() {
    this.router.navigate(['/profile']); 
  }
}
