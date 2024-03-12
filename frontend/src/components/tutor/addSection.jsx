import { useState } from 'react';
import axios from 'axios';
import AddSubSection from './addSubSection';

const AddSection = ({ courseId }) => {
    const [title, setTitle] = useState('');
    const [subSections, setSubSections] = useState([{}]); // Initialize with one empty subsection

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`/api/courses/${courseId}/sections`, { title, subSections });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const addSubSection = () => {
        setSubSections([...subSections, {}]); // Add a new empty subsection
    };

    const removeSubSection = (index) => {
        const newSubSections = [...subSections];
        newSubSections.splice(index, 1);
        setSubSections(newSubSections); // Remove the subsection at the specified index
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sectionTitle">
                    Section Title:
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="sectionTitle" type="text" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            {subSections.map((subSection, index) => (
                <div key={index} className="mb-4">
                    <AddSubSection />
                    <button type="button" onClick={() => removeSubSection(index)} className="text-red-500 hover:text-red-700">Remove Subsection</button>
                </div>
            ))}
            <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={addSubSection}>
                    Add Subsection
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                    Submit
                </button>
            </div>
        </form>
    );
};

export default AddSection;
