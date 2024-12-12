import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import PocketBaseProvider from './Components/PocketBaseProvider';
import { PrimeReactProvider } from 'primereact/api';
import Tailwind from 'primereact/passthrough/tailwind';

import { PrivateRoute } from './Components/PrivateRoute';
import Login from './Components/Login';
import Home from './Components/Home';
import Register from './Components/Register';
import FlavorCombosPage from './Components/FlavorCombosPage';
import Quiz from './Components/Quiz';

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute element={<Home />} />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/flavorcombos",
    element: <FlavorCombosPage />
  },
  {
    path: "/quiz",
    element: <Quiz />
  }
]);

function App() {
  return (
    <div className="w-screen h-screen">
      <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
        <PocketBaseProvider>
          <RouterProvider router={router} />
        </PocketBaseProvider>
      </PrimeReactProvider>
    </div>
  );
}

export default App;
