import { UsersComponent } from './user.component';
import { ThemeService } from '../../core/services/theme.service';
import { ChangeDetectorRef } from '@angular/core';

describe('UsersComponent (minimal, no zone)', () => {
  let component: UsersComponent;
  let themeMock: ThemeService;
  let cdrMock: ChangeDetectorRef;

  beforeEach(() => {
    themeMock = { isDarkMode: () => false } as any;
    cdrMock = { detectChanges: () => {} } as any;

    component = new UsersComponent({} as any, cdrMock, themeMock);
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should have loading true initially', () => {
    expect(component.loading).toBe(true);
  });

  it('should have empty users array initially', () => {
    expect(component.users).toEqual([]);
  });

  it('should handle carregarUsers without token', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.carregarUsers();
    expect(component.hasError).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('should handle carregarUsers with token (mocked HTTP)', () => {
    spyOn(localStorage, 'getItem').and.returnValue('fake-token');
    const fakeHttp = { get: () => ({ subscribe: (cb: any) => cb({ users: [{ id: 1, username: 'john' }] }) }) } as any;
    component = new UsersComponent(fakeHttp, cdrMock, themeMock);

    component.carregarUsers();
    expect(component.users.length).toBe(1);
    expect(component.users[0].username).toBe('john');
    expect(component.loading).toBe(false);
    expect(component.hasError).toBe(false);
  });
});
