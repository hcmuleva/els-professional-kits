const axios = require("axios");

// 🔐 Your Strapi Admin API token
const STRAPI_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ3MTE4Mjc5LCJleHAiOjE3NDk3MTAyNzl9.LY5iIWi_k-L5GEX7pd0kfFmML17RXfzXdaQEsV7EdUA";

// 🔗 Strapi endpoints
const BASE_URL = "http://127.0.0.1:1337/api";
const CATEGORY_ENDPOINT = `${BASE_URL}/categories`;
const CATEGORYROLE_ENDPOINT = `${BASE_URL}/categoryroles`;

// 🗂️ Subcategory definitions per category name
const CATEGORYROLE_MAP = {
  // "Dharm": [
  //   { "name": "Pujari", "name_hi": "पुजारी" },
  //   { "name": "KathaVachak", "name_hi": "कथावाचक" },
  //   { "name": "Sevadar", "name_hi": "सेवक" },
  //   { "name": "Bhakt", "name_hi": "भक्त" },
  //   { "name": "Coordinator", "name_hi": "समन्वयक" }
  // ],
  // "Siksha": [
  //   { "name": "Project", "name_hi": "परियोजना" },
  //   { "name": "Tuition", "name_hi": "शिक्षा" },
  //   { "name": "SpecialClass", "name_hi": "विशेष कक्षा" },
  //   { "name": "Training", "name_hi": "प्रशिक्षण" },
  //   { "name": "Mentor", "name_hi": "मार्गदर्शक" },
  //   { "name": "Teacher", "name_hi": "शिक्षक" }
  // ],
  // "Gyan": [
  //   { "name": "Writer", "name_hi": "लेखक" },
  //   { "name": "Reader", "name_hi": "पाठक" },
  //   { "name": "Speaker", "name_hi": "वक्ता" },
  //   { "name": "Debater", "name_hi": "वादक" },
  //   { "name": "Researcher", "name_hi": "अनुसंधानकर्ता" }
  // ],
  // "Soch": [
  //   { "name": "Thinker", "name_hi": "चिंतक" },
  //   { "name": "Reformer", "name_hi": "सुधारक" },
  //   { "name": "Innovator", "name_hi": "नवप्रवर्तक" },
  //   { "name": "Motivator", "name_hi": "प्रेरक" },
  //   { "name": "Philosopher", "name_hi": "दार्शनिक" }
  // ],
  // "Competition": [
  //   { "name": "Organizer", "name_hi": "आयोजक" },
  //   { "name": "Participant", "name_hi": "प्रतिभागी" },
  //   { "name": "Judge", "name_hi": "न्यायाधीश" },
  //   { "name": "Volunteer", "name_hi": "स्वयंसेवक" },
  //   { "name": "Coach", "name_hi": "कोच" }
  // ],
  // "Team": [
  //   { "name": "Leader", "name_hi": "नेता" },
  //   { "name": "Member", "name_hi": "सदस्य" },
  //   { "name": "Captain", "name_hi": "कप्तान" },
  //   { "name": "Vice-Captain", "name_hi": "उप-कप्तान" },
  //   { "name": "Supporter", "name_hi": "समर्थक" }
  // ],
  // "Business": [
  //   { "name": "Owner", "name_hi": "स्वामी" },
  //   { "name": "Manager", "name_hi": "प्रबंधक" },
  //   { "name": "Employee", "name_hi": "कर्मचारी" },
  //   { "name": "Investor", "name_hi": "निवेशक" },
  //   { "name": "Partner", "name_hi": "साझेदार" }
  // ],
  // "Jobs": [
  //   { "name": "Seeker", "name_hi": "नौकरी चाहने वाला" },
  //   { "name": "Recruiter", "name_hi": "नियुक्तिकर्ता" },
  //   { "name": "HR", "name_hi": "मानव संसाधन" },
  //   { "name": "Employer", "name_hi": "नियोक्ता" },
  //   { "name": "Intern", "name_hi": "इंटर्न" }
  // ],
  // "Farmer": [
  //   { "name": "Farmer", "name_hi": "किसान" },
  //   { "name": "Seller", "name_hi": "विक्रेता" },
  //   { "name": "Transporter", "name_hi": "परिवहनकर्ता" },
  //   { "name": "Advisor", "name_hi": "सलाहकार" },
  //   { "name": "Supplier", "name_hi": "आपूर्तिकर्ता" }
  // ],
  // "Doctor": [
  //   { "name": "Doctor", "name_hi": "डॉक्टर" },
  //   { "name": "Nurse", "name_hi": "नर्स" },
  //   { "name": "Assistant", "name_hi": "सहायक" },
  //   { "name": "Pharmacist", "name_hi": "फार्मासिस्ट" },
  //   { "name": "Volunteer", "name_hi": "स्वयंसेवक" }
  // ],
  // "Engineer": [
  //   { "name": "Software", "name_hi": "सॉफ्टवेयर" },
  //   { "name": "Mechanical", "name_hi": "यांत्रिक" },
  //   { "name": "Civil", "name_hi": "सिविल" },
  //   { "name": "Electrical", "name_hi": "इलेक्ट्रिकल" },
  //   { "name": "Architect", "name_hi": "वास्तुकार" }
  // ],
  // "Sanskar": [
  //   { "name": "Speaker", "name_hi": "वक्ता" },
  //   { "name": "Performer", "name_hi": "कलाकार" },
  //   { "name": "Volunteer", "name_hi": "स्वयंसेवक" },
  //   { "name": "Artist", "name_hi": "शिल्पकार" },
  //   { "name": "Learner", "name_hi": "सीखने वाला" }
  // ],
  // "Sports": [
  //   { "name": "Player", "name_hi": "खिलाड़ी" },
  //   { "name": "Coach", "name_hi": "कोच" },
  //   { "name": "Sponsor", "name_hi": "प्रायोजक" },
  //   { "name": "Mentor", "name_hi": "मार्गदर्शक" },
  //   { "name": "Captain", "name_hi": "कप्तान" },
  //   { "name": "Vice-Captain", "name_hi": "उप-कप्तान" }
  // ]
  "Temple":[
    { name: "president", name_hi: "अध्यक्ष" },
    { name: "vicepresident", name_hi: "उपाध्यक्ष" },
    { name: "treasurer", name_hi: "कोषाध्यक्ष" },
    { name: "secretery", name_hi: "सचिव" },
    {name:"joint-secretery", name_hi:"सह-सचिव"},
    { name: "trustee", name_hi: "ट्रस्टी" },
    { name: "gardian", name_hi: "संरक्षक" },
    {name:"founder", name_hi:"संस्थापक"},
    {name:"co-founder", name_hi:"सह-संस्थापक"},
    { name: "member", name_hi: "सदस्य" },
  ]
}


const headers = {
  Authorization: `Bearer ${STRAPI_TOKEN}`,
  "Content-Type": "application/json"
};

async function populateSubcategories() {
  try {
    // 1. Fetch all categories
    const res = await axios.get(CATEGORY_ENDPOINT, { headers });
    const categories = res.data?.data || [];

    for (const cat of categories) {
      const catName = cat.attributes.name;
      const catId = cat.id;

      const catroles = CATEGORYROLE_MAP[catName];
      if (!catroles) {
        console.warn(`⚠️ No subcategories defined for category: ${catName}`);
        continue;
      }

      for (const catrole of catroles) {
        const payload = {
          data: {
            ...catrole,
            category: catId
          }
        };

        try {
          const response = await axios.post(CATEGORYROLE_ENDPOINT, payload, { headers });
          console.log(`✅ Created roles '${catrole.name}' under '${catName}'`);
        } catch (err) {
          console.error(`❌ Failed to create role '${catrole.name}' under '${catName}':`, err.response?.data || err.message);
        }
      }
    }
  } catch (err) {
    console.error("❌ Failed to fetch categories:", err.response?.data || err.message);
  }
}

populateSubcategories();
