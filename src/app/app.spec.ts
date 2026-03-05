<<<<<<< HEAD
import { provideZonelessChangeDetection } from '@angular/core';
=======
>>>>>>> 53b036966c30718bb2f8410656ebe2d0f4e00ad4
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
<<<<<<< HEAD
      providers: [provideZonelessChangeDetection()]
=======
>>>>>>> 53b036966c30718bb2f8410656ebe2d0f4e00ad4
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
<<<<<<< HEAD
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, placement-management-system');
=======
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, frontend');
>>>>>>> 53b036966c30718bb2f8410656ebe2d0f4e00ad4
  });
});
