import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  output,
} from '@angular/core';
import { AuthService, User, UserService } from '../../../../core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';
import { SuccesfullyChangedName } from '../succesfully-changed-name/succesfully-changed-name';
import { Loading } from "../../../../shared";

@Component({
  selector: 'app-change-display-name',
  imports: [ReactiveFormsModule, CommonModule, SuccesfullyChangedName, Loading],
  templateUrl: './change-display-name.html',
  styleUrl: './change-display-name.css',
})
export class ChangeDisplayName implements OnInit {
  @Output() done = new EventEmitter<void>();
  userService = inject(UserService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  nameForm: FormGroup;
  saving = false;
  error: string | null = null;
  success = false;
  canChangeName = true;

  constructor() {
    this.nameForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit() {
     this.canChangeName = false;
    const uid = this.authService.uid;
    if (uid) {

      this.userService.getUser(uid).subscribe((userDoc: User) => {
        const lastChangeRaw = userDoc.lastDisplayNameChange;

        let lastChangeDate: Date | null = null;

        if (lastChangeRaw instanceof Timestamp) {
          lastChangeDate = lastChangeRaw.toDate();
        } else if (lastChangeRaw instanceof Date) {
          lastChangeDate = lastChangeRaw;
        }
        if (lastChangeDate) {
          const now = new Date();
          const millisecondsSinceLastChange =
            now.getTime() - lastChangeDate.getTime();
          const daysSinceLastChange =
            millisecondsSinceLastChange / (1000 * 60 * 60 * 24);
          const requiredDaysBetweenChanges = 3;

          this.canChangeName =
            daysSinceLastChange >= requiredDaysBetweenChanges;

          if (!this.canChangeName) {
            const daysLeft = Math.ceil(
              requiredDaysBetweenChanges - daysSinceLastChange
            );
            this.error = `You can change your name after ${daysLeft} days.`;
          }
        }
      });
    }
  }
  saveName() {
    if (this.nameForm.invalid) return;

    const newName = this.nameForm.value.displayName;

    this.saving = true;
    this.error = null;
    this.success = false;

    this.authService.updateDisplayName(newName).subscribe({
      next: () => {
        this.saving = false;
        this.success = true;
        this.error = null;
        this.done.emit();
        this.canChangeName = false;
      },
      error: (err) => {
        this.saving = false;
        this.success = false;
        this.error = err.message || 'Error updating name';
      },
    });
  }
  get displayNameInvalid(): boolean {
    const control = this.nameForm.get('displayName');
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  get displayNameErrors() {
    return this.nameForm.get('displayName')?.errors || null;
  }
}
