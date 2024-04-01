import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CourseDetails from "./CourseDetails";
import QuestionPage from "./QuestionPage";
import ReviewPage from "./ReviewPage";
import CourseContent from "./CourseContent";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMyCourses } from "../services/secureApiService";
import useToken from "../hooks/useToken";

function CourseInformation() {
    const { id } = useParams();
    const [isPurchased, setIsPurchased] = useState(false);
    const [token] = useToken();
    useEffect(() => {
        const fetchUserCourses = async () => {
            try {
                const response = await fetchMyCourses(token);
                const purchasedCourses = response.map((enrollment) => enrollment.course._id);
                setIsPurchased(purchasedCourses.includes(id));
            } catch (error) {
                console.error("Error fetching user courses:", error);
            }
        };

        fetchUserCourses();
    }, [id]);
    return (
        <div className="container mx-auto my-5">
            <Tabs>
                <TabList className="flex justify-center mb-8">
                    <Tab className="cursor-pointer text-lg font-semibold text-gray-800 hover:text-blue-700 transition duration-300 px-6 py-3 rounded-md bg-white shadow-md">
                        Course Details
                    </Tab>
                    <Tab className="cursor-pointer text-lg font-semibold text-gray-800 hover:text-blue-700 transition duration-300 px-6 py-3 rounded-md bg-white shadow-md">
                        Questions
                    </Tab>
                    <Tab className="cursor-pointer text-lg font-semibold text-gray-800 hover:text-blue-700 transition duration-300 px-6 py-3 rounded-md bg-white shadow-md">
                        Reviews
                    </Tab>
                    <Tab className="cursor-pointer text-lg font-semibold text-gray-800 hover:text-blue-700 transition duration-300 px-6 py-3 rounded-md bg-white shadow-md">
                        Content
                    </Tab>
                </TabList>

                <TabPanel>
                    <div>
                        <CourseDetails isPurchased={isPurchased}/>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div>
                        <QuestionPage />
                    </div>
                </TabPanel>
                <TabPanel>
                    <div>
                        <ReviewPage />
                    </div>
                </TabPanel>
                <TabPanel>
                <div>
                    {isPurchased ? <CourseContent /> : <div className="text-2xl">Please purchase the course to access its content.</div>}
                </div>
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default CourseInformation;
