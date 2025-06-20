import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth'; // Corrected import to './auth'

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const API_BASE_URL = 'http://localhost:3000/api'; // Match service

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear(); // Clear local storage before each test
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isLoggedIn should be false initially or if no user in localStorage', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  describe('login', () => {
    it('should store user in localStorage and update currentUserSubject on successful login', (done) => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: 'resident',
        firstName: 'Test',
        lastName: 'User',
      };
      const mockLoginResponse = { message: 'Login successful', user: mockUser };

      service
        .login({
          email: 'test@example.com',
          password: 'password',
          userType: 'resident',
        })
        .subscribe((response) => {
          expect(response).toEqual(mockLoginResponse);
          expect(service.isLoggedIn()).toBeTrue();
          expect(service.currentUserValue).toEqual(mockUser);
          // Check localStorage directly
          const storedUser = localStorage.getItem('currentUser');
          expect(storedUser).toBeTruthy();
          if (storedUser) {
            expect(JSON.parse(storedUser)).toEqual(mockUser);
          }
          done();
        });

      const req = httpMock.expectOne(`${API_BASE_URL}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockLoginResponse);
    });

    it('should not store user if login response does not contain user', (done) => {
      const mockLoginResponse = {
        message: 'Login successful, but no user data.',
      }; // No user object
      service
        .login({
          email: 'test@example.com',
          password: 'password',
          userType: 'resident',
        })
        .subscribe((response) => {
          expect(response).toEqual(mockLoginResponse);
          expect(service.isLoggedIn()).toBeFalse(); // Should still be false
          expect(service.currentUserValue).toBeNull();
          expect(localStorage.getItem('currentUser')).toBeNull();
          done();
        });
      const req = httpMock.expectOne(`${API_BASE_URL}/auth/login`);
      req.flush(mockLoginResponse);
    });
  });

  it('getUserRole should return null if not logged in', () => {
    expect(service.getUserRole()).toBeNull();
  });

  it('getUserRole should return user role if logged in', (done) => {
    const mockUser = {
      id: 1,
      email: 'admin@example.com',
      role: 'administrator',
      firstName: 'Admin',
      lastName: 'User',
    };
    // Simulate login
    service
      .login({
        email: 'admin@example.com',
        password: 'pw',
        userType: 'administrator',
      })
      .subscribe(() => {
        expect(service.getUserRole()).toBe('administrator');
        done();
      });
    const req = httpMock.expectOne(`${API_BASE_URL}/auth/login`);
    req.flush({ user: mockUser }); // Ensure the response for login has the user object
  });

  it('logout() should clear user from localStorage and currentUserSubject', () => {
    // Removed done as it is not needed for sync code
    // First, simulate a logged-in state
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      role: 'resident',
      firstName: 'Test',
      lastName: 'User',
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    // Manually trigger the BehaviorSubject as if login happened and persisted user was loaded on service init
    // This requires casting to 'any' to access private member for test setup, or a dedicated test helper in service
    (service as any).currentUserSubject.next(mockUser);

    expect(service.isLoggedIn()).toBeTrue(); // Pre-condition: user is logged in

    service.logout();

    expect(service.isLoggedIn()).toBeFalse();
    expect(service.currentUserValue).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  describe('getPersistedUser', () => {
    it('should return null if no user in localStorage', () => {
      localStorage.removeItem('currentUser');
      // To test getPersistedUser, we'd ideally re-initialize the service or expose getPersistedUser.
      // For this test, we can check the initial state of currentUserSubject if it calls getPersistedUser on init.
      // Or, if getPersistedUser is private, test its effects via public API like isLoggedIn initially.
      // Re-instantiate service to test constructor logic with getPersistedUser
      const newServiceInstance = TestBed.inject(AuthService);
      expect(newServiceInstance.currentUserValue).toBeNull();
    });

    it('should return user if user exists in localStorage', () => {
      const mockUser = { id: 2, email: 'stored@example.com', role: 'admin' };
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      const newServiceInstance = TestBed.inject(AuthService); // Re-instantiate
      expect(newServiceInstance.currentUserValue).toEqual(mockUser);
    });
  });
});
