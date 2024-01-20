import { createAction, props } from "@ngrx/store";
import { Obavestenje } from "../../models/obavestenje";

export const vratiObavestenja=createAction(
    '[Obv] Vrati Sva Obavestenja',
    props<{username:string}>()
)
export const postaviObavestenja=createAction(
    '[Obv] Postavi obavestenja',
    props<{listaObavestenja:Obavestenje[]}>()
)