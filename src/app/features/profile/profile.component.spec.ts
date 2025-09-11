import { ProfileComponent } from './profile.component';

describe('ProfileComponent (minimal, no zone, with dialog mock)', () => {
  let component: ProfileComponent;

  beforeEach(() => {
    const themeServiceMock = { isDarkMode: () => false };
    const matDialogMock = { open: jasmine.createSpy('open').and.returnValue({ afterClosed: () => ({ subscribe: (fn: any) => fn(true) }) }) };

    component = new ProfileComponent(
      {} as any, 
      { detectChanges: () => {} } as any, 
      themeServiceMock as any,
      matDialogMock as any
    );
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should have loading true by default', () => {
    expect(component.loading).toBe(true);
  });

  it('should have undefined user initially', () => {
    expect(component.user).toBeUndefined();
  });

  it('should update avatar manually', () => {
    component.user = { id: 1, username: 'john', email: 'john@test.com', roles: ['USER'], active: true };
    const fakeFileEvent = { target: { files: [new File([], 'avatar.png')] } };
    component.onFileSelected(fakeFileEvent);
    expect(component.user.avatarUrl).toBeUndefined(); 
  });

  it('should open edit modal without crashing', () => {
    component.user = { id: 1, username: 'john', email: 'john@test.com', roles: ['USER'], active: true };
    component.abrirEditarModal();
    expect((component as any).dialog.open).toHaveBeenCalled();
  });
});
