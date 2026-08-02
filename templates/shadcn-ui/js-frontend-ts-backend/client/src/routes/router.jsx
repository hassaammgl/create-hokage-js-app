import {
    createBrowserRouter,
} from "react-router";
import Home from "../pages/Home";
import Login from "../pages/Login"
import Signup from "../pages/Signup";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Home,
    },
    {
        path: "/login",
        Component: Login,
    },
    {
        path: "/signup",
        Component: Signup,
    },
]);
