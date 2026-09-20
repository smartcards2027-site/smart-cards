// 1. نظام الحماية: المنع من الخروج خارج التلغرام
const isTelegram = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData !== "";

if (!isTelegram) {
  document.body.innerHTML = 
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; text-align:center; font-family:sans-serif; padding:20px; direction:rtl; background-color:#f8f9fa;">
      <div style="font-size:50px; margin-bottom:10px;">🔒</div>
      <h2 style="margin-bottom:10px; color:#dc3545;">المحتوى محمِيّ</h2>
      <p style="font-size:16px; max-width:400px; color:#6c757d;">
        عذراً، هذه البطاقات متوفرة حصرياً للعرض من داخل تطبيق التلغرام عبر القناة الرسمية ولا يمكن فتحها من المتصفحات الخارجية.
      </p>
    </div>
  ;
  throw new Error("Access Denied: Opened outside Telegram WebApp environment.");
}

// تهيئة التلغرام وتوسيع الشاشة
window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

// 2. المتغيرات الأساسية
var cards = [];
var currentIndex = 0;

// 3. قراءة اسم المحاضرة
var urlParams = new URLSearchParams(window.location.search);
var lectureName = window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.start_param ? window.Telegram.WebApp.initDataUnsafe.start_param : (urlParams.get('lecture') || 'cardiology1');

var titleElement = document.getElementById('lecture-title');
if (titleElement) {
  titleElement.innerText = "المحاضرة: " + lectureName;
}

// 4. جلب ملف الـ JSON الخاص بالمحاضرة
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
    var qElement = document.getElementById('question');
    if (qElement) qElement.innerText = "خطأ: لم يتم العثور على ملف المحاضرة المطلوب.";
  });

// 5. دالّة عرض البطاقات والتحكم
function renderCard() {
  if (cards.length === 0) return;
  document.getElementById('question').innerText = cards[currentIndex].question;
  document.getElementById('answer').innerText = cards[currentIndex].answer;
  document.getElementById('counter').innerText = (currentIndex + 1) + " / " + cards.length;
  document.getElementById('card').classList.remove('flipped');
}

function flipCard() {
  document.getElementById('card').classList.toggle('flipped');
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