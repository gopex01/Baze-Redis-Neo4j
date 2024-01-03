import { Component, Input } from '@angular/core';
import { Igrac } from '../shared/models/igrac';

@Component({
  selector: 'app-igrac',
  templateUrl: './igrac.component.html',
  styleUrls: ['./igrac.component.css'],
})
export class IgracComponent {
  @Input() igrac!: Igrac;
  constructor() {}
}
