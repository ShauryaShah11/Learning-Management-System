import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchUserById, updateUser } from "../../services/secureApiService";
import Loader from "../../components/Loader";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../../store/atoms/token";

function EditUser() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [token, setToken] = useRecoilState(tokenAtom);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchUserById(id, token);
                setUserData(response);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching course data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        }
    }, []);

    const [formState, setFormState] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
        age: "",
    });

    useEffect(() => {
        if (userData) {
            setFormState(userData);
        }
    }, [userData]);

    const handleChange = (event) => {
        const value = ["contactNumber", "age"].includes(event.target.name)
            ? Number(event.target.value)
            : event.target.value;

        setFormState({
            ...formState,
            [event.target.name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await updateUser(id, formState, token);
            toast.success("User updated successfully");
            setLoading(false); 
        } catch (error) {
            toast.error("Error Updating User");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader color="#00BFFF" loading={loading} size={10} />;
    }

    return (
        <div className="p-8 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Edit Instructor</h1>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2">First Name:</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formState.firstName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Last Name:</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formState.lastName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={formState.username}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formState.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">
                                Contact Number:
                            </label>
                            <input
                                type="number"
                                name="contactNumber"
                                value={formState.contactNumber}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Age:</label>
                            <input
                                type="number"
                                name="age"
                                value={formState.age}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <input
                        type="submit"
                        value="Update"
                        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                    />
                </form>
            </div>
        </div>
    );
}

export default EditUser;
