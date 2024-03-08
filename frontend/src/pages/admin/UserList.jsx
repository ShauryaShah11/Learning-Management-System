import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { fetchUsers } from "../../services/secureApiService";
import UserTable from "../../components/UserTable";

const UserList = () => {
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await fetchUsers();
                console.log("users", response)
                setUsers(response);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserData();
    }, []);

    const handleEdit = (userId) => {
        navigate(`/admin/users/${userId}`);
    };

    const handleDelete = (userId) => {
        console.log(`Deleting course with ID ${userId}`);
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
                    to={"/admin/addcourse"}
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
