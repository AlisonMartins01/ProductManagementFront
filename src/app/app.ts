import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, AsyncPipe, MatToolbarModule, MatProgressBarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  loading$ = inject(LoadingService).loading$;
}
