import React, { useState, useEffect } from "react";
import { Spin, Alert } from "antd";
import FamilySurveyForm from "./family-survey-form";
import { getSingleFamily } from "../../services/families"; // Updated import
import { useParams } from "react-router-dom";

export default function FamilyViewCard() {
  const [familyData, setFamilyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { familyid: familyId } = useParams();

  console.log("FamilyViewCard familyId:", familyId);

  const loadFamily = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!familyId) {
        setError("कोई परिवार आईडी स्टोरेज में नहीं मिली");
        return;
      }

      const data = await getSingleFamily(familyId); // Use updated API call
      console.log("Total Members Fetched:", data.members.length);
      console.log("Family Data:", data);
      setFamilyData(data);
    } catch (err) {
      setError(err.message || "परिवार डेटा लोड करने में विफल");
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamily();
  }, [familyId]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="त्रुटि" description={error} type="error" showIcon />;
  }

  if (!familyData) {
    return null;
  }
  console.log("familyData relationToHead", familyData.relationToHead);
  // Prepare data for FamilySurveyForm (most data is already formatted by API)

  const currentAddress =
    familyData.mukhiya?.addresses?.find((addr) => addr.type === "CURRENT") ||
    {};
  const homeAddress =
    familyData.mukhiya?.addresses?.find((addr) => addr.type === "HOME") || {};

  const surveyData = {
    serialNo: familyData.serialNo || "उपलब्ध नहीं",
    date: familyData.date || "उपलब्ध नहीं",
    relationship: familyData.relationToHead || "उपलब्ध नहीं",
    headName: familyData.mukhiya?.name || "उपलब्ध नहीं",
    gotra: familyData.mukhiya?.gotra || "उपलब्ध नहीं",
    fatherName: familyData.mukhiya?.fatherName || "उपलब्ध नहीं",
    mobileNo: familyData.mukhiya?.mobileNo || "उपलब्ध नहीं",
    district: currentAddress.district || "उपलब्ध नहीं",
    state: currentAddress.state || "उपलब्ध नहीं",
    currentAddress,
    homeAddress,
    familyMembers: familyData.members || [],
    business1: familyData.business1 || "",
    jobDetails1: familyData.jobDetails1 || "",
    familyAddress: familyData.familyAddress || "उपलब्ध नहीं",
    nativePlace: familyData.nativePlace || "उपलब्ध नहीं",
    headSignature: familyData.headSignature || "उपलब्ध नहीं",
    templeName: familyData.templeName || "उपलब्ध नहीं",
    templeAddress: familyData.templeAddress || "उपलब्ध नहीं",
    profilePictureUrl:
      familyData.mukhiya?.profilePicture || "https://via.placeholder.com/80",
  };

  console.log("Survey Data:", surveyData);

  return (
    <div>
      <FamilySurveyForm data={surveyData} />
    </div>
  );
}
