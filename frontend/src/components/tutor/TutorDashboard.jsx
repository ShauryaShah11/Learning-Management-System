import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    ResponsiveContainer, // Import ResponsiveContainer
} from "recharts";
import { fetchCourseByTutorId } from "../../services/apiService";
import Card from "../Card";
import { jwtDecode } from "jwt-decode";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../../store/atoms/token";

const TutorDashboard = () => {
    const [tutorCourses, setTutorCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [token, setToken] = useRecoilState(tokenAtom);
    const [totalStudentsEnrolled, setTotalStudentsEnrolled] = useState(0);
    const [revenue, setRevenue] = useState(0);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            navigate("/login");
            return;
        }
        // Set the token
        setToken(storedToken);
        const fetchTutorData = async () => {
            try {
                const decodedToken = jwtDecode(token);
                const response = await fetchCourseByTutorId(decodedToken.id);
                setTutorCourses(response);
            } catch (error) {
                console.error("Error fetching tutor data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTutorData();
    }, [token]);

    useEffect(() => {
        let totalStudents = 0;
        let totalRevenue = 0;

        tutorCourses.forEach((course) => {
            const uniqueStudents = new Set(course.studentsEnrolled);
            const uniqueStudentsCount = uniqueStudents.size;
            totalStudents += uniqueStudentsCount;
            const courseRevenue = uniqueStudentsCount * course.price;
            totalRevenue += courseRevenue;
        });

        setRevenue(totalRevenue);
        setTotalStudentsEnrolled(totalStudents);
    }, [tutorCourses]);

    if (loading) {
        return <Loader />;
    }
    const data = [];

    tutorCourses.forEach((course) => {
        const uniqueStudents = new Set(course.studentsEnrolled);
        const uniqueStudentsCount = uniqueStudents.size;
        data.push({ name: course.courseName, value: uniqueStudentsCount });
    });

    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card title="Total Courses" description={tutorCourses.length} />
                <Card
                    title="Students Enrolled"
                    description={totalStudentsEnrolled}
                />
                <Card title="Total Revenue" description={`₹${revenue}`} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-lg md:text-xl font-semibold mb-4">
                        Students Enrolled per Course
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-lg md:text-xl font-semibold mb-4">
                        Students Enrolled Distribution
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius="60%"
                                fill="#8884d8"
                                label
                            />
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default TutorDashboard;
