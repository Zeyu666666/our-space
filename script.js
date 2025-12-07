// ==========================================
// 1. IMPORTS & CONFIG
// ==========================================
// We use these "https" links so you don't need to install anything
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// YOUR SPECIFIC KEYS (I added the databaseURL for you)
const firebaseConfig = {
  apiKey: "AIzaSyC6iW7TxWmEN1NjmvBHCRmCg067ooOU_OE",
  authDomain: "our-space-us.firebaseapp.com",
  databaseURL: "https://our-space-us-default-rtdb.firebaseio.com",
  projectId: "our-space-us",
  storageBucket: "our-space-us.firebasestorage.app",
  messagingSenderId: "552504280642",
  appId: "1:552504280642:web:b801a79591ca0bdaddcfdb"
};

// Initialize the App
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ==========================================
// 2. TEXT & SETTINGS
// ==========================================
const startDate = new Date('2024-08-17'); 
const SECRET_CODE = "0817"; 

const translations = {
    en: {
        bgBtn: "Change Background",
        prompt: "Enter password:",
        error: "Wrong password!",
        uploading: "Compressing & Saving... please wait!",
        success: "Background updated!",
        tooBig: "Image is too big! Please try a smaller one."
    },
    cn: {
        bgBtn: "更换背景",
        prompt: "请输入密码:",
        error: "密码错误!",
        uploading: "正在压缩并保存... 请稍候!",
        success: "背景已更新!",
        tooBig: "图片太大了! 请试一张小一点的。"
    }
};

let currentLang = 'en';

// ==========================================
// 3. LOGIC (Counter & Language)
// ==========================================
function updateCounter() {
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    document.getElementById('days-count').innerText = diffDays;
}

// Make these functions available to the HTML button
window.toggleLanguage = function() {
    currentLang = currentLang === 'en' ? 'cn' : 'en';
    updateText();
}

function updateText() {
    const t = translations[currentLang];
    document.getElementById('lang-btn').innerText = (currentLang === 'en' ? "Switch to Chinese" : "Switch to English");
    document.getElementById('title').innerText = (currentLang === 'en' ? "Zeyu & Xiaodi' Journey" : "腊肠和小猪的奇幻之旅");
    document.getElementById('label').innerText = (currentLang === 'en' ? "Days Together" : "在一起的天数");
    document.getElementById('subtext').innerText = (currentLang === 'en' ? "Since August 17, 2024" : "起始日：2024年8月17日");
    document.getElementById('bg-btn').innerText = t.bgBtn;
}

window.checkAuth = function() {
    const code = prompt(translations[currentLang].prompt);
    if (code === SECRET_CODE) document.getElementById('bg-input').click();
    else alert(translations[currentLang].error);
}

// ==========================================
// 4. DATABASE SAVE LOGIC (The Fix)
// ==========================================

// A. Listen for Changes (Updates the screen when database changes)
const bgRef = ref(db, 'background_image');
onValue(bgRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.base64) {
        document.body.style.backgroundImage = `url('${data.base64}')`;
    }
});

// B. Shrink & Save Image
document.getElementById('bg-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    alert(translations[currentLang].uploading);

    const reader = new FileReader();
    reader.onload = function(readerEvent) {
        const img = new Image();
        img.src = readerEvent.target.result;
        
        img.onload = function() {
            // Shrink image to max 800px wide (prevents database freeze)
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800; 
            const scaleSize = MAX_WIDTH / img.width;
            
            // Calculate new size
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;

            // Draw to canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Convert to text string (JPEG quality 0.6)
            const dataUrl = canvas.toDataURL('image/jpeg', 0.6);

            // Save to Database
            set(ref(db, 'background_image'), {
                base64: dataUrl,
                time: Date.now()
            }).then(() => {
                alert(translations[currentLang].success);
            }).catch((error) => {
                alert("Error: " + error.message);
            });
        }
    };
    reader.readAsDataURL(file);
});

// Start the counter
updateCounter();