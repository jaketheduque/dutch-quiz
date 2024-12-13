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
      <PocketBaseProvider>
        <RouterProvider router={router} />
      </PocketBaseProvider>
    </div>
  );
}

export default App;
