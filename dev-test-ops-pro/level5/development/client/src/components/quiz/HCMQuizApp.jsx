import { useState, useEffect } from "react";
import AgeGroupSelector from "./AgeGroupSelector";
import { Button } from "antd";
import { LeftOutlined, UserOutlined, BookOutlined, TeamOutlined } from "@ant-design/icons";
import SocialQuizApp from "./SocialQuizApp";

export default function BilingualQuizApp() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
  const [isInCycleMode, setIsInCycleMode] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  
  // Separate progress tracking for each age group
  const [ageGroupProgress, setAgeGroupProgress] = useState({
    kids: {
      currentQuestionIndex: 0,
      answeredQuestions: [],
      score: 0,
      completed: false
    },
    students: {
      currentQuestionIndex: 0,
      answeredQuestions: [],
      score: 0,
      completed: false
    },
    elderly: {
      currentQuestionIndex: 0,
      answeredQuestions: [],
      score: 0,
      completed: false
    }
  });

  // Age groups in cycle order
  const ageGroupCycle = [
    { key: 'kids', label: 'बच्चे / Kids', icon: <UserOutlined /> },
    { key: 'students', label: 'छात्र / Students', icon: <BookOutlined /> },
    { key: 'elderly', label: 'बुजुर्ग / Elderly', icon: <TeamOutlined /> }
  ];

  const handleAgeGroupSelect = (ageGroup) => {
    setSelectedAgeGroup(ageGroup);
    setShowQuiz(true);
    
    // If this is the first selection, start cycle mode
    if (!isInCycleMode) {
      setIsInCycleMode(true);
      const cycleIndex = ageGroupCycle.findIndex(group => group.key === ageGroup);
      setCurrentCycleIndex(cycleIndex >= 0 ? cycleIndex : 0);
    }
  };

  const handleBackToAgeSelection = () => {
    setShowQuiz(false);
  };

  // Update progress for specific age group
  const updateAgeGroupProgress = (ageGroup, progressData) => {
    setAgeGroupProgress(prev => ({
      ...prev,
      [ageGroup]: {
        ...prev[ageGroup],
        ...progressData
      }
    }));
  };

  // Handle when current age group completes a question
  const handleQuestionComplete = (questionData) => {
    const currentAgeGroup = ageGroupCycle[currentCycleIndex].key;
    const currentProgress = ageGroupProgress[currentAgeGroup];
    
    updateAgeGroupProgress(currentAgeGroup, {
      currentQuestionIndex: currentProgress.currentQuestionIndex + 1,
      answeredQuestions: [...currentProgress.answeredQuestions, questionData],
      score: currentProgress.score + (questionData.correct ? 1 : 0)
    });
  };

  // Move to next age group in cycle
  const handleNextAgeGroup = () => {
    const nextIndex = (currentCycleIndex + 1) % ageGroupCycle.length;
    
    // If we've completed a full cycle, increment round
    if (nextIndex === 0) {
      setCurrentRound(prev => prev + 1);
    }
    
    setCurrentCycleIndex(nextIndex);
    const nextAgeGroup = ageGroupCycle[nextIndex].key;
    setSelectedAgeGroup(nextAgeGroup);
    setShowQuiz(true);
  };

  // Reset entire cycle and progress
  const handleResetCycle = () => {
    setIsInCycleMode(false);
    setSelectedAgeGroup(null);
    setCurrentCycleIndex(0);
    setCurrentRound(1);
    setShowQuiz(false);
    
    // Reset all progress
    setAgeGroupProgress({
      kids: { currentQuestionIndex: 0, answeredQuestions: [], score: 0, completed: false },
      students: { currentQuestionIndex: 0, answeredQuestions: [], score: 0, completed: false },
      elderly: { currentQuestionIndex: 0, answeredQuestions: [], score: 0, completed: false }
    });
  };

  // Mark current age group as completed for this round
  const handleAgeGroupRoundComplete = () => {
    const currentAgeGroup = ageGroupCycle[currentCycleIndex].key;
    updateAgeGroupProgress(currentAgeGroup, { completed: true });
    setShowQuiz(false);
  };

  // Get current age group progress
  const getCurrentProgress = () => {
    if (!selectedAgeGroup) return null;
    return ageGroupProgress[selectedAgeGroup];
  };

  // If in cycle mode and not showing quiz, show cycle navigation
  if (isInCycleMode && !showQuiz) {
    const currentGroup = ageGroupCycle[currentCycleIndex];
    const nextGroup = ageGroupCycle[(currentCycleIndex + 1) % ageGroupCycle.length];
    const currentProgress = ageGroupProgress[currentGroup.key];
    const isNextRound = (currentCycleIndex + 1) % ageGroupCycle.length === 0;
    
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          maxWidth: '600px',
          width: '100%'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            marginBottom: '20px',
            color: '#333'
          }}>
            राउंड {currentRound} / Round {currentRound}
          </h2>
          
          {/* Progress Summary */}
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '30px'
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#555' }}>
              प्रगति सारांश / Progress Summary
            </h3>
            {ageGroupCycle.map((group, index) => {
              const progress = ageGroupProgress[group.key];
              const isCurrentGroup = index === currentCycleIndex;
              return (
                <div key={group.key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  margin: '5px 0',
                  borderRadius: '8px',
                  background: isCurrentGroup ? '#e3f2fd' : '#fff',
                  border: isCurrentGroup ? '2px solid #1976d2' : '1px solid #e0e0e0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {group.icon}
                    <span style={{ fontWeight: isCurrentGroup ? 'bold' : 'normal' }}>
                      {group.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    प्रश्न: {progress.currentQuestionIndex} | स्कोर: {progress.score}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            background: '#e8f5e8',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '30px'
          }}>
            <div style={{ fontSize: '16px', marginBottom: '10px', color: '#666' }}>
              पूर्ण समूह / Completed Group:
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: '#2e7d32',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              {currentGroup.icon}
              {currentGroup.label}
            </div>
            <div style={{ fontSize: '14px', color: '#555' }}>
              प्रश्न उत्तर दिए: {currentProgress.currentQuestionIndex} | 
              स्कोर: {currentProgress.score}
            </div>
          </div>

          <div style={{
            background: '#fff3e0',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '30px'
          }}>
            <div style={{ fontSize: '16px', marginBottom: '10px', color: '#666' }}>
              {isNextRound ? 'अगला राउंड शुरू / Next Round Starts:' : 'अगला समूह / Next Group:'}
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: '#f57c00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              {nextGroup.icon}
              {nextGroup.label}
              {isNextRound && <span style={{ fontSize: '16px', marginLeft: '10px' }}>
                (राउंड {currentRound + 1})
              </span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
            <Button
              type="primary"
              size="large"
              onClick={handleNextAgeGroup}
              style={{
                height: '50px',
                fontSize: '16px',
                borderRadius: '8px',
                background: '#4CAF50',
                borderColor: '#4CAF50'
              }}
            >
              {isNextRound ? 
                `राउंड ${currentRound + 1} शुरू करें / Start Round ${currentRound + 1}` :
                'अगले समूह के लिए प्रश्न / Next Group Questions'
              }
            </Button>
            
            <Button
              size="large"
              onClick={() => setShowQuiz(true)}
              style={{
                height: '50px',
                fontSize: '16px',
                borderRadius: '8px'
              }}
            >
              वर्तमान समूह जारी रखें / Continue Current Group
            </Button>
            
            <Button
              size="large"
              onClick={handleResetCycle}
              style={{
                height: '50px',
                fontSize: '16px',
                borderRadius: '8px',
                color: '#f44336',
                borderColor: '#f44336'
              }}
            >
              नया चक्र शुरू करें / Start New Cycle
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Initial age group selection
  if (!showQuiz && !isInCycleMode) {
    return <AgeGroupSelector onAgeGroupSelect={handleAgeGroupSelect} />;
  }

  // Quiz view
  return (
    <div>
      {/* Back Button */}
      <div
        style={{
          position: "fixed",
          top: "24px",
          left: "24px",
          zIndex: 1000,
        }}
      >
        <Button
          icon={<LeftOutlined />}
          onClick={handleBackToAgeSelection}
          size="large"
          style={{
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          वापस जाएं / Go Back
        </Button>
      </div>

      {/* Current Status Indicator */}
      <div
        style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: 1000,
        }}
      >
        <div style={{
          background: 'white',
          padding: '12px 20px',
          borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          fontSize: '14px',
          minWidth: '200px'
        }}>
          <div style={{ fontWeight: 'bold', color: '#4a5568', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {ageGroupCycle.find(group => group.key === selectedAgeGroup)?.icon}
            {ageGroupCycle.find(group => group.key === selectedAgeGroup)?.label}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            राउंड {currentRound} | प्रश्न {getCurrentProgress()?.currentQuestionIndex + 1 || 1} | 
            स्कोर {getCurrentProgress()?.score || 0}
          </div>
        </div>
      </div>

      <SocialQuizApp 
        ageGroup={selectedAgeGroup}
        currentQuestionIndex={getCurrentProgress()?.currentQuestionIndex || 0}
        previousAnswers={getCurrentProgress()?.answeredQuestions || []}
        onQuestionComplete={handleQuestionComplete}
        onBackToAgeSelection={handleBackToAgeSelection}
        onAgeGroupRoundComplete={handleAgeGroupRoundComplete}
      />
    </div>
  );
}