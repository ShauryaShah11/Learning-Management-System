import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CourseDetails from "./CourseDetails";
import QuestionPage from "./QuestionPage";
import ReviewPage from "./ReviewPage";
import CourseContent from "./CourseContent";
import { useParams } from "react-router-dom";

function CourseInformation() {
    const { id } = useParams();


    return (
        <div className="container mx-auto my-5">
            <Tabs>
                {/* Tab List */}
                <TabList className="flex justify-center mb-8 space-x-4">
                    <Tab className="tab-style border-b px-2 cursor-pointer">Course Details</Tab>
                    <Tab className="tab-style border-b px-2 cursor-pointer">Questions</Tab>
                    <Tab className="tab-style border-b px-2 cursor-pointer">Reviews</Tab>
                    <Tab className="tab-style border-b px-2 cursor-pointer">Content</Tab>
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
