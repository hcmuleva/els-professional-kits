const axios = require("axios");
const STRAPI_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ3MTE4Mjc5LCJleHAiOjE3NDk3MTAyNzl9.LY5iIWi_k-L5GEX7pd0kfFmML17RXfzXdaQEsV7EdUA";
const BASE_URL = "http://127.0.0.1:1337/api";
const COURSE_ENDPOINT = `${BASE_URL}/courses`;
const CONTENT_ENDPOINT = `${BASE_URL}/contents`;

const COURSE_DATA = [
  {
    title: "Impossible",
    subtitle: "Courses about achieving the impossible",
    coverurl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "GK",
    subtitle: "General Knowledge courses",
    coverurl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Motivation",
    subtitle: "Courses to keep you motivated",
    coverurl: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Projects",
    subtitle: "Hands-on project courses",
    coverurl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Thought",
    subtitle: "Courses to expand your thinking",
    coverurl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Daily",
    subtitle: "Daily learning courses",
    coverurl: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  }
];

const CONTENT_MAP = {
  "Impossible": [
    {
      "title": "Achieving the Impossible",
      "subtitle": "Breaking through mental barriers",
      "author": "user_001",
      "coverurl": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Beyond Human Limits",
      "subtitle": "Extraordinary feats explained",
      "author": "user_002",
      "coverurl": "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "The Science of Impossible",
      "subtitle": "Physics-defying accomplishments",
      "author": "user_003",
      "coverurl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Mind Over Matter",
      "subtitle": "Training your brain for the impossible",
      "author": "user_004",
      "coverurl": "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Record Breakers",
      "subtitle": "Stories of world records",
      "author": "user_005",
      "coverurl": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ],
  "GK": [
    {
      "title": "World History Essentials",
      "subtitle": "Key events that shaped our world",
      "author": "user_006",
      "coverurl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Science Fundamentals",
      "subtitle": "Basic principles everyone should know",
      "author": "user_007",
      "coverurl": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Geography Masterclass",
      "subtitle": "Countries, capitals and cultures",
      "author": "user_008",
      "coverurl": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Current Affairs 2023",
      "subtitle": "Important events of the year",
      "author": "user_009",
      "coverurl": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Art & Culture",
      "subtitle": "Understanding world heritage",
      "author": "user_010",
      "coverurl": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ],
  "Motivation": [
    {
      "title": "Daily Inspiration",
      "subtitle": "Start your day with motivation",
      "author": "user_011",
      "coverurl": "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Success Mindset",
      "subtitle": "Thinking like high achievers",
      "author": "user_012",
      "coverurl": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Overcoming Adversity",
      "subtitle": "Turning challenges into opportunities",
      "author": "user_013",
      "coverurl": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Goal Setting Mastery",
      "subtitle": "Achieving what you set out to do",
      "author": "user_014",
      "coverurl": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Habit Formation",
      "subtitle": "Building lasting positive changes",
      "author": "user_015",
      "coverurl": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ],
  "Projects": [
    {
      "title": "DIY Home Projects",
      "subtitle": "Improve your living space",
      "author": "user_016",
      "coverurl": "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Coding Projects",
      "subtitle": "Hands-on programming exercises",
      "author": "user_017",
      "coverurl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Gardening Projects",
      "subtitle": "Create your green space",
      "author": "user_018",
      "coverurl": "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Art Projects",
      "subtitle": "Creative expressions",
      "author": "user_019",
      "coverurl": "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Business Projects",
      "subtitle": "Entrepreneurial ventures",
      "author": "user_020",
      "coverurl": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ],
  "Thought": [
    {
      "title": "Philosophical Thinking",
      "subtitle": "Great ideas through history",
      "author": "user_021",
      "coverurl": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Critical Thinking",
      "subtitle": "Analyzing information effectively",
      "author": "user_022",
      "coverurl": "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Creative Thinking",
      "subtitle": "Unlocking your imagination",
      "author": "user_023",
      "coverurl": "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Lateral Thinking",
      "subtitle": "Solving problems creatively",
      "author": "user_024",
      "coverurl": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Mindfulness",
      "subtitle": "Present moment awareness",
      "author": "user_025",
      "coverurl": "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ],
  "Daily": [
    {
      "title": "Morning Routine",
      "subtitle": "Start your day right",
      "author": "user_026",
      "coverurl": "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Daily Journaling",
      "subtitle": "Reflect and grow every day",
      "author": "user_027",
      "coverurl": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "5-Minute Exercises",
      "subtitle": "Quick daily workouts",
      "author": "user_028",
      "coverurl": "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Daily Learning",
      "subtitle": "Learn something new each day",
      "author": "user_029",
      "coverurl": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      "title": "Evening Wind Down",
      "subtitle": "Prepare for restful sleep",
      "author": "user_030",
      "coverurl": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ]
};

const headers = {
  Authorization: `Bearer ${STRAPI_TOKEN}`,
  "Content-Type": "application/json"
};

async function uploadImage(url) {
  try {
    const response = await axios.post(`${BASE_URL}/upload`, {
      url
    }, {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data[0].id;
  } catch (error) {
    console.error("Error uploading image:", error.response?.data || error.message);
    return null;
  }
}

async function createCourse(courseData) {
  try {
    // First upload the cover image
    //const coverId = await uploadImage(courseData.coverurl);
    
    // if (!coverId) {
    //   throw new Error("Failed to upload cover image");
    // }

    const payload = {
      data: {
        title: courseData.title,
        subtitle: courseData.subtitle,
        coverurl: courseData.coverurl
      }
    };

    const response = await axios.post(COURSE_ENDPOINT, payload, { headers });
    console.log(`✅ Created course: ${courseData.title}`);
    return response.data.data.id;
  } catch (error) {
    console.error(`❌ Failed to create course ${courseData.title}:`, error.response?.data || error.message);
    return null;
  }
}

async function createContent(contentData, courseId) {
  try {
    // Upload content cover image
    // const coverId = await uploadImage(contentData.coverurl);
    
    // if (!coverId) {
    //   throw new Error("Failed to upload content cover image");
    // }

    const { author, ...remaining } = contentData;
    const payload = {
      data: {
        ...remaining,
        course: courseId,
        coverurl: contentData.coverurl,
        //author: author // Make sure your content type has relation to users
      }
    };

    await axios.post(CONTENT_ENDPOINT, payload, { headers });
    console.log(`✅ Created content: ${contentData.title}`);
  } catch (error) {
    console.error(`❌ Failed to create content ${contentData.title}:`, error.response?.data || error.message);
  }
}

async function populateData() {
  try {
    // First create all courses
    const courseIds = {};
    
    for (const courseData of COURSE_DATA) {
      const courseId = await createCourse(courseData);
      if (courseId) {
        courseIds[courseData.title] = courseId;
      }
    }

    // Then create content for each course
    for (const [courseName, contents] of Object.entries(CONTENT_MAP)) {
      const courseId = courseIds[courseName];
      if (!courseId) {
        console.warn(`⚠️ No course ID found for ${courseName}`);
        continue;
      }

      console.log(`\nCreating content for course: ${courseName}`);
      for (const content of contents) {
        await createContent(content, courseId);
      }
    }

    console.log("\n🎉 All data populated successfully!");
  } catch (error) {
    console.error("❌ Error in populateData:", error);
  }
}

populateData();