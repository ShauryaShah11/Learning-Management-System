import { jwtDecode } from 'jwt-decode';

import { useState, useEffect } from "react";

function useIsLoggedIn(){
    const [userState, setUserState] = useState({
        isLoggedIn: false,
        role: 'guest'
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            const decoded = jwtDecode(token);
            console.log(decoded);
            setUserState({
                isLoggedIn: true,
                role: decoded.role
            });
        }
        console.log(userState);
    }, []);

    return userState;
}

export default useIsLoggedIn;