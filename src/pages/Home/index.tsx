import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import zod from 'zod'
import { Play } from "phosphor-react";
import { 
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput
  } from "./styles";

  
  const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe uma tarefa'),
    minutesAmount: zod.number().min(5, 'Tempo mínimo é 5 minutos').max(60, 'Tempo máximo é 60 minutos')
  })

  type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

  interface Cycle {
    id: string,
    task: string,
    minutesAmount: number
  }

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleID, setActiveCycleID] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 25,
    },
  })

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleID(newCycle.id)
    reset()
  }
  
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleID)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60
  
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="">Vou trabalhar em</label>
          <TaskInput 
            list="task-suggestions" 
            placeholder="Dê um nome para seu projeto"
            {...register('task')}
          />
          <datalist id="task-suggestions">
            <option value="Projeto 1" />
          </datalist>

          <label htmlFor="">Durante</label>
          <MinutesAmountInput 
            type="number" 
            placeholder="00" 
            step={5} 
            min={5} 
            max={60}
            {...register('minutesAmount', { valueAsNumber: true})}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play size={24}/>
          Começar
        </StartCountdownButton>
      
      </form>
    </HomeContainer>
  );
}
