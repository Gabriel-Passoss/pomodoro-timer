import { ReactNode, createContext, useState } from "react";

interface Cycle {
  id: string,
  task: string,
  minutesAmount: number,
  startDate: Date,
  interruptedDate?: Date,
  finishedDate?: Date
}

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
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleID, setActiveCycleID] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleID)

  function markCurrentCycleAsFinished ( ) {
    setCycles(state => state.map(cycle => {
      if (cycle.id === activeCycleID) {
        return {...cycle, finishedDate: new Date()}
      } else {
        return cycle
      }
    })) 
  }

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

    setCycles((state) => [...state, newCycle])
    setActiveCycleID(newCycle.id)
    setAmountSecondsPassed(0)
    // reset()
  }

  function interruptCurrentCycle () {
    setCycles(state => state.map(cycle => {
      if (cycle.id === activeCycleID) {
        return {...cycle, interruptedDate: new Date()}
      } else {
        return cycle
      }
    }))

    setActiveCycleID(null)
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