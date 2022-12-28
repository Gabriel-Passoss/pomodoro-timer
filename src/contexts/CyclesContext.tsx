import { ReactNode, createContext, useState, useReducer, useEffect } from "react";
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import { createNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

interface CreateCycleData {
  task: string,
  minutesAmount: number
}

interface CyclesContextData {
  cycles: Cycle[],
  activeCycle: Cycle | undefined,
  activeCycleID: string | null,
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void,
  setSecondsPassed: (seconds: number) => void,
  createNewCycle: (data: CreateCycleData) => void,
  interruptCurrentCycle: () => void,
}

interface CyclesContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextData)

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {cycles: [], activeCycleID: null},
    () => {
      const storedStateAsJSON = localStorage.getItem("@pomodoro-timer:cycles-state-1.0.0")

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }

      return {
        cycles: [],
        activeCycleID: null
      }
    }
  )
  
  const { cycles, activeCycleID } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleID)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@pomodoro-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          localStorage.setItem('@pomodoro-timer:notification', 'granted')
        }
      })
    }
  }, [])

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function createNewCycle(data: CreateCycleData) { 
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    dispatch(createNewCycleAction(newCycle))
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle () {
    dispatch(interruptCurrentCycleAction())
  }

  function markCurrentCycleAsFinished ()  {
    dispatch(markCurrentCycleAsFinishedAction())
  }

   return (
    <CyclesContext.Provider value={{
      cycles,
      activeCycle, 
      activeCycleID, 
      markCurrentCycleAsFinished, 
      amountSecondsPassed, 
      setSecondsPassed,
      createNewCycle,
      interruptCurrentCycle
    }}>
      {children}
    </CyclesContext.Provider>
   )
}