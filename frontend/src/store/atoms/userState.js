import { atom } from "recoil";

export const userState = atom({
    key: "userState",
    default: { isLoggedIn: false,id:undefined,  role: "guest" }, // default value
});
