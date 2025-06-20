import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdminDashboardComponent, // Standalone
        RouterTestingModule,
        HttpClientTestingModule, // In case of any direct/indirect HTTP calls via services
      ],
      schemas: [NO_ERRORS_SCHEMA], // To handle custom elements in template if any
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the admin dashboard title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // The admin_home.html mockup (used for admin-dashboard.html) has "Admin Dashboard" in an h2
    const titleElement = compiled.querySelector('h2');
    expect(titleElement).toBeTruthy();
    // Check content if element exists
    if (titleElement) {
      // Check if textContent is not null before calling toContain
      expect(
        titleElement.textContent ? titleElement.textContent : '',
      ).toContain('Admin Dashboard');
    }
  });
});
