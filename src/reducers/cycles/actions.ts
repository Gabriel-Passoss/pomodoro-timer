import { Cycle } from "./reducer";

export enum ActionTypes {
  createNewCycle = 'createNewCycle',
  interruptCurrentCycle = 'interruptCurrentCycle',
  markCurrentCycleAsFinished = 'markCurrentCycleAsFinished'
}

export function createNewCycleAction(newCycle: Cycle) {
  return {
    type: ActionTypes.createNewCycle,
    payload: {
       newCycle
    }
  }
}

export function interruptCurrentCycleAction() {
  return {
    type: ActionTypes.interruptCurrentCycle,

  }
}

export function markCurrentCycleAsFinishedAction() {
  return {
    type: ActionTypes.markCurrentCycleAsFinished,
  }
}