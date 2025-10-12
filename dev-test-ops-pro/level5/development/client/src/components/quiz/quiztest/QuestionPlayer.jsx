/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { message } from "antd";
import { getAllQuestions } from "../../../services/questions";
import { QuestionBrowser } from "./QuizBrowser";
import { QuizResult } from "./QuizResult";
import { QuizPlayer } from "./QuizPlayer";

export default function QuestionPlayer() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(undefined);
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [selectedQuestionType, setSelectedQuestionType] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("en");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // App states
  const [currentView, setCurrentView] = useState("browse"); // browse, quiz, result
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizSummary, setQuizSummary] = useState(null);

  // Fetch questions on component mount or page change
  useEffect(() => {
    fetchQuestions();
  }, [currentPage]);

  const fetchQuestions = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await getAllQuestions({
        ...filters,
        page: currentPage,
        pageSize,
      });
      if (response && response.data) {
        setQuestions(response.data);
        setFilteredQuestions(response.data);
        setTotalQuestions(response.meta?.pagination?.total || 0);
      } else {
        setQuestions([]);
        setFilteredQuestions([]);
        setTotalQuestions(0);
        message.error(
          language === "en"
            ? "No questions available"
            : "कोई प्रश्न उपलब्ध नहीं"
        );
      }
    } catch (error) {
      setQuestions([]);
      setFilteredQuestions([]);
      setTotalQuestions(0);
      message.error(
        language === "en" ? "Failed to fetch questions" : "प्रश्न लाने में विफल"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter questions based on search and filters
  useEffect(() => {
    let filtered = questions;

    // Filter by difficulty level
    if (selectedLevel) {
      filtered = filtered.filter(
        (q) => q.attributes.question_level === selectedLevel
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (q) => q.attributes.question_category === selectedCategory
      );
    }

    // Filter by question type (SC/MCQ)
    if (selectedQuestionType) {
      filtered = filtered.filter(
        (q) => q.attributes.quetype === selectedQuestionType
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.attributes.title_en
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          q.attributes.title_hi.includes(searchTerm) ||
          q.attributes.question_category
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          q.attributes.question_level
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (q.attributes.quetype &&
            q.attributes.quetype
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredQuestions(filtered);
  }, [
    questions,
    selectedLevel,
    selectedCategory,
    selectedQuestionType,
    searchTerm,
  ]);

  const handleStartQuiz = (questionsToPlay) => {
    if (questionsToPlay.length === 0) {
      message.warning(
        language === "en" ? "No questions selected" : "कोई प्रश्न चयनित नहीं"
      );
      return;
    }
    setQuizQuestions(questionsToPlay);
    setCurrentView("quiz");

    const successMessage =
      language === "en"
        ? `Quiz started with ${questionsToPlay.length} question${
            questionsToPlay.length > 1 ? "s" : ""
          }!`
        : `${questionsToPlay.length} प्रश्न${
            questionsToPlay.length > 1 ? "ों" : ""
          } के साथ क्विज़ शुरू!`;

    message.success(successMessage);
  };

  const handlePlaySingle = (question) => {
    setQuizQuestions([question]);
    setCurrentView("quiz");
    message.success(
      language === "en"
        ? "Single question quiz started!"
        : "एकल प्रश्न क्विज़ शुरू!"
    );
  };

  const handleQuizComplete = (summary) => {
    setQuizSummary(summary);
    setCurrentView("result");

    const successMessage =
      language === "en"
        ? `Quiz Completed! Score: ${summary.correctAnswers}/${summary.totalQuestions}`
        : `क्विज़ पूर्ण! स्कोर: ${summary.correctAnswers}/${summary.totalQuestions}`;

    message.success(successMessage);
  };

  const handleReturnHome = () => {
    setCurrentView("browse");
    setQuizQuestions([]);
    setQuizSummary(null);
  };

  const resetFilters = () => {
    setSelectedLevel(undefined);
    setSelectedCategory(undefined);
    setSelectedQuestionType(undefined);
    setSearchTerm("");
    setCurrentPage(1);
    fetchQuestions();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Render based on current view
  if (currentView === "quiz") {
    return (
      <QuizPlayer
        questions={quizQuestions}
        language={language}
        setLanguage={setLanguage}
        onExit={handleReturnHome}
        onComplete={handleQuizComplete}
      />
    );
  }

  if (currentView === "result") {
    return (
      <QuizResult
        quizSummary={quizSummary}
        language={language}
        onReturnHome={handleReturnHome}
      />
    );
  }

  return (
    <QuestionBrowser
      questions={questions}
      filteredQuestions={filteredQuestions}
      loading={loading}
      selectedLevel={selectedLevel}
      setSelectedLevel={setSelectedLevel}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      selectedQuestionType={selectedQuestionType}
      setSelectedQuestionType={setSelectedQuestionType}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      language={language}
      setLanguage={setLanguage}
      onStartQuiz={handleStartQuiz}
      onPlaySingle={handlePlaySingle}
      resetFilters={resetFilters}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={handlePageChange}
      totalQuestions={totalQuestions}
    />
  );
}
