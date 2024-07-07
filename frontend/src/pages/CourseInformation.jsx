import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CourseDetails from "./CourseDetails";
import QuestionPage from "./QuestionPage";
import ReviewPage from "./ReviewPage";
import CourseContent from "./CourseContent";

function CourseInformation() {
    return (
        <div className="container mx-auto my-10 p-5 bg-white shadow-lg rounded-lg">
            <Tabs>
                {/* Tab List */}
                <TabList className="flex justify-center mb-8 space-x-4 border-b-2 border-gray-200">
                    <Tab className="tab-style px-3 py-2 sm:px-4 sm:py-3 cursor-pointer text-base sm:text-lg font-semibold text-gray-600 hover:text-gray-800 focus:outline-none">
                        Course Details
                    </Tab>
                    <Tab className="tab-style px-3 py-2 sm:px-4 sm:py-3 cursor-pointer text-base sm:text-lg font-semibold text-gray-600 hover:text-gray-800 focus:outline-none">
                        Questions
                    </Tab>
                    <Tab className="tab-style px-3 py-2 sm:px-4 sm:py-3 cursor-pointer text-base sm:text-lg font-semibold text-gray-600 hover:text-gray-800 focus:outline-none">
                        Reviews
                    </Tab>
                    <Tab className="tab-style px-3 py-2 sm:px-4 sm:py-3 cursor-pointer text-base sm:text-lg font-semibold text-gray-600 hover:text-gray-800 focus:outline-none">
                        Content
                    </Tab>
                </TabList>

                {/* Tab Panels */}
                <TabPanel>
                    <CourseDetails />
                </TabPanel>
                <TabPanel>
                    <QuestionPage />
                </TabPanel>
                <TabPanel>
                    <ReviewPage />
                </TabPanel>
                <TabPanel>
                    <CourseContent />
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default CourseInformation;
