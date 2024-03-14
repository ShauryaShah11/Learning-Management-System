import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateSection } from "../../services/secureApiService";
import toast from "react-hot-toast";
import { fetchSectionById } from "../../services/apiService";
import Loader from "../Loader";
import useToken from "../../hooks/useToken";

const EditSection = () => {
    const [section, setSection] = useState({
        title: "",
    });
    const { id } = useParams();
    const [token] = useToken();
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSectionData = async () => {
            try {
                const response = await fetchSectionById(id);
                console.log("Section data:", response);
                setSection(response);
                setTitle(response.title);
            } catch (error) {
                console.error("Error fetching section data:", error);
            }
        };
        fetchSectionData();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            await updateSection(id, { title }, token);
            toast.success("Section updated successfully");
        } catch (error) {
            toast.error("Error updating section");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="sectionTitle"
                    >
                        Section Title:
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="sectionTitle"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                    >
                        Add Subsection
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Update
                    </button>
                </div>
                <div>
                    <Loader color="#00BFFF" loading={loading} size={10} />
                </div>
            </form>
        </>
    );
};

export default EditSection;
