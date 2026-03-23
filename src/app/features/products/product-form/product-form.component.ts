import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../product.service';
import { CanComponentDeactivate } from '../../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit, CanComponentDeactivate {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);

  isEditMode = false;
  productId: number | null = null;
  isLoading = false;
  isSaving = false;
  submitted = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(1000)]],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    stockQuantity: [null as number | null, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  canDeactivate(): boolean {
    return this.submitted || !this.form.dirty;
  }

  private loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          stockQuantity: product.stockQuantity
        });
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const value = this.form.value as { name: string; description: string; price: number; stockQuantity: number };

    const request$ = this.isEditMode && this.productId
      ? this.productService.update(this.productId, value)
      : this.productService.create(value);

    request$.subscribe({
      next: () => {
        this.submitted = true;
        this.snackBar.open(
          this.isEditMode ? 'Produto atualizado com sucesso.' : 'Produto criado com sucesso.',
          'Fechar',
          { duration: 3000 }
        );
        this.router.navigate(['/products']);
      },
      error: (err: HttpErrorResponse) => {
        this.isSaving = false;
        if (err.status === 400 && err.error?.errors) {
          this.applyServerErrors(err.error.errors);
        }
      }
    });
  }

  private applyServerErrors(errors: Record<string, string[]>): void {
    const fieldMap: Record<string, string> = {
      Name: 'name',
      Description: 'description',
      Price: 'price',
      StockQuantity: 'stockQuantity'
    };

    Object.entries(errors).forEach(([key, messages]) => {
      const controlName = fieldMap[key];
      if (controlName) {
        this.form.get(controlName)?.setErrors({ serverError: messages[0] });
      }
    });
  }

  getError(field: string): string | null {
    const control = this.form.get(field);
    if (!control || !control.invalid || !control.touched) return null;
    if (control.errors?.['required']) return 'Campo obrigatório.';
    if (control.errors?.['maxlength']) return `Máximo de ${control.errors['maxlength'].requiredLength} caracteres.`;
    if (control.errors?.['min']) return field === 'price' ? 'Deve ser maior que zero.' : 'Não pode ser negativo.';
    if (control.errors?.['serverError']) return control.errors['serverError'];
    return null;
  }
}
