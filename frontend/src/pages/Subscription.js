import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, Crown, Users, Star, Zap, Shield, Download, Heart } from 'lucide-react';
import axios from 'axios';

const Subscription = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    loadPlans();
    loadCurrentSubscription();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/subscription/plans`);
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to load plans:', error);
    }
  };

  const loadCurrentSubscription = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/subscription/current`);
      setCurrentSubscription(response.data);
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPlan = async (planId) => {
    setSubscribing(true);
    try {
      await axios.post(`${API_BASE_URL}/api/subscription/subscribe`, null, {
        params: { plan_id: planId }
      });
      
      // Reload subscription data
      await loadCurrentSubscription();
      
      // Show success message
      alert('Subscription successful! Welcome to IndianDuo Plus!');
    } catch (error) {
      console.error('Subscription failed:', error);
      alert('Subscription failed. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const cancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/subscription/cancel`);
      await loadCurrentSubscription();
      alert('Subscription cancelled successfully.');
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    }
  };

  const getPlanIcon = (planName) => {
    switch (planName) {
      case 'Free':
        return <Heart className="w-8 h-8 text-red-500" />;
      case 'IndianDuo Plus':
        return <Crown className="w-8 h-8 text-yellow-500" />;
      case 'Family Plan':
        return <Users className="w-8 h-8 text-blue-500" />;
      default:
        return <Star className="w-8 h-8 text-gray-500" />;
    }
  };

  const getPlanColor = (planName) => {
    switch (planName) {
      case 'Free':
        return 'border-gray-300 bg-gray-50';
      case 'IndianDuo Plus':
        return 'border-yellow-400 bg-yellow-50';
      case 'Family Plan':
        return 'border-blue-400 bg-blue-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  const isCurrentPlan = (planName) => {
    if (!currentSubscription) return false;
    return currentSubscription.plan?.name === planName;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Learning Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock your full potential with IndianDuo Plus. Learn faster, practice more, and achieve fluency.
          </p>
        </div>

        {/* Current Subscription Status */}
        {currentSubscription && (
          <div className="card p-6 mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getPlanIcon(currentSubscription.plan?.name)}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Current Plan: {currentSubscription.plan?.name}
                  </h3>
                  <p className="text-gray-600">
                    {currentSubscription.status === 'free' ? 
                      'You are on the free plan' : 
                      `Active until ${new Date(currentSubscription.subscription?.expires_at).toLocaleDateString()}`
                    }
                  </p>
                </div>
              </div>
              {currentSubscription.status !== 'free' && (
                <button
                  onClick={cancelSubscription}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card p-8 relative ${getPlanColor(plan.name)} ${
                plan.name === 'IndianDuo Plus' ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              {plan.name === 'IndianDuo Plus' && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                {getPlanIcon(plan.name)}
                <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
                  {plan.name}
                </h3>
                <div className="text-3xl font-bold text-gray-900">
                  ${plan.price}
                  {plan.price > 0 && <span className="text-lg font-normal text-gray-600">/month</span>}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => subscribeToPlan(plan.id)}
                disabled={subscribing || isCurrentPlan(plan.name)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isCurrentPlan(plan.name)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : plan.name === 'IndianDuo Plus'
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : plan.name === 'Family Plan'
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                }`}
              >
                {subscribing ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner w-5 h-5 border-2 mr-2"></div>
                    Processing...
                  </div>
                ) : isCurrentPlan(plan.name) ? (
                  'Current Plan'
                ) : plan.price === 0 ? (
                  'Current Plan'
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Compare Features
          </h2>
          <div className="card p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Feature</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Hearts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span>Ads</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Download className="w-5 h-5 text-blue-500" />
                    <span>Offline Lessons</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span>Priority Support</span>
                  </div>
                </div>
              </div>

              {plans.map((plan) => (
                <div key={plan.id} className="space-y-4">
                  <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                  <div className="space-y-3">
                    <div>{plan.unlimited_hearts ? 'Unlimited' : `${plan.max_hearts} per day`}</div>
                    <div>{plan.ads_free ? 'No ads' : 'With ads'}</div>
                    <div>{plan.offline_lessons ? 'Yes' : 'No'}</div>
                    <div>{plan.priority_support ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What happens to my progress?</h3>
              <p className="text-gray-600">
                Your learning progress is always saved, regardless of your subscription status. You won't lose any progress when switching plans.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">How does the Family Plan work?</h3>
              <p className="text-gray-600">
                The Family Plan allows up to 6 family members to enjoy all premium features. Each member gets their own profile and progress tracking.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Are there any hidden fees?</h3>
              <p className="text-gray-600">
                No hidden fees! The price you see is what you pay. All premium features are included in your subscription.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;