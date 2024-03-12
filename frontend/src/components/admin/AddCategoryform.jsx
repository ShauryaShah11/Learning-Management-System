import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addCategory } from "../../services/secureApiService";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../../store/atoms/token";

const AddCategoryForm = () => {
    const [formState, setFormState] = useState({
        categoryName: "",
        description: "",
        file: null
    });
    const navigate = useNavigate();
    const [token, setToken] = useRecoilState(tokenAtom);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFormState({
            ...formState,
            file: file,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("categoryName", formState.categoryName);
        formData.append("description", formState.description);
        formData.append("file", formState.file);
        formData.append("type", "images");
        try {
            await addCategory(formData, token);
            toast.success("Category Added successfully");
        } catch (error) {
            console.log(error);
            toast.error("Error Adding category");
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <form className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mb-4">
            <h2 className="text-2xl font-bold mb-4">Add Category</h2>
            <div className="mb-4">
                <label
                    htmlFor="categoryName"
                    className="block text-sm font-semibold mb-2"
                >
                    Category Name
                </label>
                <input
                    type="text"
                    id="categoryName"
                    name="categoryName" // Corrected the name attribute
                    value={formState.categoryName}
                    onChange={handleChange}
                    className="w-full border py-2 px-3 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter category name"
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="description"
                    className="block text-sm font-semibold mb-2"
                >
                    Description
                </label>
                <textarea
                    name="description"
                    value={formState.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter category description"
                />
            </div>
            <div>
                <label className="block mb-2">Upload Thumbnail Image:</label>
                <input
                    type="file"
                    accept="image/*, video/*, application/pdf"
                    name="file"
                    onChange={handleFileChange}
                    className="p-2 focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600"
                >
                    Submit
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default AddCategoryForm;
