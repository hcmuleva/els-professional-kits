import { Navigate, Outlet, Route, Routes, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

// Public pages
import LoginPage from "../pages/authpage/LoginPage";
import RegisterPage from "../pages/authpage/RegisterPage";
import SelectAccountPage from "../pages/authpage/SelectAccountPage";

// Protected pages
import HomePage from "../pages/HomePage";
import Profile from "../pages/user/Profile";
import MainLayout from "../components/layout/MainLayout";
import AdminController from "../components/admincontrol/AdminController";
import CommunityManager from "../components/admincontrol/admins/temple/CommunityManager";
import TempleAdmin from "../components/admincontrol/admins/temple/TempleAdmin";
import CategoryMgmt from "../components/admincontrol/superadmin/category/CategoryMgmt";
import ChatTabs from "../components/chat/ChatTabs";
import Events from "../components/dashboard/Events";
import Janganana from "../components/dashboard/Janganana";
import MyFamily from "../components/dashboard/MyFamily";
import ActivityView from "../components/dashboard/activity/ActivityView";
import BusinessList from "../components/dashboard/business/BusinessList";
import ProfessionList from "../components/dashboard/profession/ProfessionList";
import PoojaPath from "../components/dashboard/temple/general/dharmik/pooja/PoojaPath";
import StaticMagazine from "../components/magazine/StaticMagazine";
import { ProfessionListComponent } from "../components/profession/ProfessionListComponent";
import QuestionCreator from "../components/quiz/QuestionCreator";
import QuizSection from "../components/quiz/QuizSection";
import SuperController from "../components/admincontrol/SuperController";
import AnouncementForm from "../components/admincontrol/admins/anouncement/AnouncementForm";
import CommunityUserAssignment from "../components/admincontrol/admins/temple/users/CommunityUserAssignment";
import NewUserController from "../components/admincontrol/admins/temple/users/NewUserController";
import AchievementController from "../components/admincontrol/admins/temple/users/achievements/AchievementController";
import AdminUserController from "../components/admincontrol/admins/user/AdminUserController";
import SuperAdminTempleDetail from "../components/admincontrol/superadmin/temple/SuperAdminTempleDetail";
import SuperAdminTempleForm from "../components/admincontrol/superadmin/temple/SuperAdminTempleForm";
import SuperAdminTempleList from "../components/admincontrol/superadmin/temple/SuperAdminTempleList";
import AnnouncementController from "../components/dashboard/announcement/AnnouncementController";
import { AnnouncementsViewer } from "../components/dashboard/announcement/AnnouncementViewer";
import { CreateAnnouncements } from "../components/dashboard/announcement/CreateAnnouncements";
import UserTempleController from "../components/dashboard/temple/UserTempleController";
import CommittyDetail from "../components/dashboard/temple/committes/CommittyDetail";
import GeneralAllInOne from "../components/dashboard/temple/general/GeneralAllInOne";
import { EverythingMapComponent } from "../components/dashboard/temple/map/EverythingMapComponent";
import CommitteeDetails from "../components/templegroup/CommitteeDetails";
import UserListPage from "../pages/UserListPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import UserProfilePanel from "../pages/user/UserProfilePanel";
import BonusToTemple from "../components/admincontrol/admins/extra/BonusToTemple";
import FamilyRegisterPage from "../components/user/propfile/FamilyRegisterPage";
import FamilyViewCard from "../components/familyfield/FamilyViewCard";
import AllFamilies from "../components/dashboard/AllFamilies";
import AdminResetPage from "../components/dashboard/AdminResetPage";
import AdminAddressReset from "../components/admincontrol/admins/AdminAddressReset";
import HCMQuizApp from "../components/quiz/HCMQuizApp";
import TestComponent from "../components/share/TestComponent";
import QuestionPlayer from "../components/quiz/quiztest/QuestionPlayer";
import SuperAdminAssignUserToTemple from "../components/admincontrol/superadmin/temple/SuperAdminAssignUserToTemple";
import ShareableCard from "../components/share/ShareableCard";
import EducationList from "../components/dashboard/education/EducationList";
import AgricultureList from "../components/dashboard/agriculture/AgricultureList";

const ProtectedRoute = ({ redirectPath = "/register" }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

const PublicRoute = ({ redirectPath = "/dashboard" }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to={redirectPath} replace /> : <Outlet />;
};

// DeepLinkHandler component for both /templeservice/:templeId and /temple/:templeId
const DeepLinkHandler = () => {
  const { templeId } = useParams();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Clear deep link data for authenticated users
      localStorage.removeItem("deep_link_templeId");
      localStorage.removeItem("deep_link_data");
      localStorage.removeItem("pending_temple_id");
      console.log("🗑️ Cleared stored temple IDs for authenticated user");
    } else if (templeId) {
      // Store templeId for non-authenticated users
      localStorage.setItem("deep_link_templeId", templeId);
      console.log("💾 Stored templeId for non-authenticated user:", templeId);
    }
  }, [templeId, isAuthenticated]);

  if (isAuthenticated) {
    // Do not navigate; redirect to dashboard to maintain current session
    return <Navigate to="/dashboard" replace />;
  }

  // For non-authenticated users, go to RegisterPage
  return <RegisterPage />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/user/:userid" element={<ShareableCard />} />
      <Route path="/share/user/:userid" element={<ShareableCard />} />
      <Route path="/usercard-qr/:userid" element={<ShareableCard />} />

      
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/select-account" element={<SelectAccountPage />} />
      
      </Route>
      /** Deep link */
      <Route path="/invite" element={<RegisterPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/templeservice/:templeId" element={<DeepLinkHandler />} />
      <Route path="/temple/:templeId" element={<DeepLinkHandler />} />
      {/* <Route
        path="/familyregister/:familyId/temple/:templeId"
        element={<FamilyRegisterPage />}
      /> */}

           <Route path="/familyregister/:familyId/temple/:templeId">
             <Route index element={<FamilyRegisterPage />} />
            <Route path="edit/:userId" element={<FamilyRegisterPage />} />
             <Route
               path="reset-password/:userId"
               element={<FamilyRegisterPage />}
             />
           </Route>
          
      <Route path="/register/:id" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          /** Super Admin routes */
          <Route path="/templesuperadmin" element={<SuperAdminTempleList />} />
          <Route
            path="/assignusertemple"
            element={<SuperAdminAssignUserToTemple />}
          />
          <Route
            path="/superadmin/temples/new"
            element={<SuperAdminTempleForm />}
          />
          <Route
            path="/superadmin/temple/:id"
            element={<SuperAdminTempleDetail />}
          />
          /** Admin Routes */
          <Route path="/admin" element={<SuperController />} />
          <Route path="/superadmin" element={<SuperController />} />
          <Route
            path="/adminusermanage/:id"
            element={<AdminUserController />}
          />
          <Route path="/announcements/:id" element={<AnouncementForm />} />
          <Route
            path="/templeadmin/:templeadminId/familyadmin/:familyadminId"
            element={<MyFamily />}
          />
          <Route
            path="/adminreset/templeadminId/:templeadminId/familyid/:familyId/userid/:userId"
            element={<AdminResetPage />}
          />
          <Route path="/address/edit/:userId" element={<AdminAddressReset />} />
          <Route
            path="/adminfamilylist/:templeIdfromAdmin"
            element={<AllFamilies />}
          />
          /** Temple Admin */
          <Route
            path="/templeannouncements/:id"
            element={<CreateAnnouncements />}
          />
          <Route path="/temple/:id" element={<TempleAdmin />} />
          <Route path="/templecommittee/:id" element={<CommunityManager />} />
          <Route
            path="/templeactivities/:templeId"
            element={<ActivityView />}
          />
          <Route path="/generaltempleallinone" element={<GeneralAllInOne />} />
          <Route
            path="/templeachievements/:id"
            element={<AchievementController />}
          />
          <Route
            path="/temple/:templeId/subcategory/:subcategoryId"
            element={<CommunityUserAssignment />}
          />
          <Route path="/templebonus/:id" element={<BonusToTemple />} />
          /** User Temple */
          <Route path="/usertemple/:id" element={<UserTempleController />} />
          <Route
            path="/templeuserannouncment"
            element={<AnnouncementController />}
          />
          <Route
            path="/userannouncements/:templeid/:subcategoryid"
            element={<AnnouncementsViewer />}
          />
          <Route
            path="/usertemple/:templeId/subcategory/:subcategoryId"
            element={<CommittyDetail />}
          />
          <Route path="/all-family" element={<AllFamilies />} />
          <Route path="/familylist/:familyid" element={<FamilyViewCard />} />
          <Route path="/map/:maptype" element={<EverythingMapComponent />} />
          <Route path="/dharm" element={<GeneralAllInOne />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/magazine" element={<StaticMagazine />} />
          <Route path="/janganana" element={<Janganana />} />
          <Route path="/myfamily" element={<MyFamily />} />
          <Route path="/pooja" element={<PoojaPath />} />
          <Route path="/events" element={<Events />} />
          <Route path="/activity-view" element={<ActivityView />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminController />} />
          <Route path="/adminrolecontroller" element={<AdminController />} />
          <Route path="/admincategories" element={<CategoryMgmt />} />
          <Route path="/userslist" element={<UserListPage />} />
          <Route path="/userprofilepanel/:id" element={<UserProfilePanel />} />
          <Route path="/map/:maptype" element={<EverythingMapComponent />} />
          <Route path="/quiz" element={<QuizSection />} />
          <Route path="/hcmquizapp" element={<HCMQuizApp />} />
          <Route path="/mycard" element={<TestComponent />} />
          <Route path="/chats" element={<ChatTabs />} />
          <Route
            path="/professions-list"
            element={<ProfessionListComponent />}
          />
         
          <Route
            path="/professions-list/:professionType"
            element={<ProfessionListComponent />}
          />
          <Route
            path="/content/:contentid/create-question"
            element={<QuestionCreator />}
          />
          <Route
            path="/committee/:orgId/:committeeId"
            element={<CommitteeDetails />}
          />
          <Route path="/businesslist" element={<BusinessList />} />
          <Route path="/professionlist" element={<ProfessionList />} />
          <Route path="/questionarea" element={<QuestionPlayer />} />
          <Route
            path="/education-list"
            element={<EducationList />}
          />
          <Route path="/agriculture-list" element={<AgricultureList />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// import { Navigate, Outlet, Route, Routes } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

// // Public pages
// import LoginPage from "../pages/authpage/LoginPage";
// import RegisterPage from "../pages/authpage/RegisterPage";
// import SelectAccountPage from "../pages/authpage/SelectAccountPage";

// // Protected pages
// import HomePage from "../pages/HomePage";
// import Profile from "../pages/user/Profile";

// import MainLayout from "../components/layout/MainLayout";

// import AdminController from "../components/admincontrol/AdminController";
// import CommunityManager from "../components/admincontrol/admins/temple/CommunityManager";
// import TempleAdmin from "../components/admincontrol/admins/temple/TempleAdmin";
// import CategoryMgmt from "../components/admincontrol/superadmin/category/CategoryMgmt";
// import ChatTabs from "../components/chat/ChatTabs";
// import Events from "../components/dashboard/Events";
// import Janganana from "../components/dashboard/Janganana";
// import MyFamily from "../components/dashboard/MyFamily";
// import ActivityView from "../components/dashboard/activity/ActivityView";
// import BusinessList from "../components/dashboard/business/BusinessList";
// import ProfessionList from "../components/dashboard/profession/ProfessionList";
// import PoojaPath from "../components/dashboard/temple/general/dharmik/pooja/PoojaPath";
// import StaticMagazine from "../components/magazine/StaticMagazine";
// import { ProfessionListComponent } from "../components/profession/ProfessionListComponent";
// import QuestionCreator from "../components/quiz/QuestionCreator";
// import QuizSection from "../components/quiz/QuizSection";
// //import { EverythingMapComponent } from "../components/student/EverythingMapComponent";
// import SuperController from "../components/admincontrol/SuperController";
// import AnouncementForm from "../components/admincontrol/admins/anouncement/AnouncementForm";
// import CommunityUserAssignment from "../components/admincontrol/admins/temple/users/CommunityUserAssignment";
// import NewUserController from "../components/admincontrol/admins/temple/users/NewUserController";
// import AchievementController from "../components/admincontrol/admins/temple/users/achievements/AchievementController";
// import AdminUserController from "../components/admincontrol/admins/user/AdminUserController";
// import SuperAdminTempleDetail from "../components/admincontrol/superadmin/temple/SuperAdminTempleDetail";
// import SuperAdminTempleForm from "../components/admincontrol/superadmin/temple/SuperAdminTempleForm";
// import SuperAdminTempleList from "../components/admincontrol/superadmin/temple/SuperAdminTempleList";
// import AnnouncementController from "../components/dashboard/announcement/AnnouncementController";
// import { AnnouncementsViewer } from "../components/dashboard/announcement/AnnouncementViewer";
// import { CreateAnnouncements } from "../components/dashboard/announcement/CreateAnnouncements";
// import UserTempleController from "../components/dashboard/temple/UserTempleController";
// import CommittyDetail from "../components/dashboard/temple/committes/CommittyDetail";
// import GeneralAllInOne from "../components/dashboard/temple/general/GeneralAllInOne";
// import { EverythingMapComponent } from "../components/dashboard/temple/map/EverythingMapComponent";
// import CommitteeDetails from "../components/templegroup/CommitteeDetails";
// import UserListPage from "../pages/UserListPage";
// import DashboardPage from "../pages/dashboard/DashboardPage";
// import UserProfilePanel from "../pages/user/UserProfilePanel";
// import BonusToTemple from "../components/admincontrol/admins/extra/BonusToTemple";
// import FamilyRegisterPage from "../components/user/propfile/FamilyRegisterPage";
// import FamilyViewCard from "../components/familyfield/FamilyViewCard";
// import AllFamilies from "../components/dashboard/AllFamilies";
// import AdminResetPage from "../components/dashboard/AdminResetPage";
// import AdminAddressReset from "../components/admincontrol/admins/AdminAddressReset";
// import HCMQuizApp from "../components/quiz/HCMQuizApp";
// import TestComponent from "../components/share/TestComponent";
// import QuestionPlayer from "../components/quiz/quiztest/QuestionPlayer";
// import SuperAdminAssignUserToTemple from "../components/admincontrol/superadmin/temple/SuperAdminAssignUserToTemple";

// const ProtectedRoute = ({ redirectPath = "/register" }) => {
//   const { isAuthenticated, loading } = useAuth();
//   if (loading) return <div>Loading...</div>;
//   return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
// };

// const PublicRoute = ({ redirectPath = "/dashboard" }) => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? <Navigate to={redirectPath} replace /> : <Outlet />;
// };

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route element={<PublicRoute />}>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/select-account" element={<SelectAccountPage />} />
//       </Route>
//       /** Deep link */
//       <Route path="/invite" element={<RegisterPage />} />
//       <Route path="/register" element={<RegisterPage />} />
//       <Route path="/templeservice/:templeId" element={<RegisterPage />} />
//       <Route
//         path="/familyregister/:familyId/temple/:templeId"
//         element={<FamilyRegisterPage />}
//       />
//       <Route path="/register/:id" element={<RegisterPage />} />
//       <Route element={<ProtectedRoute />}>
//         <Route element={<MainLayout />}>
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />
//           /** Super Admin routes */
//           <Route path="/templesuperadmin" element={<SuperAdminTempleList />} />
//           <Route
//             path="/assignusertemple"
//             element={<SuperAdminAssignUserToTemple />}
//           />
//           <Route
//             path="/superadmin/temples/new"
//             element={<SuperAdminTempleForm />}
//           />
//           <Route
//             path="/superadmin/temple/:id"
//             element={<SuperAdminTempleDetail />}
//           />
//           /** Admin Routes */
//           <Route path="/admin" element={<SuperController />} />
//           <Route path="/superadmin" element={<SuperController />} />
//           <Route
//             path="/adminusermanage/:id"
//             element={<AdminUserController />}
//           />
//           <Route path="/announcements/:id" element={<AnouncementForm />} />
//           <Route
//             path="/templeadmin/:templeadminId/familyadmin/:familyadminId"
//             element={<MyFamily />}
//           />
//           <Route
//             path="/adminreset/templeadminId/:templeadminId/familyid/:familyId/userid/:userId"
//             element={<AdminResetPage />}
//           />
//           <Route path="/address/edit/:userId" element={<AdminAddressReset />} />
//           <Route
//             path="/adminfamilylist/:templeIdfromAdmin"
//             element={<AllFamilies />}
//           />
//           /** Temple Admin */
//           <Route
//             path="/templeannouncements/:id"
//             element={<CreateAnnouncements />}
//           />
//           <Route path="/temple/:id" element={<TempleAdmin />} />
//           <Route path="/templecommittee/:id" element={<CommunityManager />} />
//           <Route
//             path="/templeactivities/:templeId"
//             element={<ActivityView />}
//           />
//           <Route path="/generaltempleallinone" element={<GeneralAllInOne />} />
//           <Route
//             path="/templeachievements/:id"
//             element={<AchievementController />}
//           />
//           <Route
//             path="/temple/:templeId/subcategory/:subcategoryId"
//             element={<CommunityUserAssignment />}
//           />
//           <Route path="/templebonus/:id" element={<BonusToTemple />} />
//           /** User Temple */
//           <Route path="/usertemple/:id" element={<UserTempleController />} />
//           <Route
//             path="/templeuserannouncment"
//             element={<AnnouncementController />}
//           />
//           <Route
//             path="/userannouncements/:templeid/:subcategoryid"
//             element={<AnnouncementsViewer />}
//           />
//           <Route
//             path="/usertemple/:templeId/subcategory/:subcategoryId"
//             element={<CommittyDetail />}
//           />
//           {/* <Route
//             path="/adminreset/templeadminId/:templeadminId/userid/:userId"
//             element={<AdminResetPage />}
//           /> */}
//           <Route path="/familyregister/:familyId/temple/:templeId">
//             <Route index element={<FamilyRegisterPage />} />
//             <Route path="edit/:userId" element={<FamilyRegisterPage />} />
//             <Route
//               path="reset-password/:userId"
//               element={<FamilyRegisterPage />}
//             />
//           </Route>
//           <Route path="/all-family" element={<AllFamilies />} />
//           <Route path="/familylist/:familyid" element={<FamilyViewCard />} />
//           <Route path="/map/:maptype" element={<EverythingMapComponent />} />
//           <Route path="/dharm" element={<GeneralAllInOne />} />
//           <Route path="/dashboard" element={<DashboardPage />} />
//           <Route path="/magazine" element={<StaticMagazine />} />
//           <Route path="/janganana" element={<Janganana />} />
//           <Route path="/myfamily" element={<MyFamily />} />
//           <Route path="/pooja" element={<PoojaPath />} />
//           <Route path="/events" element={<Events />} />
//           <Route path="/activity-view" element={<ActivityView />} />
//           <Route path="/home" element={<HomePage />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/admin" element={<AdminController />} />
//           <Route path="/adminrolecontroller" element={<AdminController />} />
//           <Route path="admincategories" element={<CategoryMgmt />} />
//           <Route path="/userslist" element={<UserListPage />} />
//           <Route path="/userprofilepanel/:id" element={<UserProfilePanel />} />
//           <Route path="/map/:maptype" element={<EverythingMapComponent />} />
//           <Route path="/quiz" element={<QuizSection />} />
//           <Route path="/hcmquizapp" element={<HCMQuizApp />} />
//           <Route path="/mycard" element={<TestComponent />} />
//           <Route path="/chats" element={<ChatTabs />} />
//           <Route
//             path="/professions-list"
//             element={<ProfessionListComponent />}
//           />
//           <Route
//             path="/professions-list/:professionType"
//             element={<ProfessionListComponent />}
//           />
//           <Route
//             path="/content/:contentid/create-question"
//             element={<QuestionCreator />}
//           />
//           <Route
//             path="/committee/:orgId/:committeeId"
//             element={<CommitteeDetails />}
//           />
//           <Route path="/businesslist" element={<BusinessList />} />
//           <Route path="/professionlist" element={<ProfessionList />} />
//           <Route path="/questionarea" element={<QuestionPlayer />} />
//           {/* <Route
//             path="/temple/:templeId/subcategory/:subcategoryId"
//             element={<AssignUserToCommunity />}
//           /> */}
//           {/* <Route path="/coursesadmin" element={<CourseAdmin />} /> */}
//           {/* <Route
//             path="/courses/:courseId/roles"
//             element={<CourseRoleAssignment />}
//           /> */}
//           {/* <Route
//             path="/admincourses/:courseId/contents"
//             element={<ContentAdminComponent />}
//           /> */}
//           {/* <Route path="/courses" element={<CourseList />} />
//           <Route path="/courses/create" element={<CourseForm />} />
//           <Route
//             path="/courses/:courseId/contents"
//             element={<CourseContentManager />}
//           />
//           <Route
//             path="/courses/:courseId/contents/create"
//             element={<ContentForm />}
//           /> */}
//           {/* <Route
//             path="/temple-detail-page"
//             element={<TempleList temple={temple} />}
//           />
//           <Route
//             path="/temple/:templeId/community/:communityId"
//             element={<CommunityDetail />}
//           />
//           <Route
//             path="/temple/:templeId/subcategory/:subcategoryId"
//             element={<TempleSubcategoryDetails />}
//           />
//           <Route
//             path="/temple/:templeId/communities"
//             element={<CommunityList />}
//           /> */}
//           {/* <Route path="/mycommunity" element={<MyCommunity />} />
//           <Route path="/business" element={<BusinessPage />} />
//           <Route path="/jobs" element={<JobsPage />} />
//           <Route path="/subscriptions" element={<SubscriptionPage />} /> */}
//           {/* <Route
//             path="/categoryrole/:categoryId"
//             element={<CategoryRoleMgmt />}
//           />
//           <Route
//             path="/subcategory/:categoryId"
//             element={<SubCategoryMgmt />}
//           /> */}
//         </Route>
//       </Route>
//       <Route path="*" element={<Navigate to="/login" replace />} />
//     </Routes>
//   );
// }
