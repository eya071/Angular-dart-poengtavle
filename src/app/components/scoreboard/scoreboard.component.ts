import { Component, signal, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

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

  spillere = signal<Player[]>([]);

  visRegler = false;
  visResultat = false;
  ranking: any[] = [];

  // 🔹 For moving focus to next name input
  @ViewChildren('nameInput') nameInputs!: QueryList<ElementRef>;

  focusNext(index: number) {
    const inputs = this.nameInputs.toArray();
    const nextInput = inputs[index + 1];

    if (nextInput) {
      nextInput.nativeElement.focus();
    }
  }

  getTotal(s: Player): number {
    return s.kast1 + s.kast2 + 2;
  }

  leggTilSpiller() {
    this.spillere.update((list) => [...list, { navn: '', kast1: 0, kast2: 0 }]);
  }

  fjernSpiller(index: number) {
    this.spillere.update((list) => list.filter((_, i) => i !== index));
  }

  nyRunde() {
    this.spillere.update((list) => list.map((s) => ({ ...s, kast1: 0, kast2: 0 })));
  }

  lagreResultater() {
    this.ranking = [...this.spillere()]
      .map((s) => ({ ...s, total: this.getTotal(s) }))
      .sort((a, b) => b.total - a.total);

    this.visResultat = true;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data: any[] = XLSX.utils.sheet_to_json(sheet);

      const importedPlayers: Player[] = data.map((d) => ({
        navn: d.navn ?? '',
        kast1: Number(d.kast1) || 0,
        kast2: Number(d.kast2) || 0,
      }));

      this.spillere.set(importedPlayers);
    };

    reader.readAsArrayBuffer(file);
  }

  exportToExcel() {
    const data = this.spillere().map((s) => ({
      navn: s.navn,
      kast1: s.kast1,
      kast2: s.kast2,
      total: this.getTotal(s),
      dato: this.spillDato,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Poengtavle');
    XLSX.writeFile(workbook, 'poengtavle_resultater.xlsx');
  }
}
