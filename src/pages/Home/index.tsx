import { HandPalm, Play } from "phosphor-react";
import zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { 
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
  } from "./styles";
import { NewCycleForm } from './components/NewCycleForm';
import { Countdown } from './components/Countdown';
import { CyclesContext } from "../../contexts/CyclesContext";
import { useContext } from "react";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe uma tarefa'),
  minutesAmount: zod.number().min(5, 'Tempo mínimo é 5 minutos').max(60, 'Tempo máximo é 60 minutos')
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const { createNewCycle, activeCycle, interruptCurrentCycle } = useContext(CyclesContext)
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 25,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm  

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(createNewCycle)}>
        
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown /> 
          { activeCycle ? (
            <StopCountdownButton type="button" onClick={interruptCurrentCycle}>
              <HandPalm  size={24}/>
              Começar
            </StopCountdownButton>
          ) : (
            <StartCountdownButton type="submit"  disabled={isSubmitDisabled}>
              <Play size={24}/>
              Começar
            </StartCountdownButton>
          )}
      </form>
    </HomeContainer>
  );
}
