import { useState, useEffect } from "react";
import { fetchCategories } from "../services/apiService";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { useRecoilState } from "recoil";
import { categoryAtom } from "../store/atoms/category";
import { AddCourseData } from "../services/secureApiService";
import { tokenAtom } from "../store/atoms/token";

function AddCourse() {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useRecoilState(categoryAtom);
    const [token, setToken] = useRecoilState(tokenAtom);
    const [formState, setFormState] = useState({
        courseName: "",
        price: "",
        duration: "",
        description: "",
        level: "beginner",
        prerequisites: "",
        language: "",
        file: null,
        category: "",
    });

    useEffect(() => {
        const fetchCategoriesData = async () => {
            try {
                const categoriesResponse = await fetchCategories();
                setCategories(categoriesResponse);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setLoading(false);
            }
        };

        fetchCategoriesData();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            setToken(token);
        }
    }, [])

    const handleChange = (event) => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value,
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFormState({
            ...formState,
            file: file,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const price = parseFloat(formState.price);
    
        const formData = new FormData();
        formData.append("courseName", formState.courseName);
        formData.append("price", price);
        formData.append("duration", formState.duration);
        formData.append("level", formState.level);
        formData.append("prerequisites", formState.prerequisites.split(","));
        formData.append("language", formState.language);
        formData.append("description", formState.description);
        formData.append("file", formState.file);
        formData.append("type", "images");
        formData.append("category", formState.category);
    
        try {
            await AddCourseData(formData, token);
            toast.success(`Course ${formState.courseName} added successfully`);
        } catch (error) {
            console.error("Error adding course:", error);
            toast.error("Error adding course");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader color="#00BFFF" loading={loading} size={10} />;
    }

    return (
        <div className="p-8 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Add Course</h1>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block mb-2">Course Name:</label>
                            <input
                                type="text"
                                name="courseName"
                                placeholder="enter your course name"
                                value={formState.courseName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Price:</label>
                            <input
                                type="number"
                                name="price"
                                placeholder="enter course price here"
                                value={formState.price}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block mb-2">Duration:</label>
                            <input
                                type="text"
                                name="duration"
                                placeholder="enter your course approx duration"
                                value={formState.duration}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Level:</label>
                            <select
                                name="level"
                                value={formState.level}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            >
                                <option value="" disabled>Select Course Level</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">
                                    Intermediate
                                </option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block mb-2">Prerequisites:</label>
                            <input
                                type="text"
                                name="prerequisites"
                                placeholder="enter course prerequisites separated by commas"
                                value={formState.prerequisites}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Language:</label>
                            <input
                                type="text"
                                name="language"
                                placeholder="enter mode language of the course"
                                value={formState.language}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Category:</label>
                            <select
                                name="category" // Ensure the name attribute matches your form state
                                value={formState.category} // Make sure to use the correct value from your form state
                                onChange={handleChange} // Make sure to define the handleChange function
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            >
                                <option value="" disabled selected>Select Course Category</option>
                                {categories.map((category) => (
                                    <option
                                        key={category._id}
                                        value={category._id}
                                    >
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2">
                                Upload Thumbnail:
                            </label>
                            <input
                                type="file"
                                accept="image/*, video/*, application/pdf"
                                name="file"
                                onChange={handleFileChange}
                                className="p-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2">Description:</label>
                        <textarea
                            name="description"
                            value={formState.description}
                            placeholder="Enter course description"
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <input
                        type="submit"
                        value="Add Course"
                        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                    />
                </form>
            </div>
        </div>
    );
}

export default AddCourse;
