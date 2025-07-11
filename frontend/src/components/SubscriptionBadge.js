import React from 'react';
import { Crown, Users, Heart } from 'lucide-react';

const SubscriptionBadge = ({ subscriptionStatus, className = "" }) => {
  const getBadgeContent = () => {
    switch (subscriptionStatus) {
      case 'premium':
        return {
          icon: <Crown className="w-4 h-4" />,
          text: 'Plus',
          bgColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          textColor: 'text-white'
        };
      case 'family':
        return {
          icon: <Users className="w-4 h-4" />,
          text: 'Family',
          bgColor: 'bg-gradient-to-r from-blue-400 to-purple-500',
          textColor: 'text-white'
        };
      default:
        return {
          icon: <Heart className="w-4 h-4" />,
          text: 'Free',
          bgColor: 'bg-gray-200',
          textColor: 'text-gray-700'
        };
    }
  };

  const badge = getBadgeContent();

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bgColor} ${badge.textColor} ${className}`}>
      {badge.icon}
      <span>{badge.text}</span>
    </div>
  );
};

export default SubscriptionBadge;