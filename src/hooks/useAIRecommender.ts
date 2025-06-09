import { useState, useEffect, useCallback } from "react";
import { AIRecommendation, fetchAIRecommendations } from "../api/ai";
import { useAuth } from "../contexts/AuthContext";

const DUMMY_AI_RECOMMENDATION: AIRecommendation = {
  message:
    "Selamat datang, Tamu! Berikut beberapa tips keuangan umum sebagai demonstrasi:",
  tips: [
    "Buat anggaran bulanan untuk memahami kebiasaan pengeluaran Anda.",
    "Usahakan menabung setidaknya 10–20% dari penghasilan setiap bulan.",
    "Tinjau kembali tujuan keuangan Anda setiap kuartal dan sesuaikan jika diperlukan.",
    "Pertimbangkan untuk mengotomatiskan tabungan dan investasi Anda.",
    "Pelajari berbagai opsi investasi untuk menumbuhkan kekayaan Anda.",
  ],
};

export const useAIRecommender = () => {
  const { isGuest } = useAuth();
  const [recommendations, setRecommendations] =
    useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (isGuest) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setRecommendations(DUMMY_AI_RECOMMENDATION);
      } else {
        const data = await fetchAIRecommendations();
        setRecommendations(data);
      }
    } catch (err: any) {
      if (!isGuest) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch AI recommendations"
        );
      } else {
        setRecommendations(DUMMY_AI_RECOMMENDATION);
      }
    } finally {
      setLoading(false);
    }
  }, [isGuest]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  return {
    recommendations,
    loading,
    error,
    loadRecommendations,
  };
};
