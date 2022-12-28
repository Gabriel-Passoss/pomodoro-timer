import { produce } from 'immer'

import { ActionTypes } from "./actions"

export interface Cycle {
  id: string,
  task: string,
  minutesAmount: number,
  startDate: Date,
  interruptedDate?: Date,
  finishedDate?: Date
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleID: string | null 
}

export function cyclesReducer(state: CyclesState, action: any) {
  switch(action.type) {
    case ActionTypes.createNewCycle: {
      return produce(state, draft => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleID = action.payload.newCycle.id
      })
    }
    case ActionTypes.interruptCurrentCycle: {
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleID
      })
      if (currentCycleIndex < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleID = null
        draft.cycles[currentCycleIndex].interruptedDate = new Date()
      })
    }
    case ActionTypes.markCurrentCycleAsFinished: {
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleID
      })
      if (currentCycleIndex < 0) {
        return state
      }

      if(localStorage.getItem('@pomodoro-timer:notification') === 'granted') {
        new Notification('Timer finalizado!', {
          body: `A task ${state.cycles[currentCycleIndex].task} foi finalizada!`,
          badge: '../../assets/logo-ignite.svg'
        })
      }

      return produce(state, (draft) => {
        draft.activeCycleID = null
        draft.cycles[currentCycleIndex].finishedDate = new Date()
      })
    }
    default:
      return state
  }
}