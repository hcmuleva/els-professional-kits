import { Button, Cascader, SearchBar, Selector, Space } from "antd-mobile";
import { useEffect, useRef, useState } from "react";
import DatePickerYear from "./DatePickerYear";
import { Select } from "antd";

export const locationOptions = [
  {
    value: "india",
    label: "India",
    children: [
      {
        value: "karnataka",
        label: "Karnataka",
        children: [
          {
            value: "bangalore",
            label: "Bangalore",
            children: [
              { value: "hennur", label: "Hennur" },
              { value: "whitefield", label: "Whitefield" },
              { value: "koramangala", label: "Koramangala" },
              { value: "indiranagar", label: "Indiranagar" },
              { value: "marathahalli", label: "Marathahalli" },
              { value: "jayanagar", label: "Jayanagar" },
              { value: "btm_layout", label: "BTM Layout" },
            ],
          },
        ],
      },
      {
        value: "madhya_pradesh",
        label: "Madhya Pradesh",
        children: [
          {
            value: "bhopal",
            label: "Bhopal",
            children: [
              { value: "new_market", label: "New Market" },
              { value: "mp_nagar", label: "MP Nagar" },
              { value: "arera_colony", label: "Arera Colony" },
            ],
          },
          {
            value: "indore",
            label: "Indore",
            children: [
              { value: "vijay_nagar", label: "Vijay Nagar" },
              { value: "rau", label: "Rau" },
            ],
          },
        ],
      },
    ],
  },
  {
    value: "usa",
    label: "USA",
    children: [
      {
        value: "california",
        label: "California",
        children: [
          { value: "san_francisco", label: "San Francisco" },
          { value: "los_angeles", label: "Los Angeles" },
        ],
      },
    ],
  },
];

export const semesterYearOptions = [
  {
    value: "semester",
    label: "Semester",
    children: Array.from({ length: 10 }, (_, i) => ({
      value: `semester_${i + 1}`,
      label: `Semester ${i + 1}`,
    })),
  },
  {
    value: "year",
    label: "Year",
    children: Array.from({ length: 6 }, (_, i) => ({
      value: `year_${i + 1}`,
      label: `Year ${i + 1}`,
    })),
  },
];

export const occupationOptions = [
  { label: "All", value: "ALL" },
  { label: "Student", value: "Student" },
  { label: "Alumni", value: "Alumni" },
  { label: "Faculty", value: "Faculty" },
];

export const educationOptions = [
  { label: "mtech", value: "mtech" },
  { label: "btech", value: "btech" },
  { label: "bachelors", value: "bachelors" },
  { label: "master", value: "master" },
  { label: "phd", value: "phd" },
  { label: "structural engineering", value: "structural engineering" },
  // …add any other known degrees/branches…
];

export const SearchFilterPanel = ({
  inputValue,
  setInputValue,
  users,
  selectedOccupation,
  setSelectedOccupation,
  setLocationFilter,
  setSemesterYearFilter,
  setStartDateFilter,
  setEndDateFilter,
  filterHeight,
  setFilterHeight,
  parentLocationFilter,
  parentSemesterYearFilter,
  parentStartDateFilter,
  parentEndDateFilter,
  degreeLevel,
  setDegreeLevel,
  education,
  setEducation,
}) => {
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [locationVisible, setLocationVisible] = useState(false);
  const [locationValue, setLocalLocationFilter] = useState(
    parentLocationFilter || []
  );
  const [semesterYearVisible, setSemesterYearVisible] = useState(false);
  const [semesterYearValue, setLocalSemesterYear] = useState(
    parentSemesterYearFilter || []
  );
  const [showLocationCascader, setShowLocationCascader] = useState(false);
  const [startDate, setLocalStartDate] = useState(parentStartDateFilter);
  const [endDate, setLocalEndDate] = useState(parentEndDateFilter);
  const filterRef = useRef(null);

  // Show all filters when "All" is selected
  const showAllFilters = selectedOccupation.includes("ALL");
  const hideFilters =
    selectedOccupation.includes("Faculty") &&
    selectedOccupation.length === 1 &&
    !showAllFilters;

  const showYearFilter =
    showAllFilters ||
    (!hideFilters &&
      (selectedOccupation.includes("Student") ||
        selectedOccupation.includes("Alumni")));

  const showLocationOption =
    showAllFilters || (!hideFilters && selectedOccupation.includes("Alumni"));

  // Helper function to get display text for cascader values
  const getCascaderDisplayText = (values, options, defaultText) => {
    if (!values || values.length === 0) return defaultText;

    let currentOptions = options;
    const labels = [];

    for (const value of values) {
      const option = currentOptions?.find((opt) => opt.value === value);
      if (option) {
        labels.push(option.label);
        currentOptions = option.children;
      }
    }

    return labels.length > 0 ? labels.join(" - ") : defaultText;
  };

  // Function to clear all filter values
  const clearAllFilters = () => {
    setInputValue("");
    setSelectedOccupation(["ALL"]);
    setLocalLocationFilter([]);
    setLocalSemesterYear([]);
    setLocalStartDate(undefined);
    setLocalEndDate(undefined);
    setShowLocationCascader(false);

    // Immediately update parent filters
    setLocationFilter([]);
    setSemesterYearFilter([]);
    setStartDateFilter(undefined);
    setEndDateFilter(undefined);
    setDegreeLevel("");
    setEducation("");
  };

  useEffect(() => {
    const updateFilterHeight = () => {
      if (filterRef.current) {
        const height = filterRef.current.getBoundingClientRect().height;
        setFilterHeight(height + 10);
      }
    };

    updateFilterHeight();
    window.addEventListener("resize", updateFilterHeight);
    const observer = new MutationObserver(updateFilterHeight);
    if (filterRef.current) {
      observer.observe(filterRef.current, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener("resize", updateFilterHeight);
      observer.disconnect();
    };
  }, [
    selectedOccupation,
    showLocationCascader,
    locationVisible,
    semesterYearVisible,
    filtersVisible,
    setFilterHeight,
  ]);

  useEffect(() => {
    if (
      JSON.stringify(locationValue) !== JSON.stringify(parentLocationFilter)
    ) {
      setLocationFilter(locationValue);
    }
  }, [locationValue, parentLocationFilter, setLocationFilter]);

  useEffect(() => {
    if (
      JSON.stringify(semesterYearValue) !==
      JSON.stringify(parentSemesterYearFilter)
    ) {
      setSemesterYearFilter(semesterYearValue);
    }
  }, [semesterYearValue, parentSemesterYearFilter, setSemesterYearFilter]);

  useEffect(() => {
    if (startDate !== parentStartDateFilter) {
      setStartDateFilter(startDate);
    }
  }, [startDate, parentStartDateFilter, setStartDateFilter]);

  useEffect(() => {
    if (endDate !== parentEndDateFilter) {
      setEndDateFilter(endDate);
    }
  }, [endDate, parentEndDateFilter, setEndDateFilter]);

  return (
    <div
      ref={filterRef}
      style={{
        padding: "12px",
        background: "#fff",
        margin: "100px 10px 10px 10px",
        borderRadius: "0 0 16px 16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      }}
    >
      <SearchBar
        placeholder="Search users, courses, locations..."
        value={inputValue}
        onChange={setInputValue}
        style={{ marginBottom: "12px" }}
      />

      {/* Control Buttons Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <Button
          onClick={() => setFiltersVisible(!filtersVisible)}
          style={{
            background: filtersVisible ? "#f56565" : "#1890ff",
            color: "#fff",
            flex: 1,
            fontSize: "12px",
            padding: "8px 12px",
          }}
        >
          {filtersVisible ? "Hide" : "Show"}
        </Button>

        <Button
          onClick={clearAllFilters}
          style={{
            background: "#ff7875",
            color: "#fff",
            border: "none",
            flex: 1,
            fontSize: "12px",
            padding: "8px 12px",
          }}
        >
          Clear All
        </Button>
      </div>

      {filtersVisible && (
        <>
          {/* Occupation Filter - Full Width */}
          <div style={{ marginBottom: "10px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "6px",
                display: "block",
              }}
            >
              Occupation:
            </span>
            <Selector
              options={occupationOptions}
              value={selectedOccupation}
              onChange={(values) => {
                setSelectedOccupation(values);

                // Reset filters when changing occupation (except for "All")
                if (!values.includes("ALL")) {
                  if (!values.includes("Alumni")) {
                    setLocalLocationFilter([]);
                    setShowLocationCascader(false);
                  }
                  if (values.includes("Faculty") && values.length === 1) {
                    setLocalSemesterYear([]);
                    setLocalLocationFilter([]);
                    setShowLocationCascader(false);
                    setLocalStartDate(undefined);
                    setLocalEndDate(undefined);
                  }
                }
              }}
              multiple={false}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            {/* Education Level Filter */}
            <div style={{ marginBottom: "10px" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px",
                  display: "block",
                }}
              >
                Education:
              </span>
              <Select
                style={{ width: "100%" }}
                options={educationOptions}
                value={education}
                onChange={setEducation}
                placeholder="Select education"
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px",
                  display: "block",
                }}
              >
                Degree Level:
              </span>
              <Select
                style={{ width: "100%" }}
                options={[
                  { label: "Bachelor’s", value: "bachelor" },
                  { label: "Master’s", value: "master" },
                  { label: "PhD", value: "phd" },
                ]}
                value={degreeLevel}
                onChange={setDegreeLevel}
                placeholder="Select degree level"
              />
            </div>
          </div>
          {/* Two Column Layout for Other Filters */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            {/* Start Date Filter */}
            {(showAllFilters || showYearFilter) && (
              <div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Start Year:
                </span>
                <DatePickerYear
                  value={startDate}
                  onChange={(value) => setLocalStartDate(value)}
                  placeholder="Start Year"
                />
              </div>
            )}

            {/* End Date Filter */}
            {(showAllFilters || showYearFilter) && (
              <div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  End Year:
                </span>
                <DatePickerYear
                  value={endDate}
                  onChange={(value) => setLocalEndDate(value)}
                  placeholder="End Year"
                />
              </div>
            )}

            {/* Semester/Year Filter */}
            {(showAllFilters || !hideFilters) && (
              <div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Semester/Year:
                </span>
                <Button
                  onClick={() => setSemesterYearVisible(true)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    fontSize: "12px",
                    padding: "8px 12px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getCascaderDisplayText(
                    semesterYearValue,
                    semesterYearOptions,
                    "Select"
                  )}
                </Button>
                <Cascader
                  options={semesterYearOptions}
                  visible={semesterYearVisible}
                  onClose={() => setSemesterYearVisible(false)}
                  value={semesterYearValue}
                  onConfirm={setLocalSemesterYear}
                  onSelect={(val, extend) => {
                    console.log("onSelect Semester/Year", val, extend.items);
                  }}
                />
              </div>
            )}

            {/* Location Filter */}
            {(showAllFilters || showLocationOption) && (
              <div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  Location:
                </span>
                <Button
                  onClick={() => setLocationVisible(true)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    fontSize: "12px",
                    padding: "8px 12px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getCascaderDisplayText(
                    locationValue,
                    locationOptions,
                    "Select"
                  )}
                </Button>
                <Cascader
                  options={locationOptions}
                  visible={locationVisible}
                  onClose={() => setLocationVisible(false)}
                  value={locationValue}
                  onConfirm={setLocalLocationFilter}
                  onSelect={(val, extend) => {
                    console.log("onSelect Location", val, extend.items);
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Results Count */}
      <div style={{ paddingTop: "8px", marginBottom: "4px" }}>
        <span style={{ fontSize: "12px", color: "#6b7280" }}>
          {users.length} users found
        </span>
      </div>
    </div>
  );
};

// import { Button, Cascader, SearchBar, Selector, Space } from "antd-mobile";
// import { useEffect, useRef, useState } from "react";
// import DatePickerYear from "./DatePickerYear";

// export const locationOptions = [
//   {
//     value: "india",
//     label: "India",
//     children: [
//       {
//         value: "karnataka",
//         label: "Karnataka",
//         children: [
//           {
//             value: "bangalore",
//             label: "Bangalore",
//             children: [
//               { value: "hennur", label: "Hennur" },
//               { value: "whitefield", label: "Whitefield" },
//               { value: "koramangala", label: "Koramangala" },
//               { value: "indiranagar", label: "Indiranagar" },
//               { value: "marathahalli", label: "Marathahalli" },
//               { value: "jayanagar", label: "Jayanagar" },
//               { value: "btm_layout", label: "BTM Layout" },
//             ],
//           },
//         ],
//       },
//       {
//         value: "madhya_pradesh",
//         label: "Madhya Pradesh",
//         children: [
//           {
//             value: "bhopal",
//             label: "Bhopal",
//             children: [
//               { value: "new_market", label: "New Market" },
//               { value: "mp_nagar", label: "MP Nagar" },
//               { value: "arera_colony", label: "Arera Colony" },
//             ],
//           },
//           {
//             value: "indore",
//             label: "Indore",
//             children: [
//               { value: "vijay_nagar", label: "Vijay Nagar" },
//               { value: "rau", label: "Rau" },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     value: "usa",
//     label: "USA",
//     children: [
//       {
//         value: "california",
//         label: "California",
//         children: [
//           { value: "san_francisco", label: "San Francisco" },
//           { value: "los_angeles", label: "Los Angeles" },
//         ],
//       },
//     ],
//   },
// ];

// export const semesterYearOptions = [
//   {
//     value: "semester",
//     label: "Semester",
//     children: Array.from({ length: 10 }, (_, i) => ({
//       value: `semester_${i + 1}`,
//       label: `Semester ${i + 1}`,
//     })),
//   },
//   {
//     value: "year",
//     label: "Year",
//     children: Array.from({ length: 6 }, (_, i) => ({
//       value: `year_${i + 1}`,
//       label: `Year ${i + 1}`,
//     })),
//   },
// ];

// export const occupationOptions = [
//   { label: "All", value: "ALL" },
//   { label: "Student", value: "Student" },
//   { label: "Alumni", value: "Alumni" },
//   { label: "Faculty", value: "Faculty" },
// ];

// export const SearchFilterPanel = ({
//   inputValue,
//   setInputValue,
//   users,
//   selectedOccupation,
//   setSelectedOccupation,
//   setLocationFilter,
//   setSemesterYearFilter,
//   setStartDateFilter,
//   setEndDateFilter,
//   filterHeight,
//   setFilterHeight,
//   parentLocationFilter,
//   parentSemesterYearFilter,
//   parentStartDateFilter,
//   parentEndDateFilter,
// }) => {
//   const [filtersVisible, setFiltersVisible] = useState(true);
//   const [locationVisible, setLocationVisible] = useState(false);
//   const [locationValue, setLocalLocationFilter] = useState(
//     parentLocationFilter || []
//   );
//   const [semesterYearVisible, setSemesterYearVisible] = useState(false);
//   const [semesterYearValue, setLocalSemesterYear] = useState(
//     parentSemesterYearFilter || []
//   );
//   const [showLocationCascader, setShowLocationCascader] = useState(false);
//   const [startDate, setLocalStartDate] = useState(parentStartDateFilter);
//   const [endDate, setLocalEndDate] = useState(parentEndDateFilter);
//   const filterRef = useRef(null);

//   // Show all filters when "All" is selected
//   const showAllFilters = selectedOccupation.includes("ALL");
//   const hideFilters =
//     selectedOccupation.includes("Faculty") &&
//     selectedOccupation.length === 1 &&
//     !showAllFilters;

//   const showYearFilter =
//     showAllFilters ||
//     (!hideFilters &&
//       (selectedOccupation.includes("Student") ||
//         selectedOccupation.includes("Alumni")));

//   const showLocationOption =
//     showAllFilters || (!hideFilters && selectedOccupation.includes("Alumni"));

//   // Helper function to get display text for cascader values
//   const getCascaderDisplayText = (values, options, defaultText) => {
//     if (!values || values.length === 0) return defaultText;

//     let currentOptions = options;
//     const labels = [];

//     for (const value of values) {
//       const option = currentOptions?.find((opt) => opt.value === value);
//       if (option) {
//         labels.push(option.label);
//         currentOptions = option.children;
//       }
//     }

//     return labels.length > 0 ? labels.join(" - ") : defaultText;
//   };

//   // Function to clear all filter values
//   const clearAllFilters = () => {
//     setInputValue("");
//     setSelectedOccupation(["ALL"]);
//     setLocalLocationFilter([]);
//     setLocalSemesterYear([]);
//     setLocalStartDate(undefined);
//     setLocalEndDate(undefined);
//     setShowLocationCascader(false);

//     // Immediately update parent filters
//     setLocationFilter([]);
//     setSemesterYearFilter([]);
//     setStartDateFilter(undefined);
//     setEndDateFilter(undefined);
//   };

//   useEffect(() => {
//     const updateFilterHeight = () => {
//       if (filterRef.current) {
//         const height = filterRef.current.getBoundingClientRect().height;
//         setFilterHeight(height + 10);
//       }
//     };

//     updateFilterHeight();
//     window.addEventListener("resize", updateFilterHeight);
//     const observer = new MutationObserver(updateFilterHeight);
//     if (filterRef.current) {
//       observer.observe(filterRef.current, { childList: true, subtree: true });
//     }

//     return () => {
//       window.removeEventListener("resize", updateFilterHeight);
//       observer.disconnect();
//     };
//   }, [
//     selectedOccupation,
//     showLocationCascader,
//     locationVisible,
//     semesterYearVisible,
//     filtersVisible,
//     setFilterHeight,
//   ]);

//   useEffect(() => {
//     if (
//       JSON.stringify(locationValue) !== JSON.stringify(parentLocationFilter)
//     ) {
//       setLocationFilter(locationValue);
//     }
//   }, [locationValue, parentLocationFilter, setLocationFilter]);

//   useEffect(() => {
//     if (
//       JSON.stringify(semesterYearValue) !==
//       JSON.stringify(parentSemesterYearFilter)
//     ) {
//       setSemesterYearFilter(semesterYearValue);
//     }
//   }, [semesterYearValue, parentSemesterYearFilter, setSemesterYearFilter]);

//   useEffect(() => {
//     if (startDate !== parentStartDateFilter) {
//       setStartDateFilter(startDate);
//     }
//   }, [startDate, parentStartDateFilter, setStartDateFilter]);

//   useEffect(() => {
//     if (endDate !== parentEndDateFilter) {
//       setEndDateFilter(endDate);
//     }
//   }, [endDate, parentEndDateFilter, setEndDateFilter]);

//   return (
//     <div
//       ref={filterRef}
//       style={{
//         padding: "16px",
//         background: "#fff",
//         margin: "100px 10px 10px 10px",
//         borderRadius: "0 0 16px 16px",
//         boxShadow: "0 4px 20px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1)",
//         position: "fixed",
//         top: 0,
//         left: 0,
//         right: 0,
//         zIndex: 10,
//       }}
//     >
//       <SearchBar
//         placeholder="Search users, courses, locations..."
//         value={inputValue}
//         onChange={setInputValue}
//         style={{ marginBottom: "16px" }}
//       />

//       <Space direction="vertical" style={{ width: "100%" }}>
//         <Space
//           direction="horizontal"
//           style={{ width: "100%", justifyContent: "space-between" }}
//         >
//           <Button
//             onClick={() => setFiltersVisible(!filtersVisible)}
//             style={{
//               background: filtersVisible ? "#f56565" : "#1890ff",
//               color: "#fff",
//             }}
//           >
//             {filtersVisible ? "Hide Filters" : "Show Filters"}
//           </Button>

//           <Button
//             onClick={clearAllFilters}
//             style={{
//               background: "#ff7875",
//               color: "#fff",
//               border: "none",
//             }}
//           >
//             Clear All
//           </Button>
//         </Space>

//         {filtersVisible && (
//           <>
//             <div style={{ marginBottom: "8px" }}>
//               <span
//                 style={{
//                   fontSize: "14px",
//                   fontWeight: "bold",
//                   color: "#374151",
//                   marginBottom: "8px",
//                   display: "block",
//                 }}
//               >
//                 Filter by Occupation:
//               </span>
//               <Selector
//                 options={occupationOptions}
//                 value={selectedOccupation}
//                 onChange={(values) => {
//                   setSelectedOccupation(values);

//                   // Reset filters when changing occupation (except for "All")
//                   if (!values.includes("ALL")) {
//                     if (!values.includes("Alumni")) {
//                       setLocalLocationFilter([]);
//                       setShowLocationCascader(false);
//                     }
//                     if (values.includes("Faculty") && values.length === 1) {
//                       setLocalSemesterYear([]);
//                       setLocalLocationFilter([]);
//                       setShowLocationCascader(false);
//                       setLocalStartDate(undefined);
//                       setLocalEndDate(undefined);
//                     }
//                   }
//                 }}
//                 multiple={false}
//               />
//             </div>

//             {/* Start Date Filter */}
//             {(showAllFilters || showYearFilter) && (
//               <div style={{ marginBottom: "8px" }}>
//                 <span
//                   style={{
//                     fontSize: "14px",
//                     fontWeight: "bold",
//                     color: "#374151",
//                     marginBottom: "8px",
//                     display: "block",
//                   }}
//                 >
//                   Filter by Start Year:
//                 </span>
//                 <DatePickerYear
//                   value={startDate}
//                   onChange={(value) => setLocalStartDate(value)}
//                   placeholder="Select Start Year"
//                 />
//               </div>
//             )}

//             {/* End Date Filter */}
//             {(showAllFilters || showYearFilter) && (
//               <div style={{ marginBottom: "8px" }}>
//                 <span
//                   style={{
//                     fontSize: "14px",
//                     fontWeight: "bold",
//                     color: "#374151",
//                     marginBottom: "8px",
//                     display: "block",
//                   }}
//                 >
//                   Filter by End Year:
//                 </span>
//                 <DatePickerYear
//                   value={endDate}
//                   onChange={(value) => setLocalEndDate(value)}
//                   placeholder="Select End Year"
//                 />
//               </div>
//             )}

//             {/* Semester/Year Filter */}
//             {(showAllFilters || !hideFilters) && (
//               <div style={{ marginBottom: "8px" }}>
//                 <span
//                   style={{
//                     fontSize: "14px",
//                     fontWeight: "bold",
//                     color: "#374151",
//                     marginBottom: "8px",
//                     display: "block",
//                   }}
//                 >
//                   Filter by Semester/Year:
//                 </span>
//                 <Space align="center">
//                   <Button
//                     onClick={() => setSemesterYearVisible(true)}
//                     style={{
//                       minWidth: "200px",
//                       textAlign: "left",
//                     }}
//                   >
//                     {getCascaderDisplayText(
//                       semesterYearValue,
//                       semesterYearOptions,
//                       "Select Semester/Year"
//                     )}
//                   </Button>
//                   <Cascader
//                     options={semesterYearOptions}
//                     visible={semesterYearVisible}
//                     onClose={() => setSemesterYearVisible(false)}
//                     value={semesterYearValue}
//                     onConfirm={setLocalSemesterYear}
//                     onSelect={(val, extend) => {
//                       console.log("onSelect Semester/Year", val, extend.items);
//                     }}
//                   />
//                 </Space>
//               </div>
//             )}

//             {/* Location Filter */}
//             {(showAllFilters || showLocationOption) && (
//               <div style={{ marginBottom: "8px" }}>
//                 <span
//                   style={{
//                     fontSize: "14px",
//                     fontWeight: "bold",
//                     color: "#374151",
//                     marginBottom: "8px",
//                     display: "block",
//                   }}
//                 >
//                   Filter by Location:
//                 </span>
//                 <Space align="center">
//                   <Button
//                     onClick={() => setLocationVisible(true)}
//                     style={{
//                       minWidth: "200px",
//                       textAlign: "left",
//                     }}
//                   >
//                     {getCascaderDisplayText(
//                       locationValue,
//                       locationOptions,
//                       "Select Location"
//                     )}
//                   </Button>
//                   <Cascader
//                     options={locationOptions}
//                     visible={locationVisible}
//                     onClose={() => setLocationVisible(false)}
//                     value={locationValue}
//                     onConfirm={setLocalLocationFilter}
//                     onSelect={(val, extend) => {
//                       console.log("onSelect Location", val, extend.items);
//                     }}
//                   />
//                 </Space>
//               </div>
//             )}
//           </>
//         )}
//       </Space>

//       <div style={{ padding: "16px 0px 0px 0px", marginBottom: "8px" }}>
//         <span style={{ fontSize: "14px", color: "#6b7280" }}>
//           {users.length} users found
//         </span>
//       </div>
//     </div>
//   );
// };
