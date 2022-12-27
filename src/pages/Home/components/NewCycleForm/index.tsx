import { FormContainer, MinutesAmountInput, TaskInput } from './styles'
import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import { CyclesContext } from '../../../../contexts/CyclesContext'

export function NewCycleForm() {
  const { activeCycle  } = useContext(CyclesContext)
  const { register } = useFormContext()

  return (
    <FormContainer>
          <label htmlFor="">Vou trabalhar em</label>
          <TaskInput
            list="task-suggestions" 
            placeholder="Dê um nome para seu projeto"
            {...register('task')}
            disabled={!!activeCycle}
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
            disabled={!!activeCycle}
          />

          <span>minutos.</span>
        </FormContainer>
  )
}