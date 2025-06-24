import React, { useState, useEffect } from 'react';
import { ChevronRight, Trophy, RotateCcw, BookOpen, GraduationCap, Clock, CheckCircle, XCircle, Star } from 'lucide-react';

const QuizApp = () => {
  const [currentScreen, setCurrentScreen] = useState('class-selection');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [error, setError] = useState('');

  const classes = ['6', '7', '8', '9', '10', '11', '12'];
  const subjects = ['Physics', 'Chemistry', 'Biology', 'Math'];

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleNextQuestion();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(
        `https://quiz-pcmq-with-malika-1.onrender.com/api/quiz?class=${selectedClass}&subject=${selectedSubject}&count=10`,
        // const response = await fetch(`https://quiz-pcmq-with-malika-1.onrender.com/api/quiz?class=${selectedClass}&subject=${selectedSubject}&count=10`);

        {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        // Better shuffling algorithm - Fisher-Yates shuffle
        const shuffledQuestions = [...data.data];
        for (let i = shuffledQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
        }
        
        // Also shuffle the options within each question
        const questionsWithShuffledOptions = shuffledQuestions.map(question => ({
          ...question,
          options: [...question.options].sort(() => Math.random() - 0.5)
        }));
        
        setQuestions(questionsWithShuffledOptions);
        setCurrentScreen('quiz');
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setScore(0);
        setQuizCompleted(false);
        setSelectedAnswer('');
        setTimeLeft(30); // 30 seconds per question
        setTimerActive(true);
      } else {
        throw new Error('No questions found for this class and subject combination');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      
      if (error.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.');
      } else if (error.message.includes('Failed to fetch')) {
        setError('Unable to connect to server. Please check if the server is running and try again.');
      } else {
        setError(error.message || 'Failed to fetch questions. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelection = (classNum) => {
    setSelectedClass(classNum);
    setCurrentScreen('subject-selection');
    setError(''); // Clear any previous errors
  };

  const handleSubjectSelection = (subject) => {
    setSelectedSubject(subject);
    setError(''); // Clear any previous errors
    fetchQuestions();
  };

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    const newAnswer = {
      question: currentQuestion.question,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      options: currentQuestion.options
    };

    setUserAnswers([...userAnswers, newAnswer]);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setTimeLeft(30);
    } else {
      setQuizCompleted(true);
      setCurrentScreen('results');
      setTimerActive(false);
    }
  };

  const handleRetakeQuiz = () => {
    fetchQuestions();
  };

  const handleBackToSelection = () => {
    setCurrentScreen('class-selection');
    setSelectedClass('');
    setSelectedSubject('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setUserAnswers([]);
    setScore(0);
    setQuizCompleted(false);
    setTimerActive(false);
    setError('');
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreEmoji = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return '🏆';
    if (percentage >= 80) return '🥇';
    if (percentage >= 70) return '🥈';
    if (percentage >= 60) return '🥉';
    return '📚';
  };

  // Class Selection Screen
  if (currentScreen === 'class-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl border border-gray-100">
          <div className="text-center mb-8">
            <GraduationCap className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-700 mb-2">Quiz Master</h1>
            <p className="text-gray-500">Choose your class to begin</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {classes.map((classNum) => (
              <button
                key={classNum}
                onClick={() => handleClassSelection(classNum)}
                className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-6 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <div className="text-2xl mb-2">Class</div>
                <div className="text-3xl">{classNum}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Subject Selection Screen
  if (currentScreen === 'subject-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl border border-gray-100">
          <div className="text-center mb-8">
            <BookOpen className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-700 mb-2">Class {selectedClass}</h1>
            <p className="text-gray-500">Choose your subject</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => handleSubjectSelection(subject)}
                disabled={loading}
                className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-bold py-6 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                <span className="text-xl">{subject}</span>
                <ChevronRight className="w-6 h-6 ml-2" />
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentScreen('class-selection')}
            className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
          >
            Back to Class Selection
          </button>
          
          {loading && (
            <div className="text-center mt-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <p className="text-gray-500 mt-2">Loading questions...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Quiz Screen
  if (currentScreen === 'quiz' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-3xl border border-gray-100">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-400">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-indigo-500">
                <Clock className="w-5 h-5 mr-1" />
                <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm text-gray-400">
                Class {selectedClass} • {selectedSubject}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-indigo-400 to-purple-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 leading-relaxed">
              {currentQuestion.question}
            </h2>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelection(option)}
                  className={`w-full p-4 text-left rounded-xl transition-all duration-300 border-2 ${
                    selectedAnswer === option
                      ? 'border-indigo-400 bg-indigo-50 shadow-md transform scale-105'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswer === option
                        ? 'border-indigo-400 bg-indigo-400'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === option && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-lg">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
            className="w-full bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ChevronRight className="w-6 h-6 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  // Results Screen
  if (currentScreen === 'results') {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{getScoreEmoji()}</div>
            <h1 className="text-4xl font-bold text-gray-700 mb-2">Quiz Complete!</h1>
            <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
              {score}/{questions.length}
            </div>
            <div className={`text-2xl font-semibold ${getScoreColor()}`}>
              {percentage}% Score
            </div>
            <p className="text-gray-500 mt-2">Class {selectedClass} • {selectedSubject}</p>
          </div>

          {/* Detailed Results */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">Review Your Answers</h3>
            <div className="space-y-4">
              {userAnswers.map((answer, index) => (
                <div key={index} className={`p-4 rounded-xl border-2 ${
                  answer.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-gray-600">Q{index + 1}:</span>
                    {answer.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{answer.question}</p>
                  <div className="space-y-2">
                    <div className={`p-2 rounded ${
                      answer.isCorrect ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className="font-medium">Your answer: </span>
                      <span>{answer.selectedAnswer}</span>
                    </div>
                    {!answer.isCorrect && (
                      <div className="p-2 rounded bg-green-100">
                        <span className="font-medium">Correct answer: </span>
                        <span>{answer.correctAnswer}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRetakeQuiz}
              className="flex-1 bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
            >
              <RotateCcw className="w-6 h-6 mr-2" />
              Retake Quiz
            </button>
            <button
              onClick={handleBackToSelection}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
            >
              <Star className="w-6 h-6 mr-2" />
              New Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;