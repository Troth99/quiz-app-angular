import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../helper/changeFlag.helper';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz-footer-component',
  imports: [FormsModule],
  templateUrl: './quiz-footer-component.html',
  styleUrl: './quiz-footer-component.css',
})
export class QuizFooterComponent implements OnInit {
  languages = [
    { code: 'en', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'bg', flag: 'https://flagcdn.com/w40/bg.png' },
  ];
  selectedLang = 'en';
  flagUrl = this.languages[0].flag;
  constructor(private langService: LanguageService) {}

  ngOnInit(): void {
    this.langService.loadLangFromStorage();
    this.selectedLang = this.langService.getLang();
    const found = this.languages.find(l => l.code === this.selectedLang);
    if (found) {
      this.flagUrl = found.flag
    }
  }

  changeLanguage(lang: string) {
    const found = this.languages.find((l) => l.code === lang);
    if (found) {
      this.flagUrl = found.flag;
    }
    this.selectedLang = lang;
    this.langService.setLang(lang);
  }
}
