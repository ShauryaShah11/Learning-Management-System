import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addSection } from "../../services/secureApiService";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../../store/atoms/token";
import toast from "react-hot-toast";

const AddSection = () => {
    const [title, setTitle] = useState("");
    const { id } = useParams();
    const [token, setToken] = useRecoilState(tokenAtom);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await addSection(id, { title }, token);
            toast.success("Section added successfully");
        } catch (error) {
            console.error(error);
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
                        type="submit"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </>
    );
};

export default AddSection;
