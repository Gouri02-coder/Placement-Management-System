import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-pto-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './pto-layout.component.html',
  styleUrls: ['./pto-layout.component.css']
})
export class PtoLayoutComponent {}
