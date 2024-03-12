import { useState } from "react";
import { tutorRegister } from "../../services/authService";
import Loader from "../../components/Loader";

function TutorSignupPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        contactNumber: "",
        password: "",
        age: "",
        bio: "",
        expertise: "",
        yearOfExperience: "",
        achivements: ""
    });
    const [loading, setLoading] = useState(false);

    const changeHandler = (e) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            await tutorRegister(formData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center m-20">
            <div className="text-3xl mb-6 text-center font-bold">Sign Up</div>
            <div className="bg-white rounded-lg shadow-md p-8 bg-gray">
                <form onSubmit={submitHandler}>
                    {" "}
                    {/* Wrap the form around the entire content */}
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 justify-center items-center bg-white">
                        {[
                            "firstName",
                            "lastName",
                            "username",
                            "email",
                            "contactNumber",
                            "password",
                            "age",
                            "bio",
                            "yearOfExperience",
                            "expertise",
                            "achievements"
                        ].map((field, index) => (
                            <div
                                key={index}
                                className="mb-4 flex flex-col items-start"
                            >
                                <label className="mb-1 capitalize">
                                    {field}
                                </label>
                                <div className="relative w-full">
                                    <input
                                        type={
                                            field === "password"
                                                ? "password"
                                                : field === "age"
                                                ? "number"
                                                : "text"
                                        }
                                        name={field}
                                        placeholder={
                                            field.charAt(0).toUpperCase() +
                                            field.slice(1)
                                        }
                                        onChange={changeHandler}
                                        className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded border border-gray-300 focus:outline-none focus:border-blue-500 text-lg"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-3 text-white rounded-lg bg-blue-500 shadow-lg hover:bg-blue-600 focus:outline-none mt-4"
                    >
                        Sign Up
                    </button>
                    <div className="mt-5">
                        <Loader color="#00BFFF" loading={loading} size={10} />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TutorSignupPage;
