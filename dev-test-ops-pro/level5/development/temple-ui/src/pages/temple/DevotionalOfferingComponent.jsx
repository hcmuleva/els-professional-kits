import { useState, useEffect } from 'react';

export default function DevotionalOfferingComponent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [flowerCount, setFlowerCount] = useState(15);
  const [lampCount, setLampCount] = useState(3);
  
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

  const addMoreLamps = () => {
    setLampCount(prev => Math.min(prev + 2, 9));
  };

  // Array of colorful flowers for offering
  const offeringFlowers = ['🌸', '🌺', '🌹', '🌷', '💐', '🌻', '🪷', '🏵️'];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto bg-amber-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-orange-800">Devotional Offering to Lord Vishnu</h2>
      
      {!isLoaded ? (
        <div className="w-full h-96 bg-amber-100 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="relative w-full h-96 rounded-lg overflow-hidden border-4 border-amber-300 bg-gradient-to-b from-indigo-100 to-amber-100">
          {/* Background decorative elements */}
          <div className="absolute inset-0 w-full h-full opacity-20">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={`om-${i}`} 
                className="absolute text-lg text-amber-700 opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              >
                🕉️
              </div>
            ))}
          </div>
          
          {/* Lord Vishnu Image */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            {/* Using placeholder image with deity-appropriate styling */}
            <div className="relative w-64 h-72 bg-blue-100 rounded-t-full overflow-hidden border-2 border-amber-400">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl mb-2">🕉️</div>
                <div className="text-5xl mb-4">विष्णु</div>
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
          
          {/* Rotating lamp animation */}
          <div className="absolute inset-x-0 bottom-24 flex justify-center items-center pointer-events-none">
            <div className="flex justify-around w-full max-w-sm">
              {Array.from({ length: lampCount }).map((_, i) => (
                <div 
                  key={`lamp-${i}`} 
                  className="lamp-rotate"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                >
                  <div className="relative">
                    <span className="text-3xl">🪔</span>
                    <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg flame-flicker">✨</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Falling flowers offering overlay */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="relative w-full h-full">
              {Array.from({ length: flowerCount }).map((_, i) => (
                <div
                  key={`flower-${i}`}
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
          <div className="absolute top-4 left-0 right-0 flex justify-center space-x-4">
            <button 
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full shadow-md transition-colors flex items-center text-sm"
              onClick={addMoreFlowers}
            >
              <span className="mr-1">🪷</span> Offer Flowers
            </button>
            <button 
              className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-full shadow-md transition-colors flex items-center text-sm"
              onClick={addMoreLamps}
            >
              <span className="mr-1">🪔</span> Add Lamps
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
            
            .lamp-rotate {
              display: inline-block;
              animation: lampRotate 4s ease-in-out infinite;
            }
            
            @keyframes lampRotate {
              0%, 100% {
                transform: rotate(-10deg) translateY(0);
              }
              25% {
                transform: rotate(10deg) translateY(-5px);
              }
              50% {
                transform: rotate(-5deg) translateY(0);
              }
              75% {
                transform: rotate(5deg) translateY(-5px);
              }
            }
            
            .flame-flicker {
              animation: flameFlicker 1s ease-in-out infinite alternate;
            }
            
            @keyframes flameFlicker {
              0%, 100% {
                opacity: 1;
                transform: scale(1) translate(-50%, -50%);
              }
              50% {
                opacity: 0.8;
                transform: scale(0.9) translate(-50%, -50%);
              }
            }
          `}</style>
        </div>
      )}
      
      <div className="mt-4 p-4 bg-amber-100 rounded-lg w-full text-center border border-amber-200">
        <p className="text-sm text-amber-800">
          This represents a devotional offering scene with animated diyas (lamps) performing aarti 
          along with falling flowers (pushpanjali) as offerings to Lord Vishnu.
          The rotating lamps symbolize the ritual of aarti, a devotional ritual of light.
        </p>
      </div>
    </div>
  );
}