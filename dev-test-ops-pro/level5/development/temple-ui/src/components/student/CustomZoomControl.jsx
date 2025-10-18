import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import "../../styles/customzoomcontrol.css";
import { createRoot } from "react-dom/client";

export const CustomZoomControl = () => {
  const map = useMap();
  const controlRef = useRef(null);

  useEffect(() => {
    const container = L.DomUtil.create("div");
    const control = L.control({ position: "bottomleft" });

    control.onAdd = () => container;
    control.addTo(map);

    // Create React root and render JSX inside Leaflet control
    const root = createRoot(container);
    root.render(
      <div className="custom-zoom-control">
        <button className="zoom-btn" onClick={() => map.zoomIn()}>
          <PlusOutlined />
        </button>
        <button className="zoom-btn" onClick={() => map.zoomOut()}>
          <MinusOutlined />
        </button>
      </div>
    );

    // Cleanup
    return () => {
      map.removeControl(control);
      root.unmount();
    };
  }, [map]);

  return null;
};
