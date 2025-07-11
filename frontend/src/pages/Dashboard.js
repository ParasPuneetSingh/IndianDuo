import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Book, Play, Target, Trophy, Calendar, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { languages } = useLanguage();

  const quickStats = [
    { label: 'Total XP', value: user?.total_xp || 0, icon: <Trophy className="w-5 h-5" />, color: 'text-yellow-600' },
    { label: 'Current Streak', value: user?.current_streak || 0, icon: <Calendar className="w-5 h-5" />, color: 'text-orange-600' },
    { label: 'Level', value: user?.level || 1, icon: <TrendingUp className="w-5 h-5" />, color: 'text-blue-600' },
    { label: 'Hearts', value: user?.hearts || 5, icon: <Target className="w-5 h-5" />, color: 'text-red-600' }
  ];

  const getLearningLanguage = () => {
    return languages.find(lang => lang.code === user?.learning_language);
  };

  const getNativeLanguage = () => {
    return languages.find(lang => lang.code === user?.native_language);
  };

  const learningLang = getLearningLanguage();
  const nativeLang = getNativeLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Ready to continue your {learningLang?.name} journey?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="card p-6 text-center">
              <div className={`${stat.color} mb-2 flex justify-center`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Current Language Progress */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Current Progress</h2>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{learningLang?.flag}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{learningLang?.name}</h3>
                <p className="text-gray-600">{learningLang?.native_name}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">Level {user?.level}</div>
              <div className="text-sm text-gray-600">{user?.total_xp} XP</div>
            </div>
          </div>
          <div className="bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-primary-500 h-3 rounded-full progress-bar" 
              style={{ width: `${Math.min(100, ((user?.total_xp || 0) % 100))}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 text-center">
            {100 - ((user?.total_xp || 0) % 100)} XP to next level
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/learn" className="card p-6 hover:shadow-lg transition-shadow group">
            <div className="text-primary-500 mb-4">
              <Play className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Continue Learning</h3>
            <p className="text-gray-600 mb-4">
              Resume your lessons and make progress in {learningLang?.name}
            </p>
            <div className="text-primary-600 font-medium group-hover:text-primary-700">
              Start Lesson →
            </div>
          </Link>

          <div className="card p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <div className="text-yellow-600 mb-4">
              <Book className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Review & Practice</h3>
            <p className="text-gray-600 mb-4">
              Strengthen your knowledge with revision exercises
            </p>
            <div className="text-yellow-600 font-medium">
              Coming Soon
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="text-green-600 mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Achievements</h3>
            <p className="text-gray-600 mb-4">
              View your accomplishments and badges
            </p>
            <div className="text-green-600 font-medium">
              {user?.achievements?.length || 0} Unlocked
            </div>
          </div>
        </div>

        {/* Streak Section */}
        <div className="card p-6 mb-8 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🔥</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {user?.current_streak || 0} Day Streak
                </h3>
                <p className="text-gray-600">
                  Keep it up! Learning every day makes a difference.
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Best Streak</div>
              <div className="text-2xl font-bold text-orange-600">
                {user?.longest_streak || 0} days
              </div>
            </div>
          </div>
        </div>

        {/* Language Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning</h3>
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{learningLang?.flag}</div>
              <div>
                <div className="text-lg font-medium text-gray-900">{learningLang?.name}</div>
                <div className="text-gray-600">{learningLang?.native_name}</div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Native</h3>
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{nativeLang?.flag}</div>
              <div>
                <div className="text-lg font-medium text-gray-900">{nativeLang?.name}</div>
                <div className="text-gray-600">{nativeLang?.native_name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;