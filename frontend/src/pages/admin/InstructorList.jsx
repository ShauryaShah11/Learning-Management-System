import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { fetchInstructors, removeInstructor } from "../../services/secureApiService";
import InstructorTable from "../../components/InstructorTable";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../../store/atoms/token";
import toast from "react-hot-toast";

const InstructorList = () => {
    const [instructor, setInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useRecoilState(tokenAtom);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                setLoading(true);
                const response = await fetchInstructors(token);
                setInstructor(response);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchInstructorData();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        }
    }, []);

    const handleEdit = (instructorId) => {
        navigate(`/admin/instructors/${instructorId}`);
    };

    const handleDelete = async (instructorId) => {
        try{
            await removeInstructor(instructorId, token);
            toast.success('tutor successfully removed');
        }
        catch(error) {
            toast.error('Failed to remove tutor');
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
            <h1 className="text-xl font-bold mb-6">Manage Instructors</h1>
            <InstructorTable
                instructors={instructor}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        </>
    );
};

export default InstructorList;
