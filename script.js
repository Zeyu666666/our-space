// 1. CONFIGURATION
const startDate = new Date('2024-08-17'); 
const SECRET_CODE = "0817"; // Change this if you want

// 2. TRANSLATIONS
const translations = {
    en: {
        btn: "切换到中文",
        title: "Our Journey",
        label: "Days Together",
        subtext: "Since August 17, 2024",
        bgBtn: "Change Background",
        prompt: "Enter the secret password:",
        error: "Wrong password!",
        uploading: "Uploading... please wait!",
        success: "Background updated for both of us!"
    },
    cn: {
        btn: "Switch to English",
        title: "我们的旅程",
        label: "在一起的天数",
        subtext: "始于 2024年8月17日",
        bgBtn: "更换背景",
        prompt: "请输入只有我们知道的密码:",
        error: "密码错误!",
        uploading: "上传中... 请稍候!",
        success: "背景已更新，我们都能看到!"
    }
};

let currentLang = 'en';

// 3. BASIC LOGIC
function updateCounter() {
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    document.getElementById('days-count').innerText = diffDays;
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'cn' : 'en';
    const content = translations[currentLang];
    document.getElementById('lang-btn').innerText = content.btn;
    document.getElementById('title').innerText = content.title;
    document.getElementById('label').innerText = content.label;
    document.getElementById('subtext').innerText = content.subtext;
    document.getElementById('bg-btn').innerText = content.bgBtn;
}

// 4. CLOUD LOGIC (Firebase)

// Listen for background changes (Runs automatically!)
window.onload = function() {
    updateCounter(); // Start the counter
    
    // Wait 1 second for Firebase to load, then check for background
    setTimeout(() => {
        if(window.db) {
            const bgRef = window.dbRef(window.db, 'background');
            window.dbOnValue(bgRef, (snapshot) => {
                const data = snapshot.val();
                if (data && data.url) {
                    document.body.style.backgroundImage = `url('${data.url}')`;
                }
            });
        }
    }, 500);
};

// Check Password
function checkAuth() {
    const content = translations[currentLang];
    const userCode = prompt(content.prompt);
    if (userCode === SECRET_CODE) {
        document.getElementById('bg-input').click();
    } else {
        alert(content.error);
    }
}

// Upload Image
document.getElementById('bg-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Show loading alert
    alert(translations[currentLang].uploading);

    if (window.storage) {
        // 1. Upload to Storage
        const fileName = 'bg_' + Date.now() + '.jpg';
        const storageRef = window.sRef(window.storage, fileName);

        window.sUpload(storageRef, file).then((snapshot) => {
            // 2. Get the link
            window.sGetUrl(snapshot.ref).then((downloadURL) => {
                // 3. Save link to Database
                window.dbSet(window.dbRef(window.db, 'background'), {
                    url: downloadURL,
                    uploader: "Zeyu/GF",
                    time: Date.now()
                });
                alert(translations[currentLang].success);
            });
        });
    }
});