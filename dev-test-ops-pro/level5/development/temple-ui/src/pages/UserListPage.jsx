import { InfiniteScroll } from "antd-mobile";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCardPanel } from "../components/UserCardPanel";
import { AuthContext } from "../contexts/AuthContext";
import { fetchPaginatedUsersList, searchUsers } from "../services/user";
import {
  SearchFilterPanel,
  locationOptions,
  semesterYearOptions,
  occupationOptions,
} from "../components/common/SearchFilterPanel";

const UserListPage = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [profession, setProfession] = useState("");
  const [locationValue, setLocationValue] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState([]);
  const [semesterYearValue, setSemesterYearValue] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filterHeight, setFilterHeight] = useState(100);
  const [degreeLevel, setDegreeLevel] = useState("");
  const [education, setEducation] = useState("");

  const navigate = useNavigate();
  const limit = 10;

  const fetchUsers = async (pageNum = 1, searchQuery = "", reset = false) => {
    if (loading) return;

    try {
      setLoading(true);
      const start = (pageNum - 1) * limit;

      let filters = {
        profession: profession || undefined,
        // Use the deepest location value for filtering
        location:
          locationValue.length > 0
            ? locationValue[locationValue.length - 1]
            : undefined,
        // Use address field for location search as well
        address:
          locationValue.length > 0
            ? locationValue[locationValue.length - 1]
            : undefined,
        semester:
          semesterYearValue.length > 0 && semesterYearValue[0] === "semester"
            ? semesterYearValue[semesterYearValue.length - 1].split("_")[1]
            : undefined,
        year:
          semesterYearValue.length > 0 && semesterYearValue[0] === "year"
            ? semesterYearValue[semesterYearValue.length - 1].split("_")[1]
            : undefined,
        occupation:
          selectedOccupation.length > 0 && !selectedOccupation.includes("ALL")
            ? selectedOccupation[0]
            : undefined,
        start_date: startDate
          ? new Date(startDate, 0, 1).toISOString()
          : undefined,
        end_date: endDate ? new Date(endDate, 0, 1).toISOString() : undefined,
        education_degree_level: degreeLevel || undefined,
        education: education || undefined,
      };

      // Remove undefined values
      Object.keys(filters).forEach((key) => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      let response;
      if (searchQuery.trim()) {
        response = await searchUsers(searchQuery, start, limit, filters);
      } else {
        response = await fetchPaginatedUsersList(start, limit, filters);
      }

      const userList = response.data || [];
      const pagination = response.pagination || {};

      console.log("Fetched users:", userList);
      console.log("Pagination:", pagination);
      console.log("Applied filters:", filters);

      if (reset || pageNum === 1) {
        setUsers(userList);
      } else {
        setUsers((prev) => [...prev, ...userList]);
      }

      const totalPages = pagination.pageCount || 1;
      const currentPage = pagination.page || pageNum;
      setHasMore(currentPage < totalPages);

      if (currentPage < totalPages) {
        setPage(currentPage + 1);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const onUserSelect = (profileId) => {
    navigate(`/userprofilepanel/${profileId}`);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchText(inputValue);
    }, 300);

    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    setUsers([]);
    setPage(1);
    setHasMore(true);
    fetchUsers(1, searchText, true);
  }, [
    searchText,
    profession,
    locationValue,
    semesterYearValue,
    selectedOccupation,
    startDate,
    endDate,
    education,
    degreeLevel,
  ]);

  return (
    <div
      style={{
        background: "#f1f5f9",
        minHeight: "100vh",
        paddingBottom: "80px",
      }}
    >
      <SearchFilterPanel
        inputValue={inputValue}
        setInputValue={setInputValue}
        users={users}
        selectedOccupation={selectedOccupation}
        setSelectedOccupation={setSelectedOccupation}
        setLocationFilter={setLocationValue}
        setSemesterYearFilter={setSemesterYearValue}
        setStartDateFilter={setStartDate}
        setEndDateFilter={setEndDate}
        filterHeight={filterHeight}
        setFilterHeight={setFilterHeight}
        parentLocationFilter={locationValue}
        parentSemesterYearFilter={semesterYearValue}
        parentStartDateFilter={startDate}
        parentEndDateFilter={endDate}
        education={education}
        setEducation={setEducation}
        degreeLevel={degreeLevel}
        setDegreeLevel={setDegreeLevel}
      />

      <div style={{ paddingTop: `${filterHeight}px`, zIndex: 8 }}>
        <div>
          {users.map((user, idx) => (
            <UserCardPanel
              key={user?.id || idx}
              userId={user?.id}
              onClick={() => onUserSelect(user?.id)}
            />
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
        )}

        <InfiniteScroll
          loadMore={() => !loading && fetchUsers(page, searchText)}
          hasMore={hasMore && !loading}
        />
      </div>
    </div>
  );
};

export default UserListPage;
