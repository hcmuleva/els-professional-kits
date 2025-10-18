import HomePage from "../../../pages/HomePage";
import { AnnouncementsSection } from "../../dashboard/announcement/AnnouncementsSection";
import MyTempleSection from "./MyTempleSection";
import { QuickActionsSection } from "./QuickActionsSection";
import { TopProfessionSection } from "./TopProfessionSection";

const HomeController = () => {
  return (
    <div style={{ paddingBottom: "20px" }}>
      <MyTempleSection />
      <TopProfessionSection />
      {/* <AnnouncementsSection /> */}
      <QuickActionsSection />
    </div>
  );
};

export default HomeController;
