import { useEffect, useState } from "react";
import Card from "../Card";
import { fetchAllCourses } from "../../services/secureApiService";
import useToken from "../../hooks/useToken";
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
} from "recharts";
import Loader from "../Loader";

const AdminDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revenue, setRevenue] = useState(0);
    const [totalStudentsEnrolled, setTotalStudentsEnrolled] = useState(0);
    const [token] = useToken();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchAllCourses(token);
                setCourses(response);
            } catch (error) {
                console.error("Error fetching tutor data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    useEffect(() => {
        let totalStudents = 0;
        let totalRevenue = 0;
    
        courses.forEach((course) => {
            const uniqueStudents = new Set(course.studentsEnrolled);
            const uniqueStudentsCount = uniqueStudents.size;
            totalStudents += uniqueStudentsCount;
            const courseRevenue = uniqueStudentsCount * course.price;
            totalRevenue += courseRevenue;
        });
        
        setRevenue(totalRevenue);
        setTotalStudentsEnrolled(totalStudents);
    }, [courses]);
    

    if (loading) {
        return <Loader />;
    }

    const data = courses.map((course) => ({
        name: course.courseName,
        studentsEnrolled: new Set(course.studentsEnrolled).size,
    }));

    return (
        <div className="p-8">
            <div className="grid grid-cols-3 gap-4 mb-8">
                <Card title="Total Courses" description={courses.length} color="bg-blue-500" />
                <Card title="Students Enrolled" description={totalStudentsEnrolled} color="bg-green-500" />
                <Card title="Total Revenue" description={`₹${revenue}`} color="bg-yellow-500" />
            </div>
            <div className="grid grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold mb-4">Students Enrolled per Course</h2>
                    <BarChart width={600} height={300} data={data}>
                        <CartesianGrid strokeDasharray="" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="studentsEnrolled" fill="#3182CE" />
                    </BarChart>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold mb-4">Students Enrolled Distribution</h2>
                    <PieChart width={600} height={300}>
                        <Pie
                            data={data}
                            dataKey="studentsEnrolled"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#34D399"
                            label
                        />
                        <Tooltip className=""/>
                        <Legend />
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
