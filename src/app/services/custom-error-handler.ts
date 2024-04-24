import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, NgZone, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class CustomErrorHandler implements ErrorHandler {


    constructor(
        private zone: NgZone,
        private snackBar: MatSnackBar,
        private router: Router,
        private authService: AuthService
    ) { }

    handleError(error: Error | HttpErrorResponse): void {

        // Log the error to the console.
        console.error(error);


        let message = '';

        if (error instanceof HttpErrorResponse) {
            switch (error.status) {
                case HttpStatusCode.BadRequest:
                    message = error.error?.message ? error.error.message : error.error;
                    break;
                case HttpStatusCode.Unauthorized:
                    message = 'Usuário não encontrado ou senha inválida.';
                    this.authService.removeToken();
                    this.zone.run(() => {
                        this.router.navigate(['/login']);
                    });
                    break;
                case HttpStatusCode.Forbidden:
                    message = 'Usuário não tem permissão para realizar essa operação.';
                    break;
                case HttpStatusCode.InternalServerError:
                    message = 'Erro inesperado no servidor. Contate o administrador do sistema.';
                    break;
                case HttpStatusCode.ServiceUnavailable:
                    message = 'Servidor indisponível! Tente novamente mais tarde. Se o problema persistir contate o administrador do sistema.';
                    break;
            }
        } else {
            message = error.message;
        }

        this.zone.run(() => {
            this.snackBar.open(message, 'Fechar', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
            });
        });

        
    }
}