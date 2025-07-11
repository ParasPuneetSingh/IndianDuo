import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Trophy, Target, TrendingUp, Award, Users, Settings } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { languages } = useLanguage();

  const getLearningLanguage = () => {
    return languages.find(lang => lang.code === user?.learning_language);
  };

  const getNativeLanguage = () => {
    return languages.find(lang => lang.code === user?.native_language);
  };

  const learningLang = getLearningLanguage();
  const nativeLang = getNativeLanguage();

  const stats = [
    {
      icon: <Trophy className="w-6 h-6" />,
      label: 'Total XP',
      value: user?.total_xp || 0,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      icon: <Target className="w-6 h-6" />,
      label: 'Current Streak',
      value: `${user?.current_streak || 0} days`,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Level',
      value: user?.level || 1,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: 'Achievements',
      value: user?.achievements?.length || 0,
      color: 'text-green-600 bg-green-100'
    }
  ];

  const achievements = [
    { id: 1, title: 'First Lesson', description: 'Complete your first lesson', unlocked: true },
    { id: 2, title: 'Week Warrior', description: 'Maintain a 7-day streak', unlocked: false },
    { id: 3, title: 'Grammar Master', description: 'Complete all grammar lessons', unlocked: false },
    { id: 4, title: 'Speaking Star', description: 'Complete 10 speaking exercises', unlocked: false },
    { id: 5, title: 'Perfect Score', description: 'Get 100% on a lesson', unlocked: false },
    { id: 6, title: 'Dedicated Learner', description: 'Learn for 30 consecutive days', unlocked: false },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="card p-6 mb-8">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-3xl">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Joined {formatDate(user?.created_at)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {user?.friends?.length || 0} friends
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                  {stat.icon}
                </div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Progress */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Learning Progress</h2>
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl">{learningLang?.flag}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{learningLang?.name}</h3>
                <p className="text-gray-600">{learningLang?.native_name}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Level {user?.level}</span>
                <span>{user?.total_xp} XP</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full progress-bar" 
                  style={{ width: `${Math.min(100, ((user?.total_xp || 0) % 100))}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600">
                {100 - ((user?.total_xp || 0) % 100)} XP to next level
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Native Language</h2>
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl">{nativeLang?.flag}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{nativeLang?.name}</h3>
                <p className="text-gray-600">{nativeLang?.native_name}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Last Activity</span>
                <span>{formatDate(user?.last_lesson_date)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Longest Streak</span>
                <span>{user?.longest_streak || 0} days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Achievements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.unlocked 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      achievement.unlocked ? 'text-green-900' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${
                      achievement.unlocked ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="font-medium text-gray-900">Account Settings</h3>
                  <p className="text-sm text-gray-600">Manage your account and preferences</p>
                </div>
              </div>
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                Edit
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="font-medium text-gray-900">Learning Goals</h3>
                  <p className="text-sm text-gray-600">Set your daily learning targets</p>
                </div>
              </div>
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                Set Goals
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="font-medium text-gray-900">Friends & Social</h3>
                  <p className="text-sm text-gray-600">Connect with other learners</p>
                </div>
              </div>
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;