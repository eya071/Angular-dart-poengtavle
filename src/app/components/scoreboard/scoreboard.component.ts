import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Player {
  navn: string;
  kast1: number;
  kast2: number;
}

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css'],
})
export class ScoreboardComponent {
  spillDato: string = new Date().toISOString().substring(0, 10);

  spillere: Player[] = [{ navn: 'Spiller 1', kast1: 0, kast2: 0 }];

  visRegler = false;
  visResultat = false;
  ranking: any[] = [];

  getTotal(s: Player): number {
    return s.kast1 + s.kast2 + 2;
  }

  leggTilSpiller() {
    this.spillere.push({ navn: '', kast1: 0, kast2: 0 });
  }

  fjernSpiller(index: number) {
    this.spillere.splice(index, 1);
  }

  nyRunde() {
    this.spillere.forEach((s) => {
      s.kast1 = 0;
      s.kast2 = 0;
    });
  }

  lagreResultater() {
    this.ranking = [...this.spillere]
      .map((s) => ({
        ...s,
        total: this.getTotal(s),
      }))
      .sort((a, b) => b.total - a.total);

    this.visResultat = true;
  }
}
