import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../../store/atoms/token";
import { fetchSection } from "../../services/apiService";
import SectionTable from "../../components/tutor/SectionTable";

const SectionList = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useRecoilState(tokenAtom);
    const [sections, setSections] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        }
    }, []);

    useEffect(() => {
        const fetchSectionData = async () => {
            try {
                setLoading(true);
                const response = await fetchSection(id);
                setSections(response);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchSectionData();
    }, [token]); // Include token in the dependency array

    const handleEdit = (sectionId) => {
        navigate(`/tutor/section/edit/${sectionId}`);
    };

    const handleDelete = (sectionId) => {
        console.log(`Deleting section with ID ${sectionId}`);
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
            <h1 className="text-3xl font-bold mb-6">Manage Section</h1>
            <div className="hidden md:flex flex items-center space-x-4 pb-5">
                <Link
                    to={`/tutor/section/add/${id}`}
                    className="text-white hover:text-gray border p-2 shadow-inner rounded-md bg-blue-500"
                >
                    Add Section
                </Link>
            </div>
            <SectionTable
                sections={sections}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        </>
    );
};

export default SectionList;
