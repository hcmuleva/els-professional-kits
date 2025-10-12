import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import AdminCommittees from "./committee/AdminCommittees";
import UserCommittees from "./committee/UserCommittees";

const Committees = ({ orgId }) => {
  const { user } = useContext(AuthContext);
  // Non-admin view
  if (!user || user.userrole !== "ADMIN") {
    return <UserCommittees orgId={orgId} />;
  }

  // Admin view
  return <AdminCommittees orgId={orgId} />;
};

export default Committees;
