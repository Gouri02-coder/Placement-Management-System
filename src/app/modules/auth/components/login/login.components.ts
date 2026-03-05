import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading: boolean = false;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      const { email, password } = this.loginForm.value;
      const loginRequest = { email, password };

      this.authService.login(loginRequest).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.user) {
            // The role is automatically detected and user is redirected to appropriate dashboard
            console.log('Login successful, user role:', response.user.role);
            this.authService.redirectToDashboard();
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          alert(error.message || 'Login failed! Please check your credentials.');
          this.isLoading = false;
        }
      });
    }
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}