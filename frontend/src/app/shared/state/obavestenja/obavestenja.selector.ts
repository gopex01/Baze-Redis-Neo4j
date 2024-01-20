import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ObavestenjaState } from "./obavestenja.reducer";

export const selectObavestenjaState=createFeatureSelector<ObavestenjaState>('obv');

export const selectAllObavestenja=createSelector(
    selectObavestenjaState,
    (state)=>state.listaObavestenja
)