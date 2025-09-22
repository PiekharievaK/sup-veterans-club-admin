import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'
import { LoaderProvider } from './providers/LoaderProvider'
import { Loader } from './components/Loader/Loader'


function App() {

  return (
    <>
      <BrowserRouter>
        <LoaderProvider>
          <Loader />
          <AppRoutes />
        </LoaderProvider>
      </BrowserRouter>
    </>
  )
}

export default App
