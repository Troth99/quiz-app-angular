export class FirebaseLoginErrorHandler {
  static getMessage(code?: string, fallback = 'An unknown error occurred.'): string {
    switch (code) {
      case 'auth/invalid-email':
        return 'The email address is invalid.';
      case 'auth/user-disabled':
        return 'This user account has been disabled.';
      case 'auth/user-not-found':
        return 'User not registered.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/invalid-credential':
        return 'Invalid login credentials.';
      default:
        return fallback;
    }
  }
}