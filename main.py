from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from torchvision import transforms, models
from PIL import Image
import torch
import torch.nn.functional as F

# 設定應用
app = FastAPI()

# 訓練的模型
MODEL_PATH = "mango_classifier.pth"

# 設定裝置
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 定義與訓練時相同的模型結構
model = models.resnet50(weights=None)  # 不使用預訓練權重
num_ftrs = model.fc.in_features
model.fc = torch.nn.Linear(num_ftrs, 3)  # 假設我們的分類數是 3

# 載入模型權重並轉移到適當的裝置
model.load_state_dict(torch.load(MODEL_PATH, map_location=device, weights_only=True), strict=False)
model = model.to(device)  # 將模型轉移到 GPU 或 CPU

model.eval()  # 評估模式

# 圖片預處理（與訓練時相同）
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# CORS 中介軟體
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允許所有來源
    allow_credentials=True,
    allow_methods=["*"],  # 允許所有方法
    allow_headers=["*"]   # 允許所有標頭
)

@app.get("/")
async def read_root():
    return {"message": "歡迎來到 FruitEye-App：芒果品質辨識系統！"}

@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    try:
        # 讀取並預處理上傳的圖片
        image = Image.open(file.file).convert("RGB")
        image_tensor = preprocess(image).unsqueeze(0)  # 添加 batch 維度
        image_tensor = image_tensor.to(device)  # 將圖片數據轉移到相應的設備

        # 模型推論
        with torch.no_grad():
            output = model(image_tensor)
            probabilities = F.softmax(output, dim=1)  # 計算 softmax 概率
            confidence, predicted = torch.max(probabilities, 1)
            predicted_class = predicted.item()
            confidence_score = confidence.item() * 100  # 轉換為百分比格式

        # 設定一個最低的信心度閾值
        minimum_confidence_threshold = 51.0

        # 根據模型輸出的類別決定品質等級，並檢查信心度
        level_mapping = {0: "優良品質 (A)", 1: "中等品質 (B)", 2: "較差品質 (C)"}
        if confidence_score < minimum_confidence_threshold:
            quality_level = "未知物件"
            confidence_score = "不適用"  # 當為未知物件時，信心度為不適用
        else:
            quality_level = level_mapping.get(predicted_class, "未知品質")

        response_data = {
            "info": f"Image '{file.filename}'",
            "predicted_class": quality_level,  # 直接返回描述性標籤
            "confidence_score": confidence_score  # 信心度
        }

        return JSONResponse(response_data)

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
