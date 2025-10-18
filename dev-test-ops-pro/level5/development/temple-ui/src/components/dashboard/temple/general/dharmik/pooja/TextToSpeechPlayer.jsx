import React, { useState, useRef } from 'react';
import { Button, Input, Typography, message, Space } from 'antd';
import { convertTTS } from '../../../../../../services/temple';

const { TextArea } = Input;
const { Title } = Typography;

const TextToSpeechPlayer = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      message.warning('Please enter some text');
      return;
    }

    const filename = `tts_${text.slice(0, 10).replace(/\s/g, '_')}.mp3`;
    const baseUrl = process.env.REACT_APP_API_URL.replace(/\/api$/, '');
    const fullUrl = `${baseUrl}/uploads/${filename}`;

    // ✅ First, check in localStorage
    const cached = localStorage.getItem(filename);
    if (cached) {
      setAudioUrl(cached);
      playAudio(cached);
      return;
    }

    // ✅ Then, check if file exists on server
    try {
      setLoading(true);
      const exists = await checkIfFileExists(fullUrl);
      if (exists) {
        localStorage.setItem(filename, fullUrl);
        setAudioUrl(fullUrl);
        playAudio(fullUrl);
        return;
      }
    } catch (err) {
      console.warn("File check failed, will proceed to generate");
    }

    // ❌ If file doesn't exist, call TTS API
    try {
      const result = await convertTTS(text, filename);
      const relativeUrl = result?.url;
      if (!relativeUrl) throw new Error('Audio URL not returned');

      const finalUrl = `${baseUrl}${relativeUrl}`;
      setAudioUrl(finalUrl);
      localStorage.setItem(filename, finalUrl);
      playAudio(finalUrl);
    } catch (err) {
      console.error(err);
      message.error(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const checkIfFileExists = async (url) => {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const playAudio = (url) => {
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play().catch((err) => {
        console.error('Audio play error:', err);
      });
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: 'auto' }}>
      <Title level={4}>🗣️ Text to Speech</Title>
      <Space direction="vertical" style={{ width: '100%' }}>
        <TextArea
          rows={4}
          placeholder="Enter text to convert to speech"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="primary" onClick={handleGenerate} loading={loading}>
          Generate & Play Audio
        </Button>
        <audio ref={audioRef} controls style={{ width: '100%', marginTop: 12 }} />
      </Space>
    </div>
  );
};

export default TextToSpeechPlayer;
