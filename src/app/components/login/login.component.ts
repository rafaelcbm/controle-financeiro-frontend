import { Component } from '@angular/core';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { throwError } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {


  loginData = { login: '', password: '' };

  constructor(private loginService: LoginService, private router: Router, private _snackBar: MatSnackBar, private authService: AuthService) { }

  login() {
    this.loginService.login(this.loginData).subscribe(
      {
        next: (response: any) => {
          console.log('Login bem-sucedido:', response);

          localStorage.setItem('jwt-token', response.token);

          let user = this.authService.getUser();

          this._snackBar.open(`Bem Vindo, ${user}! `, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.router.navigate(['/home']);
        }
      }
    );
  }
}
