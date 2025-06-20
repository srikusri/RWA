import { Observable } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms'; // If using reactive forms

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // To ignore unknown elements like app-navigation

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;

  beforeEach(async () => {
    // Mock AuthService
    authServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(
        new Observable((subscriber) => {
          subscriber.next({
            user: { id: 1, email: 'test@example.com', role: 'resident' },
          }); // Mock successful login response
          subscriber.complete();
        }),
      ),
      isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(false),
      currentUserValue: null,
      getUserRole: jasmine.createSpy('getUserRole').and.returnValue(null), // Added missing spy
    };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, // Standalone component import
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    // It's good practice to call detectChanges after componentInstance is set,
    // but for some tests, you might want to detectChanges() inside the it() block
    // or after certain actions. For initial creation, it's fine here.
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an email input, password input, userType select, and a login button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input[name="email"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="password"]')).toBeTruthy();
    expect(compiled.querySelector('select[name="userType"]')).toBeTruthy(); // Added check for userType
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
  });

  // Example test for form submission (assuming Reactive Forms and onSubmit method)
  /*
  it('should call authService.login on form submit with valid data', () => {
    // Check if loginForm exists
    if (!component.loginForm) {
      // If loginForm is not initialized by default (e.g. in ngOnInit that might be complex to call here)
      // then this test might need more setup or might indicate an issue in component init.
      // For now, let's assume loginForm is available.
      // A common pattern is to initialize form in constructor or ngOnInit.
      // If ngOnInit does significant work, fixture.detectChanges() might be needed before accessing form.
      fail('loginForm is not available on the component');
      return; // or throw error
    }

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');
    component.loginForm.controls['userType'].setValue('resident');

    // Ensure onSubmit method exists
    if (!component.onSubmit) {
      fail('onSubmit method is not available on the component');
      return;
    }
    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      userType: 'resident'
    });
  });
  */
});
