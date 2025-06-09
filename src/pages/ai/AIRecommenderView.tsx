import React from 'react';
import { useAIRecommender } from '../../hooks/useAIRecommender';

const AIRecommenderPage: React.FC = () => {
  const { recommendations, loading, error, loadRecommendations } = useAIRecommender();

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">AI Financial Recommender</h1>
        <button
          onClick={loadRecommendations}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:bg-green-300"
        >
          {loading ? 'Fetching...' : 'Get Fresh Recommendations'}
        </button>
      </div>
      
      {loading && <p className="text-center text-gray-600 py-4">Loading recommendations...</p>}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md text-sm">Error: {error}</p>}
      
      {recommendations && !loading && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg text-gray-700 mb-4">{recommendations.message}</p>
          {recommendations.tips && recommendations.tips.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Personalized Tips:</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {recommendations.tips.map((tip, index) => (
                  <li key={index} className="hover:text-gray-800 transition-colors">{tip}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
      {!recommendations && !loading && !error && (
        <p className="text-center text-gray-500 py-4">Click the button to get AI recommendations.</p>
      )}
    </div>
  );
};

export default AIRecommenderPage;