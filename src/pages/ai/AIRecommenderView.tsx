import React from 'react';
import { useAIRecommender } from '../../hooks/useAIRecommender';

const AIRecommenderView: React.FC = () => {
  const { recommendations, loading, error } = useAIRecommender();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">AI Financial Recommender</h1>
      {loading && <p>Loading recommendations...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {recommendations && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg mb-3">{recommendations.message}</p>
          {recommendations.tips && recommendations.tips.length > 0 && (
            <>
              <h2 className="text-xl font-medium mb-2">Here are some tips:</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {recommendations.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRecommenderView;