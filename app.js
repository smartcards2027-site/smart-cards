let cards = [];
let currentIndex = 0;

// 1. فحص مصدر الزائر (التلغرام)
const isTelegram = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData !== "";

// 2. قراءة اسم المحاضرة من رابط الصفحة (مثلاً: index.html?lecture=cardiology1)
const urlParams = new URLSearchParams(window.location.search);
const lectureName = urlParams.get('lecture') || 'cardiology1'; // يختار cardiology1 كافتراضي

document.getElementById('lecture-title').innerText =` محاضرة: ${lectureName}`;

// 3. جلب ملف الـ JSON المطابق لاسم المحاضرة
fetch(`${lectureName}.json`)
  .then(response => {
    if (!response.ok) throw new Error("المحاضرة غير موجودة");
    return response.json();
  })
  .then(data => {
    cards = data;
    renderCard();
  })
  .catch(error => {
    document.getElementById('question').innerText = "خطأ: لم يتم العثور على ملف المحاضرة المطلوب.";
  });

function renderCard() {
  if (cards.length === 0) return;
  document.getElementById('question').innerText = cards[currentIndex].question;
  document.getElementById('answer').innerText = cards[currentIndex].answer;
  document.getElementById('counter').innerText = `${currentIndex + 1} / ${cards.length}`;
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