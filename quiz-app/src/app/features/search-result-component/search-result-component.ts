import { Component, inject, OnInit } from '@angular/core';
import { Quiz } from '../../core/models';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../core/services/quiz.service';
import { Loading } from '../../shared';


@Component({
  selector: 'app-search-result-component',
  imports: [Loading],
  templateUrl: './search-result-component.html',
  styleUrl: './search-result-component.css'
})
export class SearchResultComponent implements OnInit {

  searchTerm: string = '';
  searchResults: Quiz[] = [];
  isLoading = false;

  private route = inject(ActivatedRoute);
  private quizService = inject(QuizService);
  private router = inject(Router)

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      if(this.searchTerm.length < 2 ) {
        this.searchResults = [];
        return
      }

      this.isLoading = true;
       this.quizService.searchAllQuizzes(this.searchTerm).subscribe({
        next: (results) => {
          this.searchResults = results;
          this.isLoading = false; 
        },
        error: () => {
          this.searchResults = [];
          this.isLoading = false; 
        }
      });
    })
  }


  openQuiz(category: string, id: string | number){
    this.router.navigate(['/quiz/play', category, id])
  }
}
