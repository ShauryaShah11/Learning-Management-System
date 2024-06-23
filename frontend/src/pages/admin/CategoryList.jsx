import { Link, useNavigate } from "react-router-dom";
import { categoryAtom } from "../../store/atoms/category";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { fetchCategories } from "../../services/apiService";
import Loader from "../../components/Loader";
import CategoryTable from "../../components/admin/CategoryTable";
import { removeCategory } from "../../services/secureApiService";
import { tokenAtom } from "../../store/atoms/token";
import toast from "react-hot-toast";

const CategoryList = () => {
    const [categories, setCategories] = useRecoilState(categoryAtom);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useRecoilState(tokenAtom);
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

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        }
    }, []); 

    const handleEdit = (categoryId) => {
        navigate(`/admin/categories/${categoryId}`);
    };

    const handleDelete = async (categoryId) => {
        try{
            await removeCategory(categoryId, token);
            toast.success('course successfully removed');
        }
        catch(error) {
            toast.error('Failed to remove course');
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
        <div>
            <h1 className="text-xl font-bold mb-6">Manage Categories</h1>
            <div className="hidden md:flex flex items-center space-x-4 ">
                <Link
                    to={"/admin/categories/add"}
                    className="text-white hover:text-gray border p-2 shadow-inner rounded-md bg-blue-500"
                >
                    Add Category
                </Link>
            </div>
            <div className="pt-5 pb-5"></div>
            <CategoryTable 
                categories={categories}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        </div>
    );
};

export default CategoryList;
