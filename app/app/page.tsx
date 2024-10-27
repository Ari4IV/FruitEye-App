"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/app/utils/api";

interface ImageResult {
  info: string;
  predicted_class: string;
  confidence_score: string;
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ImageResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (selectedImage) {
      setLoading(true);
      await uploadImage(selectedImage)
        .then((data) => {
          console.log("Upload successful:", data);
          setResult(data);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          alert("上傳失敗: " + error.message);
        });
    } else {
      alert("請選擇一張圖片上傳");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        AI助農：芒果品質辨識
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        利用影像辨識技術進行芒果品質區分
      </p>

      <div className="flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-700
             file:mr-4 file:py-2 file:px-4
             file:rounded-full file:border-0
             file:text-sm file:font-semibold
             file:bg-blue-100 file:text-blue-700
             hover:file:bg-blue-200
             cursor-pointer focus:outline-none mb-6"
        />
      </div>

      {preview && (
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">預覽圖片</h2>
          <Image
            src={preview}
            alt="Selected Image"
            width={300}
            height={300}
            className="rounded-lg border border-gray-300"
          />
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            辨識中...
          </h2>
        </div>
      )}

      {result && !loading && (
        <div className="flex flex-col items-center mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">辨識結果</h2>
          <p className="text-lg text-gray-600">物件：{result.info}</p>
          <p className="text-lg text-gray-600">等級：{result.predicted_class}</p>
          <p className="text-lg text-gray-600">信心指數：{result.confidence_score}</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
      >
        上傳圖片
      </button>
    </div>
  );
}
