import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
  private currentLang = 'en';

  getLang() {
    return this.currentLang;
  }

  setLang(lang: string) {
    this.currentLang = lang;
    localStorage.setItem('appLang', lang);
  }

  loadLangFromStorage() {
    const saved = localStorage.getItem('appLang');
    if (saved) this.currentLang = saved;
  }
}
