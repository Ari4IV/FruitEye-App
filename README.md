# AI助農：芒果品質辨識

## 專案簡介
這是一個利用深度學習和影像辨識技術來進行芒果品質分類的專案。該系統由一個基於 FastAPI 的後端伺服器和一個使用 Next.js 開發的前端應用程式組成。用戶可以上傳芒果圖片，並根據模型的預測獲取芒果品質的等級和信心指數。

## 使用技術
- **後端**: Python, FastAPI, PyTorch
- **前端**: React, Next.js

## 功能
- 上傳芒果圖片進行品質辨識
- 返回品質等級（優良、中等、較差）和信心指數

## 安裝指南

### 1. 後端部分
#### 1.1. 環境要求
- Python 3.7+
- PyTorch
- FastAPI
- torchvision
- PIL

#### 1.2. 安裝依賴
```bash
pip install -r requirements.txt
```

#### 1.3. 安裝依賴
```bash
uvicorn main:app --reload
```

伺服器將會在 http://127.0.0.1:8000 上運行。可以透過 http://127.0.0.1:8000/docs 查看自動生成的 API 文件。

