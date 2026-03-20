import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;
  loginForm: FormGroup;
  errorMessage: string = '';

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
      this.errorMessage = '';
      
      const { email, password } = this.loginForm.value;
      const loginRequest = { email, password };

      console.log('Attempting login with:', email);

      this.authService.login(loginRequest).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('Login response:', response);
          
          if (response && response.status === 'success') {
            if (response.user) {
              console.log('Login successful, user role:', response.user.role);
              this.authService.redirectToDashboard();
            }
          } else {
            this.errorMessage = response?.message || 'Login failed';
            alert(this.errorMessage);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          
          let errorMsg = 'Login failed. Please try again.';
          
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMsg = error.error;
            } else if (error.error.message) {
              errorMsg = error.error.message;
            }
          }
          
          this.errorMessage = errorMsg;
          alert(errorMsg);
        }
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}