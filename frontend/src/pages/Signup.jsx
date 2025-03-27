import { useState, useEffect } from "react";
import { register } from "../services/authService";
import Loader from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";

function SignupPage() {
    const initialFormData = {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        contactNumber: "",
        password: "",
        age: "",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitMessage, setSubmitMessage] = useState({ type: "", message: "" });
    const navigate = useNavigate();

    const validateField = (name, value) => {
        let error = "";
        
        switch (name) {
            case "firstName":
            case "lastName":
                if (!value.trim()) error = "This field is required";
                break;
            case "username":
                if (!value.trim()) error = "Username is required";
                else if (value.length < 4) error = "Username must be at least 4 characters";
                break;
            case "email":
                if (!value.trim()) error = "Email is required";
                else if (!/\S+@\S+\.\S+/.test(value)) error = "Email is invalid";
                break;
            case "contactNumber":
                if (!value.trim()) error = "Contact number is required";
                else if (!/^\d{10}$/.test(value)) error = "Contact number must be exactly 10 digits";
                break;
            case "password":
                if (!value) error = "Password is required";
                else if (value.length < 10) error = "Password must be at least 10 characters";
                break;
            case "age":
                if (!value) error = "Age is required";
                else if (value < 13 || value > 120) error = "Age must be between 13 and 120";
                break;
            default:
                break;
        }
        
        return error;
    };

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // Validate field as user types
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;
        
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });
        
        setErrors(newErrors);
        return isValid;
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setSubmitMessage({ type: "", message: "" });
        
        if (!validateForm()) {
            setSubmitMessage({ 
                type: "error", 
                message: "Please fix all errors before submitting." 
            });
            return;
        }
        
        setLoading(true);
        try {
            await register({
                username: formData.username,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                age: Number(formData.age),
                contactNumber: Number(formData.contactNumber),
            });
            setSubmitMessage({ 
                type: "success", 
                message: "Account created successfully! Redirecting to login..." 
            });
            // Reset form after successful submission
            setFormData(initialFormData);
            // Redirect to login page after 3 seconds
            setTimeout(() => {
                // Add navigation to login page here
                navigate("/login");
            }, 3000);
        } catch (error) {
            setSubmitMessage({ 
                type: "error", 
                message: "Registration failed. Please try again." 
            });
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = () => {
        const { password } = formData;
        if (!password) return { text: "", color: "" };
        
        if (password.length < 10) return { text: "Weak", color: "bg-red-500" };
        if (password.length < 12) return { text: "Moderate", color: "bg-yellow-500" };
        if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
            return { text: "Strong", color: "bg-green-500" };
        }
        return { text: "Good", color: "bg-blue-500" };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="flex flex-col justify-center items-center my-10 px-4">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Create Your Account</h1>
                    <p className="text-gray-600 mt-2">Join our learning platform today</p>
                </div>
                
                {submitMessage.message && (
                    <div className={`mb-6 p-4 rounded-md ${
                        submitMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                        {submitMessage.message}
                    </div>
                )}
                
                <form onSubmit={submitHandler} className="space-y-6">
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={changeHandler}
                                className={`w-full px-3 py-2 rounded-md border ${
                                    errors.firstName ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Enter your first name"
                            />
                            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={changeHandler}
                                className={`w-full px-3 py-2 rounded-md border ${
                                    errors.lastName ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Enter your last name"
                            />
                            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={changeHandler}
                                className={`w-full px-3 py-2 rounded-md border ${
                                    errors.username ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Choose a username"
                            />
                            {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={changeHandler}
                                className={`w-full px-3 py-2 rounded-md border ${
                                    errors.email ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="your.email@example.com"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Number
                            </label>
                            <input
                                type="text"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={changeHandler}
                                className={`w-full px-3 py-2 rounded-md border ${
                                    errors.contactNumber ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="10-digit mobile number"
                            />
                            {errors.contactNumber && <p className="mt-1 text-xs text-red-500">{errors.contactNumber}</p>}
                        </div>

                        {/* Age */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Age
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={changeHandler}
                                min="13"
                                max="120"
                                className={`w-full px-3 py-2 rounded-md border ${
                                    errors.age ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Your age"
                            />
                            {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
                        </div>

                        {/* Password Field - Full Width */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={changeHandler}
                                className={`w-full px-3 py-2 rounded-md border ${
                                    errors.password ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Minimum 10 characters"
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                            
                            {/* Password strength indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className={`${passwordStrength.color} h-2 rounded-full`} 
                                                style={{ width: `${(formData.password.length < 10) ? 
                                                    formData.password.length * 10 : 100}%` }}>
                                            </div>
                                        </div>
                                        <span className="ml-2 text-xs text-gray-600">{passwordStrength.text}</span>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-600">
                                        Password must be at least 10 characters long
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 text-white rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-70"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                    
                    {loading && (
                        <div className="flex justify-center mt-4">
                            <Loader color="#3B82F6" loading={loading} size={8} />
                        </div>
                    )}
                    
                    <div className="text-center mt-4 text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 font-medium hover:underline">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignupPage;