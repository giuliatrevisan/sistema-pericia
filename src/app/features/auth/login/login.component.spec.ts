import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { throwError } from 'rxjs';


import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/interceptors/auth.service';

describe('LoginComponent', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideZonelessChangeDetection()
      ]
    }).compileComponents();
  });

  it('should create the login component', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    expect(component.form.invalid).toBeTrue();
  });

  it('should call AuthService.login and navigate on submit', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    component.form.setValue({ username: 'test', password: '1234' });
    authServiceSpy.login.and.returnValue(of(void 0));

    component.submit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test', '1234');
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('');
  });

  it('should set error signal on login failure', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
  
    component.form.setValue({ username: 'test', password: '1234' });
    const error = new Error('Invalid credentials');
    
    // Mock do AuthService retornando erro
    authServiceSpy.login.and.returnValue(throwError(() => error));
  
    component.submit();
  
    expect(component.error()).toBe('Invalid credentials');
    expect(component.loading()).toBeFalse();
  });
});
