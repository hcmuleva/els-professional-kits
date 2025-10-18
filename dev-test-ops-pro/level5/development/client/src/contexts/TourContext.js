// contexts/TourContext.js
import { createContext, useState, useContext } from "react";

const TourContext = createContext();

export const TourProvider = ({ children }) => {
  const [runTour, setRunTour] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  const startTour = () => setRunTour(true);
  const stopTour = () => setRunTour(false);

  return (
    <TourContext.Provider
      value={{ runTour, startTour, stopTour, tourStepIndex, setTourStepIndex }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => useContext(TourContext);
