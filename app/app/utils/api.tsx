import axios from "axios";

export const apiUrl = "http://127.0.0.1:8000";

export async function uploadImage(file: File) {
  // 檢查檔案是否為圖片
  if (!file.type.startsWith("image/")) {
    console.error("File is not an image.");
    alert("請選擇一張圖片上傳");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${apiUrl}/upload-image/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
