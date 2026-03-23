import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged, switchMap, startWith, combineLatest } from 'rxjs';
import { Subject } from 'rxjs';
import { ProductService } from '../product.service';
import { Product, PagedResult } from '../../../models/product.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['name', 'description', 'price', 'stockQuantity', 'actions'];
  dataSource: Product[] = [];
  totalCount = 0;
  pageSize = 10;
  pageIndex = 0;
  isLoading = false;

  searchControl = new FormControl('');
  private refresh$ = new Subject<void>();

  ngOnInit(): void {
    combineLatest([
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged()
      ),
      this.refresh$.pipe(startWith(undefined))
    ]).pipe(
      switchMap(([name]) => {
        this.isLoading = true;
        return this.productService.getAll({
          name: name ?? '',
          page: this.pageIndex + 1,
          pageSize: this.pageSize
        });
      })
    ).subscribe({
      next: (result: PagedResult<Product>) => {
        this.dataSource = result.items;
        this.totalCount = result.totalCount;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.refresh$.next();
  }

  onDelete(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Excluir Produto',
        message: `Deseja excluir "${product.name}"? Esta ação não pode ser desfeita.`,
        confirmLabel: 'Excluir'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.productService.delete(product.id).subscribe({
          next: () => {
            this.snackBar.open('Produto excluído com sucesso.', 'Fechar', { duration: 3000 });
            this.refresh$.next();
          }
        });
      }
    });
  }
}
