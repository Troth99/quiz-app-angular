# 🎯 QuizApp – Angular + Firebase

A modern single-page application for creating, solving, and tracking quizzes. Built with **Angular** and fully integrated with **Firebase**, this app demonstrates real-world SPA architecture, cloud-based backend, and user authentication.

---

## 🧩 Features

- 🔐 **Authentication**  
  - User registration and login using **Firebase Auth**
  - Session persistence with auto-login
  
- 📝 **Quiz Functionality**  
  - Dynamic loading of quizzes from **Firestore**
  - Multiple-choice questions
  - Real-time scoring
  - Timer per quiz (optional)
  - Result summary at the end

- 👤 **User Dashboard (for logged-in users)**  
  - View solved quizzes
  - Track results and scores

- 🌐 **Guest Mode (for unregistered users)**  
  - Solve available quizzes without saving results
  - View public quizzes

- ⚙️ **Admin Mode (optional if implemented)**  
  - Add / edit / delete quizzes
  - Manage questions and options

- ☁️ **Firebase Integration**  
  - Firebase Authentication (login, register, logout)
  - Firestore Database (quizzes, questions, results)
  - Firebase Hosting for live deployment
  - Environment-based config (secure)

---

## 📦 Technologies

- [Angular 20](https://angular.dev/)
- [Firebase](https://firebase.google.com/)
- [AngularFire](https://github.com/angular/angularfire)
- TypeScript, RxJS

---

## ▶️ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/quiz-app-angular.git
cd quiz-app-angular