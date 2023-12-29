import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import Login from "../views/Login";
import Chat from "../views/Chat";
import MessageScreen from "../components/MessageScreen";
import NoUserScreen from "../components/NoUserScreen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <h1>Something went wrong!</h1>,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "chat",
        element: <Chat />,
        children: [
          {
            index: true,
            element: <NoUserScreen />
          },
          {
            path: ":userId",
            element: <MessageScreen />,
          },
        ],
      },
    ],
  },
]);

export default router;
