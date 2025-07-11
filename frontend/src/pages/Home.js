import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, Book, Users, Trophy, Star, ArrowRight } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Book className="w-8 h-8" />,
      title: 'Interactive Lessons',
      description: 'Learn through engaging exercises designed for Indian languages'
    },
    {
      icon: <Play className="w-8 h-8" />,
      title: 'Speaking Practice',
      description: 'Perfect your pronunciation with AI-powered speech recognition'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Social Learning',
      description: 'Learn with friends and compete on leaderboards'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Achievement System',
      description: 'Earn XP, maintain streaks, and unlock achievements'
    }
  ];

  const languages = [
    { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
    { name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
    { name: 'Sanskrit', native: 'संस्कृत', flag: '🇮🇳' },
    { name: 'English', native: 'English', flag: '🇬🇧' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section indian-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Learn Indian Languages
              <br />
              <span className="text-yellow-300">Like Never Before</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Master Hindi, Tamil, Telugu, Bengali, and more with our interactive lessons, 
              pronunciation guides, and cultural insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
                  Continue Learning
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
                    Start Learning Free
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </Link>
                  <Link to="/login" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose IndianDuo?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the most effective way to learn Indian languages with our proven methodology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="text-primary-500 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Learn Multiple Indian Languages
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive collection of Indian languages
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {languages.map((language, index) => (
              <div key={index} className="language-card card p-6 text-center cursor-pointer">
                <div className="text-4xl mb-3">{language.flag}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {language.name}
                </h3>
                <p className="text-primary-600 font-medium">
                  {language.native}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-xl text-blue-100">Active Learners</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-xl text-blue-100">Indian Languages</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">50M+</div>
              <div className="text-xl text-blue-100">Lessons Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join millions of learners discovering the beauty of Indian languages
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn-primary px-8 py-3 text-lg">
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;