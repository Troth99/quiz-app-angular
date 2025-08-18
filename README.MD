# 🎯 QuizApp – Angular + Firebase

## 🌍 The QuizApp is deployed At

👉 [https://quiz-app-3471b.web.app/](https://quiz-app-3471b.web.app/)


**QuizApp** is a modern single-page application (SPA) for creating, solving, and tracking quizzes. Built with **Angular** and fully integrated with **Firebase**, it includes user authentication, real-time database, and live hosting.

---

## 🧩 Key Features

### 🔐 Authentication
- User registration and login via **Firebase Authentication**
- Session handling and auto logout

### 📝 Quiz Solving
- Quizzes loaded dynamically from **Firestore**
- Multiple-choice questions
- Per-quiz timer (optional)
- Real-time scoring and results
- End-of-quiz summary

### 👤 User Dashboard (after login)
- History of solved quizzes
- Detailed stats and progress tracking

### 🌐 Guest Mode (no login required)
- Access to public quizzes
- View details for the quizzes, likes and comments

### 🛠️Logged in user (CRUD)
- Add / edit / delete quizzes
- Manage questions and options

### 💬 Quiz Details & Comments
- View descriptions and instructions per quiz
- Optional commenting system

---

## ☁️ Firebase Integration

- **Authentication** – login, registration, logout
- **Firestore** – quizzes, questions, results, comments
- **Hosting** – production build hosted on Firebase
- **Environment Config** – separate config files for dev/prod

---

## 📦 Tech Stack

- [Angular 20](https://angular.dev/)
- [Firebase](https://firebase.google.com/)
- [AngularFire](https://github.com/angular/angularfire)
- [Angular Material](https://material.angular.io/)
- [NgRx](https://ngrx.io/) – Reactive State Management
- TypeScript, RxJS, SCSS

---

## ▶️ Installation & Running Locally

Follow these steps to run the app locally:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/quiz-app-angular.git
cd quiz-app-angular
```

### 2. Install dependencies

```bash
npm install
npm install firebase @angular/fire
npm install @angular/material @angular/cdk @angular/animations
npm install @angular/material-icons
npm install @ngrx/store @ngrx/effects @ngrx/store-devtools @ngrx/entity
```

### 3. Run development server

```bash
ng serve
```

Open your browser at [http://localhost:4200](http://localhost:4200)

---

