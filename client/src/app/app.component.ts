import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="sidenav-header">
          <mat-icon class="logo-icon">shopping_cart</mat-icon>
          <span class="app-title">Orders Admin</span>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/orders" routerLinkActive="active-link">
            <mat-icon matListItemIcon>receipt_long</mat-icon>
            <span matListItemTitle>Pedidos</span>
          </a>
          <a mat-list-item routerLink="/analytics" routerLinkActive="active-link">
            <mat-icon matListItemIcon>analytics</mat-icon>
            <span matListItemTitle>Analíticas</span>
          </a>
          <a mat-list-item routerLink="/settings" routerLinkActive="active-link">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>Configuración</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="main-content">
        <mat-toolbar color="primary" class="app-toolbar">
          <button mat-icon-button (click)="toggleSidenav()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="spacer"></span>
          <button mat-icon-button>
            <mat-icon>notifications</mat-icon>
          </button>
          <button mat-icon-button>
            <mat-icon>account_circle</mat-icon>
          </button>
        </mat-toolbar>

        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 260px;
      background: #1a1a2e;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
    }

    .sidenav-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .logo-icon {
      color: #6366f1;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .app-title {
      color: #f8fafc;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #f1f5f9;
    }

    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    }

    .spacer {
      flex: 1 1 auto;
    }

    .content-area {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }

    .active-link {
      background: rgba(99, 102, 241, 0.15) !important;
      border-right: 3px solid #6366f1;
    }

    .active-link mat-icon {
      color: #6366f1 !important;
    }

    .active-link span {
      color: #6366f1 !important;
      font-weight: 500;
    }
  `]
})
export class AppComponent {
  private sidenavOpened = true;

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}