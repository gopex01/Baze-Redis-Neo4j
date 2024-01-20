import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ObavestenjaService } from "src/app/services/obavestenja.service";
import * as obvActions from '../../state/obavestenja/obavestenja.action'
import { map, merge, mergeMap } from "rxjs";
import { Obavestenje } from "../../models/obavestenje";

@Injectable()
export class ObavestenjaEffects{
    constructor(private actions$:Actions,private obvService:ObavestenjaService)
    {
        const obavestenja$=createEffect(()=>this.actions$.pipe(
            ofType(obvActions.vratiObavestenja),
            mergeMap(()=>this.obvService.vratiObavestenja().pipe(
                map((listaObavestenja:any)=>obvActions.postaviObavestenja({listaObavestenja}))
            ))
            ))
    }
}