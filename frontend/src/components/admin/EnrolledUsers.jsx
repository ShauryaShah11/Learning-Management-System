import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Loader";
import { fetchEnrolledUsers } from "../../services/secureApiService";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../../store/atoms/token";

const EnrolledUsers = () => {
    const { id } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [token, setToken] = useRecoilState(tokenAtom);
    useEffect(() => {
        const fetchCoursesData = async () => {
            try {
                setLoading(true);
                const response = await fetchEnrolledUsers(id, token);
                setUsers(response);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCoursesData();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="#00BFFF" loading={loading} size={20} />
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <h1 className="text-3xl font-bold mb-6">Enrolled Users</h1>
            {/* User-related Options */}
            <div className="pt-5 pb-5"></div>
            
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Username</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Contact Number</th>
                        <th className="py-2 px-4 border-b">Age</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id}>
                            <td className="py-2 px-4 border-b text-center">
                                {index + 1}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {user.username}
                            </td>
                            <td className="py-2 px-4 border-b">{`${user.firstName}  ${user.lastName}`}</td>
                            <td className="py-2 px-4 border-b">
                                {user.email}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {user.contactNumber}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {user.age}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EnrolledUsers;
