import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class QuizCreateFormService {
    public form: FormGroup;

    constructor(private fb : FormBuilder){
        this.form = this.fb.group({
            title: ['', Validators.required],
            description: [''],
            timeLimit: [null],
            shuffleQuestions: [false],
            category: ['',Validators.required],
            newCategoryName: [''],
                questions: this.fb.array([this.createQuestion()])

        })
    }

    get questions(): FormArray{
        return this.form.get('questions') as FormArray
    }
  addQuestion() {
    this.questions.push(this.createQuestion());
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

   resetForm() {
    this.form.reset();
    this.questions.clear();
    this.addQuestion(); 
  }

      private createQuestion(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      type: ['multiple'],
      answers: this.fb.array([
        this.createAnswer(),
        this.createAnswer()
      ]),
      correctAnswers: this.fb.array([])
    });
  }

    private createAnswer(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      isCorrect: [false]
    });
  }
}