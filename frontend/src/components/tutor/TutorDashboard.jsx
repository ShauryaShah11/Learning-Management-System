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
} from "recharts"; // Import Bar component from react-chartjs-2
import { fetchCourseByTutorId } from "../../services/apiService"; // Import your API service function
import Card from "../Card";
import { jwtDecode } from "jwt-decode";
import useToken from "../../hooks/useToken";

const TutorDashboard = () => {
    const [tutorCourses, setTutorCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [token] = useToken();
    const [totalStudentsEnrolled, setTotalStudentsEnrolled] = useState(0);
    const [revenue, setRevenue] = useState(0);

    useEffect(() => {
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
        let revenue = 0;
    
        tutorCourses.forEach((course) => {
            const uniqueStudents = new Set(course.studentsEnrolled);
            const uniqueStudentsCount = uniqueStudents.size;
            totalStudents += uniqueStudentsCount;
            revenue += totalStudents * course.price
        });
        setRevenue(revenue);
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
            <h1 className="text-3xl font-bold mb-8">Tutor Dashboard</h1>
            <div className="grid grid-cols-3 gap-4 mb-8">
                <Card title="Total Courses" description={tutorCourses.length} />
                <Card title="Students Enrolled" description={totalStudentsEnrolled} />
                <Card title="Total Revenue" description={`₹${revenue}`} />
            </div>
            <div className="grid grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold mb-4">Students Enrolled per Course</h2>
                    <BarChart width={600} height={300} data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold mb-4">Students Enrolled Distribution</h2>
                    <PieChart width={600} height={300}>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                        />
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

export default TutorDashboard;
