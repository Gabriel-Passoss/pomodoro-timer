import { Router } from "./Router";
import { BrowserRouter } from 'react-router-dom'
import { CyclesContextProvider } from "./contexts/CyclesContext";

export function App() {
  return (
    <BrowserRouter>
    <CyclesContextProvider>
      <Router />
    </CyclesContextProvider>
    </BrowserRouter>
  )
}
