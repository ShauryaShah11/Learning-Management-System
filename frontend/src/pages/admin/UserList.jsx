import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { fetchUsers } from "../../services/secureApiService";
import UserTable from "../../components/UserTable";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../../store/atoms/token";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [token, setToken] = useRecoilState(tokenAtom);
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await fetchUsers(token);
                setUsers(response);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false); // Make sure to set loading to false on error
            }
        };
        fetchUserData();
    }, [token]); // Include token in the dependency array

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        }
    }, [setToken]); // Include setToken in the dependency array

    const handleEdit = (userId) => {
        navigate(`/admin/users/${userId}`);
    };

    const handleDelete = (userId) => {
        console.log(`Deleting user with ID ${userId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="#00BFFF" loading={loading} size={20} />
            </div>
        );
    }

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
            <div className="hidden md:flex flex items-center space-x-4 pb-5">
                <Link
                    to={"/admin/adduser"}
                    className="text-black hover:text-gray border p-2 shadow-inner rounded-md bg-green"
                >
                    Add User
                </Link>
            </div>
            <UserTable
                users={users}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        </>
    );
};

export default UserList;
