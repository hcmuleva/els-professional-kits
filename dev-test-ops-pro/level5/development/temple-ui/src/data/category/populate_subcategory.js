const axios = require("axios");

// 🔐 Your Strapi Admin API token
const STRAPI_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ3MTE4Mjc5LCJleHAiOjE3NDk3MTAyNzl9.LY5iIWi_k-L5GEX7pd0kfFmML17RXfzXdaQEsV7EdUA";

// 🔗 Strapi endpoints
const BASE_URL = "http://127.0.0.1:1337/api";

const CATEGORY_ENDPOINT = `${BASE_URL}/categories`;
const SUBCATEGORY_ENDPOINT = `${BASE_URL}/subcategories`;

// 🗂️ Subcategory definitions per category name
const SUBCATEGORY_MAP = {
  // Dharm: [
  //   { name: "Prayer", name_hi: "प्रार्थना", icon: "🙏" },
  //   { name: "Meditation", name_hi: "ध्यान", icon: "🧘" },
  //   { name: "Pilgrimage", name_hi: "तीर्थ यात्रा", icon: "🛕" },
  //   { name: "Festival", name_hi: "त्योहार", icon: "🎉" },
  //   { name: "Scriptures", name_hi: "धार्मिक ग्रंथ", icon: "📖" }
  // ],
  // Siksha: [
  //   { name: "School", name_hi: "विद्यालय", icon: "🏫" },
  //   { name: "Teacher", name_hi: "शिक्षक", icon: "👩‍🏫" },
  //   { name: "Student", name_hi: "छात्र", icon: "🧑‍🎓" },
  //   { name: "Exam", name_hi: "परीक्षा", icon: "📝" },
  //   { name: "Scholarship", name_hi: "छात्रवृत्ति", icon: "🎓" }
  // ],
  //  Gyan:[
  //   { "name": "Science", "name_hi": "विज्ञान", "icon": "🔬" },
  //     { "name": "Technology", "name_hi": "प्रौद्योगिकी", "icon": "💻" },
  //     { "name": "Philosophy", "name_hi": "दर्शन", "icon": "📚" },
  //     { "name": "Innovation", "name_hi": "नवाचार", "icon": "💡" },
  //     { "name": "Facts", "name_hi": "तथ्य", "icon": "📊" }
  //  ],
  //  Soch:[
  //   { "name": "Positive Thinking", "name_hi": "सकारात्मक सोच", "icon": "🌟" },
  //   { "name": "Mindfulness", "name_hi": "सजगता", "icon": "🧠" },
  //   { "name": "Motivation", "name_hi": "प्रेरणा", "icon": "🔥" },
  //   { "name": "Leadership", "name_hi": "नेतृत्व", "icon": "🧑‍💼" },
  //   { "name": "Self Awareness", "name_hi": "आत्मज्ञान", "icon": "🪞" }
  //  ],
  //  Competition:[
  //   { "name": "Quiz", "name_hi": "प्रश्नोत्तरी", "icon": "❓" },
  //   { "name": "Debate", "name_hi": "वाद-विवाद", "icon": "🎤" },
  //   { "name": "Olympiad", "name_hi": "ओलंपियाड", "icon": "🏅" },
  //   { "name": "Hackathon", "name_hi": "हैकाथॉन", "icon": "💻" },
  //   { "name": "Coding", "name_hi": "कोडिंग", "icon": "👨‍💻" }
  //  ],
  //  Team:[
  //   { "name": "Collaboration", "name_hi": "सहयोग", "icon": "🤝" },
  //     { "name": "Group Projects", "name_hi": "समूह परियोजना", "icon": "📂" },
  //     { "name": "Leadership", "name_hi": "नेतृत्व", "icon": "🎯" },
  //     { "name": "Volunteering", "name_hi": "स्वयंसेवा", "icon": "🫱" },
  //     { "name": "Networking", "name_hi": "संपर्क", "icon": "🌐" }
  //  ],
  //  Business:[
  //   { "name": "Startup", "name_hi": "स्टार्टअप", "icon": "🚀" },
  //   { "name": "Marketing", "name_hi": "विपणन", "icon": "📣" },
  //   { "name": "Finance", "name_hi": "वित्त", "icon": "💰" },
  //   { "name": "E-commerce", "name_hi": "ई-कॉमर्स", "icon": "🛒" },
  //   { "name": "Strategy", "name_hi": "रणनीति", "icon": "📈" }
  //  ],
  //  Jobs:[
  //   { "name": "Govt Jobs", "name_hi": "सरकारी नौकरी", "icon": "🏛️" },
  //   { "name": "Private Jobs", "name_hi": "निजी नौकरी", "icon": "🏢" },
  //   { "name": "Internships", "name_hi": "इंटर्नशिप", "icon": "🧳" },
  //   { "name": "Freelancing", "name_hi": "फ्रीलांसिंग", "icon": "💼" },
  //   { "name": "Remote Jobs", "name_hi": "दूरस्थ कार्य", "icon": "🏠" }
  //  ],
  // "Farmer": [
  //   { "name": "Crop Farming", "name_hi": "फसल खेती", "icon": "🌾" },
  //   { "name": "Dairy Farming", "name_hi": "डेयरी खेती", "icon": "🐄" },
  //   { "name": "Organic Farming", "name_hi": "जैविक खेती", "icon": "🥬" },
  //   { "name": "Irrigation", "name_hi": "सिंचाई", "icon": "🚿" },
  //   { "name": "Agri Tools", "name_hi": "कृषि उपकरण", "icon": "🛠️" }
  // ],
  // "Doctor": [
  //   { "name": "General Physician", "name_hi": "सामान्य चिकित्सक", "icon": "🩺" },
  //   { "name": "Surgeon", "name_hi": "सर्जन", "icon": "🔪" },
  //   { "name": "Pediatrician", "name_hi": "बाल रोग विशेषज्ञ", "icon": "👶" },
  //   { "name": "Gynecologist", "name_hi": "स्त्री रोग विशेषज्ञ", "icon": "👩‍⚕️" },
  //   { "name": "Dentist", "name_hi": "दंत चिकित्सक", "icon": "🦷" }
  // ],
  // "Engineer": [
  //   { "name": "Software", "name_hi": "सॉफ्टवेयर", "icon": "💻" },
  //   { "name": "Civil", "name_hi": "सिविल", "icon": "🏗️" },
  //   { "name": "Mechanical", "name_hi": "मैकेनिकल", "icon": "⚙️" },
  //   { "name": "Electrical", "name_hi": "इलेक्ट्रिकल", "icon": "🔌" },
  //   { "name": "Electronics", "name_hi": "इलेक्ट्रॉनिक्स", "icon": "📡" }
  // ],
  // "House Job": [
  //   { "name": "Cleaning", "name_hi": "सफाई", "icon": "🧹" },
  //   { "name": "Cooking", "name_hi": "खाना बनाना", "icon": "🍳" },
  //   { "name": "Childcare", "name_hi": "बच्चों की देखभाल", "icon": "🧒" },
  //   { "name": "Laundry", "name_hi": "कपड़े धोना", "icon": "🧺" },
  //   { "name": "Grocery Shopping", "name_hi": "किराना खरीदारी", "icon": "🛒" }
  // ]
  // "Sanskar":[
  //   { "name": "Respect for Elders", "name_hi": "बड़ों का सम्मान", "icon": "🙇‍♂️" },
  //   { "name": "Helping Others", "name_hi": "दूसरों की मदद", "icon": "🤝" },
  //   { "name": "Cleanliness", "name_hi": "स्वच्छता", "icon": "🧼" },
  //   { "name": "Honesty", "name_hi": "ईमानदारी", "icon": "🫶" },
  //   { "name": "Discipline", "name_hi": "अनुशासन", "icon": "🎯" }
  // ]
  "Temple":[

    { name: "commitee", name_hi: "समिति", icon: "👥" },
    { name: "danace", name_hi: "दानपत्र", icon: "📜" },
    { name: "ladies", name_hi: "महिला", icon: "👩‍🦱" },
    { name: "sanskar", name_hi: "संस्कार", icon: "🧘" },
    { name: "pooja", name_hi: "पूजा", icon: "🪔" },
  ]
  // ➕ Add more categories here...
};

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

      const subcats = SUBCATEGORY_MAP[catName];
      if (!subcats) {
        console.warn(`⚠️ No subcategories defined for category: ${catName}`);
        continue;
      }

      for (const sub of subcats) {
        const payload = {
          data: {
            ...sub,
            category: catId
          }
        };

        try {
          const response = await axios.post(SUBCATEGORY_ENDPOINT, payload, { headers });
          console.log(`✅ Created subcategory '${sub.name}' under '${catName}'`);
        } catch (err) {
          console.error(`❌ Failed to create subcategory '${sub.name}' under '${catName}':`, err.response?.data || err.message);
        }
      }
    }
  } catch (err) {
    console.error("❌ Failed to fetch categories:", err.response?.data || err.message);
  }
}

populateSubcategories();
