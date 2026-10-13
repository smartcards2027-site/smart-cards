// 1. التحقق من أن التطبيق يعمل من داخل التلغرام
const isTelegram = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData;

if (!isTelegram) {
    document.body.innerHTML = 
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; font-family: sans-serif; background-color: #f8f9fa; color: #333; padding: 20px;">
            <div style="font-size: 50px; margin-bottom: 10px;">🔒</div>
            <h2 style="margin-bottom: 10px; color: #dc3545;">المحتوى محمي</h2>
            <p style="font-size: 16px; max-width: 400px; color: #6c757d;">
                عذراً، يجب عرض من داخل تطبيق التلغرام عبر القناة الرسمية ولا يمكن فتحها من المتصفحات الخارجية.
            </p>
        </div>
    ;
    throw new Error("Access Denied: Opened outside Telegram WebApp environment");
}

// تهيئة التلغرام وتوسيع الشاشة
window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

// 2. المتغيرات الأساسية
var cards = [];
var currentIndex = 0;

// 3. قراءة اسم المحاضرة بذكاء من الـ startapp في التلغرام (أو الافتراضية cardiology1)
var startParam = window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.start_param;
var lectureName = startParam ? startParam : 'cardiology1';

var titleElement = document.getElementById('lecture-title');
if (titleElement) {
    titleElement.innerText = "المحاضرة: " + lectureName;
}

// 4. جلب ملف الـ JSON الخاص بالمحاضرة ديناميكياً
fetch(lectureName + '.json')
    .then(function(response) {
        if (!response.ok) throw new Error("المحاضرة غير موجودة");
        return response.json();
    })
    .then(function(data) {
        cards = data;
        renderCard();
    })
    .catch(function(error) {
        console.error(error);
        var qElement = document.getElementById('question');
        if (qElement) qElement.innerText = "⚠️ لم يتم العثور على ملف المحاضرة المطلوبة!";
    });

// 5. دالة عرض البطاقات والتحكم
function renderCard() {
    if (cards.length === 0) return;

    var currentCard = cards[currentIndex];
    
    document.getElementById('question').innerText = currentCard.question || "";
    document.getElementById('answer').innerText = currentCard.answer || "";
    document.getElementById('counter').innerText = (currentIndex + 1) + " / " + cards.length;

    // التعامل مع الصور إن وجدت
    var imgElement = document.getElementById('card-image');
    if (imgElement) {
        if (currentCard.image && currentCard.image.trim() !== "") {
            imgElement.src = currentCard.image;
            imgElement.style.display = "block";
        } else {
            imgElement.style.display = "none";
        }
    }

    var cardElement = document.getElementById('card');
    if (cardElement) {
        cardElement.classList.remove('flipped');
    }
}

function flipCard() {
    var cardElement = document.getElementById('card');
    if (cardElement) {
        cardElement.classList.toggle('flipped');
    }
}

function nextCard() {
    if (cards.length === 0) return;
    currentIndex = (currentIndex + 1) % cards.length;
    renderCard();
}

function prevCard() {
    if (cards.length === 0) return;
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    renderCard();
}
