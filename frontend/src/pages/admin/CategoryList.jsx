import { Link, useNavigate } from "react-router-dom";
import { categoryAtom } from "../../store/atoms/category";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { fetchCategories } from "../../services/apiService";
import Loader from "../../components/Loader";

const CategoryList = () => {
    const [categories, setCategories] = useRecoilState(categoryAtom);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoriesData = async () => {
            try {
                setLoading(true);
                const response = await fetchCategories();
                setCategories(response);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchCategoriesData();
    }, []);

    const handleEdit = (categoryId) => {
        navigate(`/admin/categories/${categoryId}`);
    };

    const handleDelete = (categoryId) => {
        console.log(`Deleting category with ID ${categoryId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="#00BFFF" loading={loading} size={20} />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>
            <div className="hidden md:flex flex items-center space-x-4 ">
                <Link
                    to={"/admin/categories/add"}
                    className="text-white hover:text-gray border p-2 shadow-inner rounded-md bg-blue-500"
                >
                    Add Category
                </Link>
            </div>
            <div className="pt-5 pb-5"></div>
            <table className="min-w-full bg-white border border-gray">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Courses</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, index) => (
                        <tr key={category.id}>
                            <td className="py-2 px-4 border-b text-center">
                                {index + 1}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                {category.categoryName}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                {category.description}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                <button
                                    onClick={() => handleEdit(category._id)}
                                    className="bg-blue-700 text-white px-3 py-1 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(category._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryList;
