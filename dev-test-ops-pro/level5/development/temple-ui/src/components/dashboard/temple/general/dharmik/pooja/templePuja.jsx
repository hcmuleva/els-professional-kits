import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Button, Typography } from 'antd';
import { RedoOutlined, SoundOutlined } from '@ant-design/icons';
import photo from './photo.jpg';
import diya from './Diya.png';
import incense from './incense.png';
import kalash from './kalash.png';
import TextToSpeechPlayer from './TextToSpeechPlayer';

const { Text, Title } = Typography;

export default function FlowerOfferingComponent() {
  const [flowers, setFlowers] = useState([]);
  const [showDiya, setShowDiya] = useState(false);
  const [showIncense, setShowIncense] = useState(false);
  const [showKalash, setShowKalash] = useState(false);

  const [diyaComplete, setDiyaComplete] = useState(false);
  const [incenseComplete, setIncenseComplete] = useState(false);
  const [kalashComplete, setKalashComplete] = useState(false);

  const diyaRotation = useMotionValue(0);
  const diyaCounter = useTransform(diyaRotation, (v) => -v);
  const incenseRotation = useMotionValue(0);
  const incenseCounter = useTransform(incenseRotation, (v) => -v);
  const kalashRotation = useMotionValue(0);
  const kalashCounter = useTransform(kalashRotation, (v) => -v);

  const audioRef = useRef(null); // 🔊 Ref for shankha sound

  const resetAll = () => {
    setFlowers([]);
    setShowDiya(false);
    setShowIncense(false);
    setShowKalash(false);
    setDiyaComplete(false);
    setIncenseComplete(false);
    setKalashComplete(false);
    diyaRotation.set(0);
    incenseRotation.set(0);
    kalashRotation.set(0);
  };

  const dropFlowers = () => {
    resetAll();
    const newFlowers = Array.from({ length: 15 }).map((_, index) => ({
      id: Date.now() + index,
      left: Math.random() * 70 + 15,
      delay: Math.random() * 1,
    }));
    setFlowers(newFlowers);
    setTimeout(() => setFlowers([]), 3500);
  };

  const animateItem = (setShow, rotationVal, setDone) => {
    resetAll();
    setShow(true);
    let start = performance.now();
    const duration = 3000;
    function animate(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      rotationVal.set(progress * 720);
      if (progress < 1) requestAnimationFrame(animate);
      else setDone(true);
    }
    requestAnimationFrame(animate);
  };

  return (
    <div style={{ background: '#FFF7ED', padding: 16, textAlign: 'center' }}>
      <Title level={3} style={{ marginBottom: 16 }}>🌸 Offerings to Lord Vishnu</Title>

      <div style={{ position: 'relative', width: 250, height: 350, margin: '20px auto', border: '2px solid #FDBA74' }}>
        <img src={photo} alt="Lord Vishnu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

        {flowers.map((f) => (
          <motion.div
            key={f.id}
            initial={{ y: -50, opacity: 1 }}
            animate={{ y: 300, opacity: 0 }}
            transition={{ duration: 3, delay: f.delay }}
            style={{
              position: 'absolute',
              fontSize: 20,
              left: `${f.left}%`,
              top: '0%',
              pointerEvents: 'none',
            }}
          >
            🌸
          </motion.div>
        ))}

        {showDiya && !diyaComplete && (
          <motion.div style={{ position: 'absolute', inset: 0, rotate: diyaRotation }}>
            <motion.img
              src={diya}
              alt="Diya"
              style={{
                rotate: diyaCounter,
                width: 60,
                height: 60,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </motion.div>
        )}

        {showIncense && !incenseComplete && (
          <motion.div style={{ position: 'absolute', inset: 0, rotate: incenseRotation }}>
            <motion.img
              src={incense}
              alt="Incense"
              style={{
                rotate: incenseCounter,
                width: 60,
                height: 40,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </motion.div>
        )}

        {showKalash && !kalashComplete && (
          <motion.div style={{ position: 'absolute', inset: 0, rotate: kalashRotation }}>
            <motion.img
              src={kalash}
              alt="Kalash"
              style={{
                rotate: kalashCounter,
                width: 64,
                height: 32,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </motion.div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Button onClick={dropFlowers} shape="circle">🌸</Button>
        <Button onClick={() => animateItem(setShowDiya, diyaRotation, setDiyaComplete)} shape="circle" disabled={showDiya}>🪔</Button>
        <Button onClick={() => animateItem(setShowIncense, incenseRotation, setIncenseComplete)} shape="circle" disabled={showIncense}>
          <img src={incense} alt="incense" width={18} />
        </Button>
        <Button onClick={() => animateItem(setShowKalash, kalashRotation, setKalashComplete)} shape="circle" disabled={showKalash}>
          <img src={kalash} alt="kalash" width={18} />
        </Button>

        {/* ✅ NEW: Conch (Shankha) Sound Button */}
        <Button onClick={() => audioRef.current?.play()} shape="circle">
          🐚
        </Button>
      </div>

      {/* ✅ NEW: Hidden Audio Player */}
      <audio ref={audioRef} src="/pooja/shankha.mp3" preload="auto" />

      {/* Optional: TTS Player */}
      <TextToSpeechPlayer />

      <Button onClick={resetAll} icon={<RedoOutlined />} type="dashed" style={{ marginTop: 16 }}>
        Reset
      </Button>
    </div>
  );
}
