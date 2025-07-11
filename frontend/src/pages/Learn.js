import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Play, Lock, CheckCircle, Book, Headphones, Mic, PenTool } from 'lucide-react';

const Learn = () => {
  const { user } = useAuth();
  const { languages, selectedLanguage, selectLanguage } = useLanguage();
  const [currentUnit, setCurrentUnit] = useState('basics');

  useEffect(() => {
    if (user && languages.length > 0) {
      const learningLang = languages.find(lang => lang.code === user.learning_language);
      if (learningLang) {
        selectLanguage(learningLang);
      }
    }
  }, [user, languages, selectLanguage]);

  const units = [
    {
      id: 'basics',
      title: 'Basics',
      description: 'Learn fundamental words and phrases',
      color: 'bg-blue-500',
      lessons: [
        { id: 1, title: 'Greetings', type: 'reading', completed: true, locked: false },
        { id: 2, title: 'Family', type: 'reading', completed: false, locked: false },
        { id: 3, title: 'Numbers', type: 'listening', completed: false, locked: true },
        { id: 4, title: 'Colors', type: 'writing', completed: false, locked: true },
        { id: 5, title: 'Food', type: 'speaking', completed: false, locked: true },
      ]
    },
    {
      id: 'phrases',
      title: 'Common Phrases',
      description: 'Essential phrases for daily conversation',
      color: 'bg-green-500',
      lessons: [
        { id: 6, title: 'Introductions', type: 'speaking', completed: false, locked: true },
        { id: 7, title: 'Asking Questions', type: 'reading', completed: false, locked: true },
        { id: 8, title: 'Directions', type: 'listening', completed: false, locked: true },
        { id: 9, title: 'Shopping', type: 'writing', completed: false, locked: true },
        { id: 10, title: 'Time', type: 'reading', completed: false, locked: true },
      ]
    },
    {
      id: 'grammar',
      title: 'Grammar Basics',
      description: 'Understand sentence structure and grammar',
      color: 'bg-purple-500',
      lessons: [
        { id: 11, title: 'Sentence Structure', type: 'writing', completed: false, locked: true },
        { id: 12, title: 'Verbs', type: 'reading', completed: false, locked: true },
        { id: 13, title: 'Adjectives', type: 'writing', completed: false, locked: true },
        { id: 14, title: 'Pronouns', type: 'reading', completed: false, locked: true },
        { id: 15, title: 'Tenses', type: 'writing', completed: false, locked: true },
      ]
    }
  ];

  const getIconForType = (type) => {
    switch (type) {
      case 'reading':
        return <Book className="w-4 h-4" />;
      case 'writing':
        return <PenTool className="w-4 h-4" />;
      case 'listening':
        return <Headphones className="w-4 h-4" />;
      case 'speaking':
        return <Mic className="w-4 h-4" />;
      default:
        return <Book className="w-4 h-4" />;
    }
  };

  const getLessonProgress = (lessonId) => {
    // This would come from user progress data
    return 0;
  };

  const handleLessonClick = (lesson) => {
    if (lesson.locked) return;
    
    // For now, just show an alert - in a real app, this would navigate to the lesson
    alert(`Starting lesson: ${lesson.title}`);
  };

  if (!selectedLanguage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl">{selectedLanguage.flag}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedLanguage.name}</h1>
              <p className="text-gray-600">{selectedLanguage.native_name}</p>
            </div>
          </div>
          <div className="bg-gray-200 rounded-full h-3">
            <div 
              className="bg-primary-500 h-3 rounded-full progress-bar" 
              style={{ width: '15%' }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">15% Complete</p>
        </div>

        {/* Units */}
        <div className="space-y-8">
          {units.map((unit) => (
            <div key={unit.id} className="card p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-12 h-12 ${unit.color} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">
                    {unit.id === 'basics' ? '1' : unit.id === 'phrases' ? '2' : '3'}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{unit.title}</h2>
                  <p className="text-gray-600">{unit.description}</p>
                </div>
              </div>

              {/* Lessons */}
              <div className="grid gap-4">
                {unit.lessons.map((lesson) => (
                  <div 
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    className={`lesson-card ${lesson.completed ? 'completed' : ''} ${lesson.locked ? 'locked' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          lesson.completed ? 'bg-green-100 text-green-600' : 
                          lesson.locked ? 'bg-gray-100 text-gray-400' : 'bg-primary-100 text-primary-600'
                        }`}>
                          {lesson.completed ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : lesson.locked ? (
                            <Lock className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            {getIconForType(lesson.type)}
                            <span className="capitalize">{lesson.type}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!lesson.locked && !lesson.completed && (
                          <div className="progress-circle" style={{ '--progress': `${getLessonProgress(lesson.id) * 3.6}deg` }}>
                            <span className="progress-text">{getLessonProgress(lesson.id)}%</span>
                          </div>
                        )}
                        {lesson.completed && (
                          <div className="text-green-600 text-sm font-medium">
                            Completed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="card p-6 mt-8 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">More Units Coming Soon!</h2>
            <p className="text-gray-600">
              Continue learning to unlock advanced grammar, conversation practice, and cultural lessons.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;