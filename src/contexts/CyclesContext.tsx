import { ReactNode, createContext, useState, useReducer, useEffect } from "react";
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import { createNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";

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
    }
  )
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const { cycles, activeCycleID } = cyclesState

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@pomodoro-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])


  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleID)

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