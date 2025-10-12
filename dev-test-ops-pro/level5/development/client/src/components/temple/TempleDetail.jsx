import React from "react";
import { useParams } from "react-router-dom";
import UserTempleDetails from "./rolebasedcomponents/admin/user/UserTempleDetails";
import { AuthContext, useAuth } from "../../contexts/AuthContext";
import TempleAdmin from "./rolebasedcomponents/admin/TempleAdmin";
import TempleSuperAdmin from "./rolebasedcomponents/superadmin/TempleSuperAdmin";

export default function TempleDetail() {
  const { id } = useParams();
  const { user } = useAuth(AuthContext);
  const userrole = user?.userrole;
  switch (userrole) {
    case "ADMIN":
      return <TempleAdmin id={id} />;
    case "SUPERADMIN":
      return <TempleSuperAdmin id={id} />;
    case "USER":
      return <UserTempleDetails id={id} />;
    default:
      return <UserTempleDetails id={id} />;
  }
}
