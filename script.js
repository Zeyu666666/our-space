// 1. CONFIGURATION
const startDate = new Date('2024-08-17'); // Your start date

// 2. TRANSLATIONS
// When you add new features, just add the text here for both languages
const translations = {
    en: {
        btn: "切换到中文", // Button shows what it WILL switch to
        title: "Our Journey",
        label: "Days Together",
        subtext: "Since August 17, 2024"
    },
    cn: {
        btn: "Switch to English",
        title: "我们的旅程",
        label: "在一起的天数",
        subtext: "始于 2024年8月17日"
    }
};

let currentLang = 'en';

// 3. LOGIC (DO NOT TOUCH UNLESS FIXING BUGS)

// Calculate Days
function updateCounter() {
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    document.getElementById('days-count').innerText = diffDays;
}

// Toggle Language
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'cn' : 'en';
    const content = translations[currentLang];

    // Update text elements
    document.getElementById('lang-btn').innerText = content.btn;
    document.getElementById('title').innerText = content.title;
    document.getElementById('label').innerText = content.label;
    document.getElementById('subtext').innerText = content.subtext;
}

// Initialize
updateCounter();

// ==========================================
//  FUTURE FEATURES ROOM: ADD NEW JS BELOW
// ==========================================
// Example: console.log("New feature added!");