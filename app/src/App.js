import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import PocketBaseProvider from './Components/PocketBaseProvider';
import { PrivateRoute } from './Components/PrivateRoute';

import Login from './Components/Login';
import Home from './Components/Home';
import Register from './Components/Register';
import FlavorCombosPage from './Components/FlavorCombosPage';

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
  }
]);

function App() {
  return (
    <div class="bg-zinc-50 h-max min-h-screen w-full">
      <PocketBaseProvider>
        <RouterProvider router={router} />
      </PocketBaseProvider>
    </div>
  );
}

export default App;
