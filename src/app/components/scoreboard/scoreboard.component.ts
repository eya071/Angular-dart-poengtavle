import { Component } from '@angular/core';
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
      .map((s) => ({ ...s, total: this.getTotal(s) }))
      .sort((a, b) => b.total - a.total);

    this.visResultat = true;
  }

  //  IMPORT FRA EXCEL
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const data: any[] = XLSX.utils.sheet_to_json(sheet);

      this.spillere = data.map((d) => ({
        navn: d.navn || '',
        kast1: Number(d.kast1) || 0,
        kast2: Number(d.kast2) || 0,
      }));
    };

    reader.readAsArrayBuffer(file);
  }

  //  EKSPORT TIL EXCEL
  exportToExcel() {
    const data = this.spillere.map((s) => ({
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
