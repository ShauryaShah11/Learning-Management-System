import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CourseDetails from "./CourseDetails";
import QuestionPage from "./QuestionPage";
import ReviewPage from "./ReviewPage";

function CourseInformation() {
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
                </TabList>

                <TabPanel>
                    <div>
                        <CourseDetails />
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
            </Tabs>
        </div>
    );
}

export default CourseInformation;
