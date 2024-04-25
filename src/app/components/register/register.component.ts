import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { RegisterService } from '../../services/register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerData = { login: '', password: '', role: '' };

  constructor(private registerService: RegisterService, private router: Router, private _snackBar: MatSnackBar) { }

  register() {
    
    //TODO: Implementar diferença entre perfis
    this.registerData.role='ADMIN';

    this.registerService.register(this.registerData).subscribe(
      {
        next: (response: any) => {
          console.log('Registro bem-sucedido:', response);

          this._snackBar.open('Registro bem sucedido!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Erro ao registrar:', error);
          // Adicione aqui a lógica para lidar com o erro
        }
      }
    );
  }
}
