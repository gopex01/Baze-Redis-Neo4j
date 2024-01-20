import { Component, Input, OnInit, inject } from '@angular/core';
import { Obavestenje } from '../shared/models/obavestenje';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-obavestenje',
  templateUrl: './obavestenje.component.html',
  styleUrls: ['./obavestenje.component.css']
})
export class ObavestenjeComponent implements OnInit{

  
  @Input()
  obavestenje:Obavestenje|null;
  ngOnInit(): void {
    
  }
  constructor()
  {
    this.obavestenje=null;
  }

}
