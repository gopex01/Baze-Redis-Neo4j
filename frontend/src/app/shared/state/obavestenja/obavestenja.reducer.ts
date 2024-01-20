import { createReducer, on } from "@ngrx/store";
import { Obavestenje } from "../../models/obavestenje";
import * as obvActions from "../../state/obavestenja/obavestenja.action"

export interface ObavestenjaState{
    listaObavestenja:Obavestenje[]
}

export const initialState:ObavestenjaState={
    listaObavestenja:[]
}

export const obavestenjaReducer=createReducer(
    initialState,
    on(obvActions.postaviObavestenja,(state,{listaObavestenja})=>({
        ...state,
        listaObavestenja
    })),
    
)