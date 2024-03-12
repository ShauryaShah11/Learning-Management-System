import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { fetchInstructorById, updateInstructor } from "../services/secureApiService";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../store/atoms/token";

function EditInstructor() {
    const [instructorData, setInstructorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [token ,setToken] = useRecoilState(tokenAtom);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchInstructorById(id, token);
                setInstructorData(response);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching course data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const [formState, setFormState] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
        age: "",
        yearOfExperience: "",
        bio: "",
        expertise: "",
        achievements: ""
    });

    useEffect(() => {
        if (instructorData) {
            setFormState({
                username: instructorData.userId.username || "",
                firstName: instructorData.userId.firstName || "",
                lastName: instructorData.userId.lastName || "",
                email: instructorData.userId.email || "",
                contactNumber: instructorData.userId.contactNumber || "",
                age: instructorData.userId.age || "",
                yearOfExperience: instructorData.yearOfExperience || "",
                bio: instructorData.bio || "",
                expertise: instructorData.expertise || ""
            });
        }
    }, [instructorData]);

    const handleChange = (event) => {
        const value = ["contactNumber", "age", "yearOfExperience"].includes(event.target.name) 
            ? Number(event.target.value) 
            : event.target.value;
    
        setFormState({
            ...formState,
            [event.target.name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try{
            const response = await updateInstructor(id, formState, token);
            toast.success("Instructor updated successfully")
        }   
        catch(error){
            console.error("Error updating instructor:", error);
            toast.error("Error updating instructor");
        }
        finally{
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
                            <label className="block mb-2">Contact Number:</label>
                            <input
                                type="number"
                                name="contactNumber"
                                value={formState.contactNumber}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Years of Experience:</label>
                            <input
                                type="text"
                                name="yearOfExperience"
                                value={formState.yearOfExperience}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Bio:</label>
                            <input
                                type="text"
                                name="bio"
                                value={formState.bio}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Expertise:</label>
                            <input
                                type="text"
                                name="expertise"
                                value={formState.expertise}
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

export default EditInstructor;
