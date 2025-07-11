import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Load available languages
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/languages`);
        setLanguages(response.data);
      } catch (error) {
        console.error('Failed to load languages:', error);
      }
    };

    loadLanguages();
  }, [API_BASE_URL]);

  const loadLessons = async (languageId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/lessons/${languageId}`);
      setLessons(response.data);
    } catch (error) {
      console.error('Failed to load lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    if (language) {
      loadLessons(language.id);
    }
  };

  const value = {
    languages,
    selectedLanguage,
    lessons,
    loading,
    selectLanguage,
    loadLessons
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};