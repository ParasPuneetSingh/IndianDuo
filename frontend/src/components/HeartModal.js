import React, { useState } from 'react';
import { Heart, Gem, Crown, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const HeartModal = ({ isOpen, onClose, onSubscribe }) => {
  const { user } = useAuth();
  const [refilling, setRefilling] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  const refillWithGems = async () => {
    setRefilling(true);
    try {
      await axios.post(`${API_BASE_URL}/api/user/hearts/refill`);
      // Refresh user data
      window.location.reload();
    } catch (error) {
      console.error('Failed to refill hearts:', error);
      alert('Failed to refill hearts. You might not have enough gems.');
    } finally {
      setRefilling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Out of Hearts</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-gray-600 mb-4">
            You're out of hearts! Hearts refill over time, or you can get more right now.
          </p>
        </div>

        <div className="space-y-4">
          {/* Refill with Gems */}
          <div className="border-2 border-cyan-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Gem className="w-5 h-5 text-cyan-500" />
                <span className="font-medium">Refill with Gems</span>
              </div>
              <span className="text-cyan-600 font-bold">350 gems</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Get 5 hearts immediately
            </p>
            <button
              onClick={refillWithGems}
              disabled={refilling || (user?.gems || 0) < 350}
              className={`w-full py-2 px-4 rounded-lg font-medium ${
                (user?.gems || 0) >= 350
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {refilling ? 'Refilling...' : 
               (user?.gems || 0) >= 350 ? 'Refill Hearts' : 'Not enough gems'}
            </button>
          </div>

          {/* Upgrade to Premium */}
          <div className="border-2 border-yellow-300 rounded-lg p-4 bg-yellow-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">IndianDuo Plus</span>
              </div>
              <span className="text-yellow-600 font-bold">$6.99/month</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Unlimited hearts, no ads, offline lessons, and more!
            </p>
            <button
              onClick={onSubscribe}
              className="w-full py-2 px-4 rounded-lg font-medium bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Get IndianDuo Plus
            </button>
          </div>

          {/* Wait for Hearts */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Or wait for your hearts to refill over time
            </p>
            <div className="mt-2 text-xs text-gray-400">
              Hearts refill every 4 hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeartModal;