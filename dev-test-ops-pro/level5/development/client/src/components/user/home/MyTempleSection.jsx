import { BookOutlined } from "@ant-design/icons";
import { Card } from "antd-mobile";
import { CollectMoneyOutline, RightOutline } from "antd-mobile-icons";
import { useContext, useEffect, useState } from "react";
import { getSingleOrg } from "../../../services/org";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AnimatedNumber = ({ value, duration = 800 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value === 0) return;

    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(
        startValue + (value - startValue) * easeOutQuart
      );

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <div
      style={{
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "4px",
        position: "relative",
        overflow: "hidden",
        height: "32px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <span
        style={{
          display: "inline-block",
          transform: isAnimating ? "translateY(0)" : "translateY(0)",
          transition: "transform 0.3s ease",
          animation: isAnimating ? "numberRoll 0.8s ease-out" : "none",
        }}
      >
        {displayValue.toLocaleString()}
      </span>

      <style>{`
        @keyframes numberRoll {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          20% {
            transform: translateY(-10%);
            opacity: 0.8;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

const MyTempleSection = () => {
  const { user } = useContext(AuthContext);
  const [orgInfo, setOrgInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isArray = Array.isArray(user?.org);
  const orgCount = isArray ? user.org.length : user?.org ? 1 : 0;
  const isSingleOrg = orgCount === 0;

  const users = orgInfo?.data?.attributes?.users?.data || [];
  const memberCount = users.length;
  const adminCount = users.length;

  useEffect(() => {
    const fetchOrgInfo = async () => {
      if (!isSingleOrg) return;
      try {
        const orgId = user?.org?.[0]?.id || user?.org?.id;
        if (!orgId) return;
        const res = await getSingleOrg(orgId);
        setOrgInfo(res);
      } catch (err) {
        console.error("Error loading org info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgInfo();
  }, [user, isSingleOrg]);

  return (
    <Card
      onClick={() => navigate("/templegroup-list")}
      style={{
        margin: "16px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        border: "none",
        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
        color: "white",
        cursor: "pointer",
      }}
    >
      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <CollectMoneyOutline
              style={{ fontSize: 24, marginRight: "12px" }}
            />
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
              My Temple
            </h2>
          </div>
          <RightOutline color="white" fontSize={20} />
        </div>

        <div
          style={{
            marginTop: "16px",
            fontSize: "16px",
            fontWeight: 500,
            opacity: 0.9,
          }}
        >
          {isSingleOrg
            ? orgInfo?.data?.attributes?.name || "Unnamed Temple"
            : `${orgCount} Temples linked to your profile`}
        </div>

        {isSingleOrg && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              {[
                { label: "Member Count", value: memberCount },
                { label: "Admin Count", value: adminCount },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    padding: "16px",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <AnimatedNumber
                    value={loading ? 0 : item.value}
                    duration={800 + idx * 200}
                  />
                  <div style={{ fontSize: "14px", opacity: 0.9 }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default MyTempleSection;
