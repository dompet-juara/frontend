import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function AIRecommender() {
  const [aiMessage, setAiMessage] = useState(null);

  const handleRequestRecommendation = () => {
    const recommendation = "Ini adalah rekomendasi dari AI berdasarkan permintaan Anda!";
    setAiMessage(recommendation);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex-1 p-6 bg-white rounded-xl shadow-md mx-4 overflow-y-auto">
        <AnimatePresence>
          {aiMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="bg-green-100 p-4 rounded-lg"
            >
              <span className="font-semibold text-green-700">Rekomendasi AI:</span>
              <p>{aiMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center pb-6">
        <button
          onClick={handleRequestRecommendation}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600"
        >
          Minta Rekomendasi
        </button>
      </div>
    </div>
  );
}

export default AIRecommender;
