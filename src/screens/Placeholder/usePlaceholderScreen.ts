import { useState, useCallback } from 'react';

export const usePlaceholderScreen = () => {
  const [title] = useState('Community Hub');
  const [description] = useState(
    'Welcome to the Community Hub! Phase 1: Project Foundation is successfully loaded.'
  );

  const handlePress = useCallback(() => {
    console.log('Placeholder screen interaction');
  }, []);

  return {
    title,
    description,
    handlePress,
  };
};
