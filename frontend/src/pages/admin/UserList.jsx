import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { fetchUsers, removeUser } from "../../services/secureApiService";
import UserTable from "../../components/UserTable";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../../store/atoms/token";
import toast from "react-hot-toast";

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
    }, [token]); 

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        }
    }, []); // Include setToken in the dependency array

    const handleEdit = (userId) => {
        navigate(`/admin/users/${userId}`);
    };

    const handleDelete = async (userId) => {
        try{
            await removeUser(userId, token);
            toast.success('user successfully removed');
        }
        catch(error) {
            toast.error('Failed to remove user');
            console.error(error);
        }
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
            <h1 className="text-xl font-bold mb-6">Manage Users</h1>
            <UserTable
                users={users}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        </>
    );
};

export default UserList;
