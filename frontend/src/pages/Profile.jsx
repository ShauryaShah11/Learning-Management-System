import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useRecoilState, useRecoilCallback } from "recoil";
import { userState } from "../store/atoms/userState";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "../services/secureApiService";
import { tokenAtom } from "../store/atoms/token";
import { jwtDecode } from "jwt-decode";
import { userAtom } from "../store/atoms/userAtom";

function Profile() {
    const [userData, setUserData] = useRecoilState(userAtom);
    const [token, setToken] = useRecoilState(tokenAtom);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const setUserStateValueAndNavigate = useRecoilCallback(
        ({ snapshot, set }) =>
            async () => {
                const token = localStorage.getItem("token");
                if (token) {
                    setToken(token);
                    const decoded = jwtDecode(token);
                    set(userState, {
                        isLoggedIn: true,
                        id: decoded.id,
                        role: decoded.role,
                    });
                    const loadable = snapshot.getLoadable(userState);
                    if (
                        loadable.state === "hasValue" &&
                        !loadable.contents.isLoggedIn
                    ) {
                        navigate("/login");
                    }
                }
            }
    );

    useEffect(() => {
        setUserStateValueAndNavigate();
        const fetchUser = async () => {
            try {
                const response = await fetchUserData(token);
                setUserData(response);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [token, setUserData]);

    return (
        <div className="flex flex-col justify-center items-center m-20">
            <div className="text-3xl mb-6 text-center font-bold capitalize">
                Manage profile
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 bg-gray">
                <form>
                    {" "}
                    {/* Wrap the form around the entire content */}
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 justify-center items-center bg-white">
                        <div className="mb-4 flex flex-col items-start">
                            <label className="mb-1 capitalize">
                                First Name
                            </label>
                            <div className="relative w-full">
                                <input
                                    name="firstName"
                                    readOnly
                                    value={userData?.firstName}
                                    className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded border border-gray-300 focus:outline-none focus:border-blue-500 text-lg"
                                />
                            </div>
                        </div>
                        <div className="mb-4 flex flex-col items-start">
                            <label className="mb-1 capitalize">Last Name</label>
                            <div className="relative w-full">
                                <input
                                    name="lastName"
                                    readOnly
                                    value={userData?.lastName}
                                    className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded border border-gray-300 focus:outline-none focus:border-blue-500 text-lg"
                                />
                            </div>
                        </div>
                        <div className="mb-4 flex flex-col items-start">
                            <label className="mb-1 capitalize">User Name</label>
                            <div className="relative w-full">
                                <input
                                    name="username"
                                    readOnly
                                    value={userData?.username}
                                    className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded border border-gray-300 focus:outline-none focus:border-blue-500 text-lg"
                                />
                            </div>
                        </div>
                        <div className="mb-4 flex flex-col items-start">
                            <label className="mb-1 capitalize">Email</label>
                            <div className="relative w-full">
                                <input
                                    name="firstName"
                                    readOnly
                                    value={userData?.email}
                                    className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded border border-gray-300 focus:outline-none focus:border-blue-500 text-lg"
                                />
                            </div>
                        </div>
                        <div className="mb-4 flex flex-col items-start">
                            <label className="mb-1 capitalize">
                                Contact Number
                            </label>
                            <div className="relative w-full">
                                <input
                                    name="contactNumber"
                                    readOnly
                                    value={userData?.contactNumber}
                                    className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded border border-gray-300 focus:outline-none focus:border-blue-500 text-lg"
                                />
                            </div>
                        </div>
                        <div className="mb-4 flex flex-col items-start">
                            <label className="mb-1 capitalize">Age</label>
                            <div className="relative w-full">
                                <input
                                    name="firstName"
                                    readOnly
                                    value={userData?.age}
                                    className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded border border-gray-300 focus:outline-none focus:border-blue-500 text-lg"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <Loader color="#00BFFF" loading={loading} size={10} />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;
