import { RecoverPasswordComponent } from './recover-password.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { ElementRef } from '@angular/core';

describe('RecoverPasswordComponent (manual)', () => {
  let component: RecoverPasswordComponent;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    component = new RecoverPasswordComponent(
      new FormBuilder(),
      snackBarSpy,
      { nativeElement: document.createElement('div') } as ElementRef
    );
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('should call snackBar on submit', (done) => {
    component.form.setValue({ email: 'test@example.com' });

    // Sobrescreve setTimeout para disparar imediatamente
    spyOn(window, 'setTimeout').and.callFake((cb: any) => cb());

    component.submit();

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'E-mail enviado! Verifique sua caixa de entrada com os próximos passos.',
      'Fechar',
      { duration: 5000, verticalPosition: 'top', horizontalPosition: 'center' }
    );
    done();
  });
});
