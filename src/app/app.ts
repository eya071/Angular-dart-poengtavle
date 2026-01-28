import { Component } from '@angular/core';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ScoreboardComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {}
