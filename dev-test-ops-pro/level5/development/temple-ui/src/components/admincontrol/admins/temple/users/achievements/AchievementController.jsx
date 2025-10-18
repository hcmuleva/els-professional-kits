import React from "react";
import { StudentsCertificate } from "./StudentsCertificate";
import { Divider } from "antd";
import ShishuPramanPatra from "./ShishuPramanPatra";

export default function AchievementController() {
  return (
    <div>
      <h1>HardCoded values</h1>
      <Divider />
      <StudentsCertificate
        type="sports" // or 'academic' or 'innovation'
        studentName="Rahul Septa"
        achievement="Winning the Inter-School Basketball Championship"
        date="March 15, 2025"
        schoolName="Kothnuru Bader"
        signature="Shree. Nemaramji president of Kothnuru Bader School"
        customMessage="Exceptional sportsmanship and leadership skills"
      />
      <Divider />
      <ShishuPramanPatra
        babyName="आदित्य गेहलोत"
        birthDate="15 मई 2025"
        birthTime="सुबह 10:30"
        birthWeight="3.5 किलोग्राम"
        parentsName="राहुल गेहलोत एवं प्रिया गेहलोत"
        hospitalName="देसूरी, पाली,  राजस्थान     "
        doctorName="डॉ. सुमन गुप्ता"
      />
    </div>
  );
}
