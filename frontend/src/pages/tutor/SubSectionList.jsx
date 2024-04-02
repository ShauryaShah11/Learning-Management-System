import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import useToken from "../../hooks/useToken";
import { fetchSubSection } from "../../services/apiService";
import SubSectionTable from "../../components/tutor/SubSectionTable";

const SubSectionList = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [token] = useToken();
    const [subsections, setSubSections] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSectionData = async () => {
            try {
                setLoading(true);
                const response = await fetchSubSection(id);
                console.log(response);
                setSubSections(response);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error(error);
            }
        };
        fetchSectionData();
    }, [id]); 

    const handleEdit = (subsectionId) => {
        navigate(`/tutor/subsection/edit/${subsectionId}`);
    };

    const handleDelete = (subsectionId) => {
        console.log(`Deleting section with ID ${subsectionId}`);
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
            <h1 className="text-3xl font-bold mb-6">Manage Sub Section</h1>
            <div className="hidden md:flex flex items-center space-x-4 pb-5">
                <Link
                    to={`/tutor/subsection/add/${id}`}
                    className="text-white hover:text-gray border p-2 shadow-inner rounded-md bg-blue-500"
                >
                    Add SubSection
                </Link>
            </div>
            <SubSectionTable
                subsections={subsections}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        </>
    );
};

export default SubSectionList;
