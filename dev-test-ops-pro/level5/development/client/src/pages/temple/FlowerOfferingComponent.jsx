import { useState, useEffect } from 'react';

export default function FlowerOfferingComponent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [flowerCount, setFlowerCount] = useState(15);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const addMoreFlowers = () => {
    setFlowerCount(prev => Math.min(prev + 10, 50));
  };

  // Array of colorful flowers for offering
  const offeringFlowers = ['🌸', '🌺', '🌹', '🌷', '💐', '🌻', '🪷', '🏵️'];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto bg-amber-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-orange-800">Flower Offering to Lord Vishnu</h2>
      
      {!isLoaded ? (
        <div className="w-full h-96 bg-amber-100 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="relative w-full h-96 rounded-lg overflow-hidden border-4 border-amber-300 bg-gradient-to-b from-blue-100 to-amber-100">
          {/* Lord Vishnu Image */}
          <div className="absolute inset-0 w-full h-full flex items-end justify-center">
            {/* Using placeholder image with deity-appropriate styling */}
            <div className="relative w-64 h-80 bg-blue-50 rounded-t-full overflow-hidden border-2 border-amber-400 mb-2">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-7xl mb-2">🕉️</div>
                <div className="text-6xl mb-4">विष्णु</div>
                <div className="flex">
                  <span className="text-4xl mx-1">🔱</span>
                  <span className="text-4xl mx-1">🪄</span>
                  <span className="text-4xl mx-1">🛞</span>
                  <span className="text-4xl mx-1">🐚</span>
                </div>
                <div className="mt-4 text-center px-2">
                  <p className="text-amber-800 font-semibold">Lord Vishnu</p>
                  <p className="text-amber-700 text-sm italic">The Preserver</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Falling flowers offering overlay */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="relative w-full h-full">
              {Array.from({ length: flowerCount }).map((_, i) => (
                <div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: `${5 + Math.random() * 90}%`,
                    top: `-${Math.random() * 20}%`,
                    animation: `flowersRain ${2 + Math.random() * 4}s linear ${Math.random() * 5}s infinite`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                >
                  {offeringFlowers[Math.floor(Math.random() * offeringFlowers.length)]}
                </div>
              ))}
            </div>
          </div>
          
          {/* Controls */}
          <div className="absolute top-4 left-0 right-0 flex justify-center">
            <button 
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full shadow-md transition-colors flex items-center"
              onClick={addMoreFlowers}
            >
              <span className="mr-2">🪷</span> Offer more flowers
            </button>
          </div>

          {/* Custom animation */}
          <style jsx>{`
            @keyframes flowersRain {
              0% {
                transform: translateY(-10%) rotate(0deg);
                opacity: 1;
              }
              50% {
                opacity: 0.7;
              }
              100% {
                transform: translateY(600%) rotate(360deg);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}
      
      <div className="mt-4 p-4 bg-amber-100 rounded-lg w-full text-center border border-amber-200">
        <p className="text-sm text-amber-800">
          This represents a devotional flower offering to Lord Vishnu. The falling flowers symbolize 
          "Pushpanjali" - an offering of flowers as a mark of devotion and respect.
          Click the button to offer more flowers as prayer.
        </p>
      </div>
    </div>
  );
}