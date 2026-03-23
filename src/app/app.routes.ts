import { Routes } from '@angular/router';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'products/new',
    loadComponent: () =>
      import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent),
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: 'products/:id/edit',
    loadComponent: () =>
      import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent),
    canDeactivate: [unsavedChangesGuard]
  },
  { path: '**', redirectTo: 'products' }
];
