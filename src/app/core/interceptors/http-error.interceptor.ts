import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 404) {
        snackBar.open('Produto não encontrado.', 'Fechar', { duration: 4000 });
        router.navigate(['/products']);
      } else if (error.status === 500) {
        snackBar.open('Erro interno no servidor. Tente novamente.', 'Fechar', { duration: 4000 });
      } else if (error.status === 0) {
        snackBar.open('Sem conexão com o servidor.', 'Fechar', { duration: 4000 });
      }
      return throwError(() => error);
    })
  );
};
