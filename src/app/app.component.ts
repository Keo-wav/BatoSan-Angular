import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestsComponent } from "./components/tests/tests.component";
import { GoogleSheetComponentComponent } from './components/google-sheet-component/google-sheet-component.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TestsComponent, GoogleSheetComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BatoSanAngular';
}
