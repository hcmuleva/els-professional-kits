import { useContext, useEffect, useState } from "react";
import { getExamWithId } from "../../services/exam";
import { setUserResultData } from "../../services/result";
import { AuthContext } from "../../contexts/AuthContext";

export const QuizPlayer = ({ quiz, onBack, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [multimediaData, setMultimediaData] = useState({});
  const { user } = useContext(AuthContext);
  const [result, setResult] = useState({
    name: "",
    exam: quiz?.id || null,
    user: user?.id,
    result_details: {},
    marks: 0,
    rank1: 0,
    rank2: 0,
    rank3: 0,
    rank4: 0,
    attachment: null,
  });

  const transformQuestions = (apiQuestions) => {
    const allMultimediaData = {};

    apiQuestions.forEach((q) => {
      const questionData = q.attributes;
      if (questionData.option_multimedia?.data) {
        questionData.option_multimedia.data.forEach((media) => {
          allMultimediaData[media.id] = media.attributes;
        });
      }
    });

    setMultimediaData(allMultimediaData);

    return apiQuestions.map((q, index) => {
      const questionData = q.attributes;

      const options = questionData.json.options.map((option) => {
        const optionKey = Object.keys(option).find(
          (key) => !["isCorrect", "multimediaId"].includes(key)
        );

        let multimediaUrl = null;
        if (option.multimediaId && allMultimediaData[option.multimediaId]) {
          multimediaUrl = allMultimediaData[option.multimediaId].url;
        }

        return {
          text: option[optionKey],
          multimediaId: option.multimediaId,
          multimediaUrl: multimediaUrl,
          isCorrect: option.isCorrect,
        };
      });

      const correctAnswers = questionData.json.options
        .map((option, idx) => (option.isCorrect ? idx : null))
        .filter((idx) => idx !== null);

      return {
        id: q.id,
        question: questionData.title,
        description: questionData.description,
        type: questionData.quetype,
        options: options,
        correct:
          questionData.quetype === "SC" || questionData.quetype === "TF"
            ? correctAnswers[0]
            : correctAnswers,
        explanation: questionData.explaination_description,
      };
    });
  };

  useEffect(() => {
    const getQuestions = async () => {
      try {
        setLoading(true);
        const examId = quiz?.id;
        const res = await getExamWithId(examId);
        console.log(res?.data, "ALL QUESTION");

        if (res?.data?.attributes?.questions?.data) {
          const transformedQuestions = transformQuestions(
            res.data.attributes.questions.data
          );
          setQuestions(transformedQuestions);

          const initialResultDetails = {};
          transformedQuestions.forEach((q) => {
            initialResultDetails[q.id] = {
              question: q.question,
              selectedAnswer: null,
              correctAnswer: q.correct,
              isCorrect: false,
              timeSpent: 0,
            };
          });

          setResult((prev) => ({
            ...prev,
            result_details: initialResultDetails,
          }));
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };
    getQuestions();
  }, [quiz?.id]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted && !loading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted && !loading) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted, loading]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    const currentQ = questions.find((q) => q.id === questionId);

    if (currentQ.type === "MCQ") {
      const currentAnswers = Array.isArray(answers[questionId])
        ? answers[questionId]
        : [];
      let newAnswers;

      if (currentAnswers.includes(answerIndex)) {
        newAnswers = currentAnswers.filter((idx) => idx !== answerIndex);
      } else {
        newAnswers = [...currentAnswers, answerIndex];
      }

      setAnswers((prev) => ({ ...prev, [questionId]: newAnswers }));

      setResult((prev) => ({
        ...prev,
        result_details: {
          ...prev.result_details,
          [questionId]: {
            ...prev.result_details[questionId],
            selectedAnswer: newAnswers,
          },
        },
      }));
    } else {
      setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
      setResult((prev) => ({
        ...prev,
        result_details: {
          ...prev.result_details,
          [questionId]: {
            ...prev.result_details[questionId],
            selectedAnswer: answerIndex,
          },
        },
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    let totalQuestions = questions.length;
    const updatedResultDetails = { ...result.result_details };

    questions.forEach((question) => {
      const selectedAnswer = answers[question.id];
      let isCorrect = false;

      if (question.type === "SC" || question.type === "TF") {
        isCorrect = selectedAnswer === question.correct;
      } else if (question.type === "MCQ") {
        const selectedArray = Array.isArray(selectedAnswer)
          ? selectedAnswer.sort()
          : [];
        const correctArray = Array.isArray(question.correct)
          ? question.correct.sort()
          : [];
        isCorrect =
          selectedArray.length === correctArray.length &&
          selectedArray.every((val, idx) => val === correctArray[idx]);
      }

      updatedResultDetails[question.id] = {
        ...updatedResultDetails[question.id],
        selectedAnswer,
        isCorrect,
      };

      if (isCorrect) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);

    return {
      correctCount,
      totalQuestions,
      percentage,
      updatedResultDetails,
    };
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);

    const scoreData = calculateScore();

    const finalResult = {
      ...result,
      name: `${quiz.title} - Result`,
      marks: scoreData.percentage,
      result_details: scoreData.updatedResultDetails,
      // rank1: scoreData.correctCount,
      // rank2: scoreData.totalQuestions,
      // rank3: scoreData.percentage,
      // rank4: timeLeft,
    };

    setResult(finalResult);

    const res = await setUserResultData(finalResult);

    console.log("Final Result Object:", res);

    setTimeout(() => onComplete(scoreData.percentage, finalResult), 2000);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "16px",
            padding: "40px",
            maxWidth: "500px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>📚</div>
          <h2
            style={{
              margin: "0 0 16px 0",
              color: "#333",
              fontSize: "28px",
              fontWeight: "600",
            }}
          >
            Loading Quiz...
          </h2>
          <p style={{ color: "#666", fontSize: "18px", marginBottom: "30px" }}>
            Preparing your questions...
          </p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "16px",
            padding: "40px",
            maxWidth: "500px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>❌</div>
          <h2
            style={{
              margin: "0 0 16px 0",
              color: "#333",
              fontSize: "28px",
              fontWeight: "600",
            }}
          >
            No Questions Found
          </h2>
          <p style={{ color: "#666", fontSize: "18px", marginBottom: "30px" }}>
            This quiz doesn't have any questions yet.
          </p>
          <button
            onClick={onBack}
            style={{
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Back to Quiz List
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "16px",
            padding: "40px",
            maxWidth: "500px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
          <h2
            style={{
              margin: "0 0 16px 0",
              color: "#333",
              fontSize: "28px",
              fontWeight: "600",
            }}
          >
            Quiz Completed!
          </h2>
          <p style={{ color: "#666", fontSize: "18px", marginBottom: "30px" }}>
            Processing your results...
          </p>
          <div
            style={{
              width: "100%",
              height: "4px",
              background: "rgba(102, 126, 234, 0.2)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                animation: "loading 2s ease-in-out",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div>
            <h2
              style={{
                margin: "0",
                color: "#333",
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              {quiz.title}
            </h2>
            <p style={{ margin: "4px 0 0 0", color: "#666" }}>
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                background:
                  timeLeft < 300
                    ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "12px",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              ⏰ {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Question */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "16px",
            padding: "30px",
            marginBottom: "20px",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                margin: "0",
                color: "#333",
                fontSize: "22px",
                lineHeight: "1.5",
                flex: 1,
              }}
            >
              {currentQ.question}
            </h3>
            <span
              style={{
                background:
                  currentQ.type === "MCQ"
                    ? "#ff9500"
                    : currentQ.type === "TF"
                    ? "#34C759"
                    : "#007AFF",
                color: "white",
                fontSize: "12px",
                fontWeight: "600",
                padding: "4px 8px",
                borderRadius: "6px",
                marginLeft: "12px",
              }}
            >
              {currentQ.type === "MCQ"
                ? "Multiple Choice"
                : currentQ.type === "TF"
                ? "True/False"
                : "Single Choice"}
            </span>
          </div>

          {currentQ.description && (
            <p
              style={{
                color: "#666",
                fontSize: "16px",
                marginBottom: "30px",
                fontStyle: "italic",
              }}
            >
              {currentQ.description}
            </p>
          )}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {currentQ.options.map((option, index) => {
              const isSelected =
                currentQ.type === "MCQ"
                  ? Array.isArray(answers[currentQ.id]) &&
                    answers[currentQ.id].includes(index)
                  : answers[currentQ.id] === index;

              return (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(currentQ.id, index)}
                  style={{
                    padding: "16px 20px",
                    border: `2px solid ${
                      isSelected ? "#667eea" : "rgba(102, 126, 234, 0.2)"
                    }`,
                    borderRadius: "12px",
                    background: isSelected
                      ? "rgba(102, 126, 234, 0.1)"
                      : "transparent",
                    color: "#333",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    {/* Selection indicator */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: "24px",
                      }}
                    >
                      {currentQ.type === "MCQ" ? (
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            border: `2px solid ${
                              isSelected ? "#667eea" : "#ccc"
                            }`,
                            borderRadius: "3px",
                            background: isSelected ? "#667eea" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isSelected && (
                            <div
                              style={{
                                color: "white",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              ✓
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            border: `2px solid ${
                              isSelected ? "#667eea" : "#ccc"
                            }`,
                            borderRadius: "50%",
                            background: isSelected ? "#667eea" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isSelected && (
                            <div
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "white",
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                        }}
                      >
                        <span style={{ fontWeight: "600", color: "#667eea" }}>
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "16px",
                              marginBottom: option.multimediaUrl ? "12px" : "0",
                            }}
                          >
                            {option.text}
                          </div>

                          {/* Multimedia Image - Updated to use the correct URL from multimedia data */}
                          {option.multimediaUrl && (
                            <div style={{ marginTop: "8px" }}>
                              <img
                                src={option.multimediaUrl}
                                alt={`Option ${String.fromCharCode(
                                  65 + index
                                )}`}
                                style={{
                                  maxWidth: "100px",
                                  maxHeight: "100px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                  border: "1px solid #e0e0e0",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                }}
                                onError={(e) => {
                                  console.log(
                                    `Failed to load image: ${option.multimediaUrl}`
                                  );
                                  e.target.style.display = "none";
                                }}
                                onLoad={() => {
                                  console.log(
                                    `Successfully loaded image: ${option.multimediaUrl}`
                                  );
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Multi-select instruction */}
          {currentQ.type === "MCQ" && (
            <div
              style={{
                marginTop: "16px",
                fontSize: "14px",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              💡 You can select multiple answers for this question
            </div>
          )}
        </div>

        {/* Navigation */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <button
            onClick={onBack}
            style={{
              padding: "12px 24px",
              border: "1px solid #667eea",
              borderRadius: "8px",
              background: "transparent",
              color: "#667eea",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            ← Back to Quiz List
          </button>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                background: currentQuestion === 0 ? "#ccc" : "#f5f5f5",
                color: currentQuestion === 0 ? "#999" : "#333",
                fontSize: "16px",
                fontWeight: "500",
                cursor: currentQuestion === 0 ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
              }}
            >
              ← Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
