// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const materi = document.getElementById("materi-section");
    if (materi) materi.classList.remove("hidden");

    initRipple();
});

// ===============================
// NAVIGASI
// ===============================
function goToPage(page) {
    window.location.href = page;
}

// ===============================
// TOGGLE MATERI
// ===============================
function toggleMateri(num) {
    const content = document.getElementById(`content-${num}`);
    const arrow = document.getElementById(`arrow-${num}`);

    if (!content) return;

    const isOpen = content.classList.contains("open");

    // tutup semua
    document.querySelectorAll(".materi-content").forEach(c => {
        c.classList.remove("open");
    });

    document.querySelectorAll(".arrow").forEach(a => {
        a.style.transform = "rotate(0deg)";
    });

    if (!isOpen) {
        content.classList.add("open");
        arrow.style.transform = "rotate(180deg)";
        speakMateri(`content-${num}`);
    } else {
        speechSynthesis.cancel();
    }
}

// ===============================
// TEXT TO SPEECH
// ===============================
function speakMateri(id) {
    speechSynthesis.cancel();

    const el = document.getElementById(id);
    if (!el) return;

    const text = el.innerText.trim();
    if (!text) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "id-ID";
    utter.rate = 0.95;

    speechSynthesis.speak(utter);
}

// ===============================
// TOGGLE QUIZ
// ===============================
function toggleQuiz() {
    const quiz = document.getElementById("quiz-section");
    const btn = document.querySelector(".btn-open-quiz");

    if (!quiz) return;

    if (!quiz.classList.contains("show")) {
        quiz.classList.add("show");
        btn.innerText = "❌ Tutup Quiz";

        if (!quiz.dataset.loaded) {
            loadQuiz();
            quiz.dataset.loaded = "true";
        }

        setTimeout(() => {
            quiz.scrollIntoView({ behavior: "smooth" });
        }, 200);

    } else {
        quiz.classList.remove("show");
        btn.innerText = "📝 Mulai Quiz";
    }
}

// ===============================
// RIPPLE EFFECT (FIX)
// ===============================
function initRipple() {
    document.querySelectorAll(".materi-card").forEach(card => {
        card.addEventListener("click", function (e) {

            const ripple = document.createElement("span");

            const rect = card.getBoundingClientRect();
            const size = 120;

            ripple.style.position = "absolute";
            ripple.style.width = ripple.style.height = size + "px";
            ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
            ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
            ripple.style.background = "rgba(0,0,0,0.15)";
            ripple.style.borderRadius = "50%";
            ripple.style.pointerEvents = "none";
            ripple.style.transform = "scale(0)";
            ripple.style.transition = "transform 0.5s, opacity 0.5s";
            ripple.style.opacity = "1";

            card.appendChild(ripple);

            requestAnimationFrame(() => {
                ripple.style.transform = "scale(2)";
                ripple.style.opacity = "0";
            });

            setTimeout(() => ripple.remove(), 500);
        });
    });
}

// ===============================
// QUIZ DATA
// ===============================
const quizData = [
    {
        question: "Tujuan utama integrasi Pancasila dalam pendidikan kewarganegaraan adalah…",
        options: [
            "Meningkatkan ekspor",
            "Membentuk karakter bangsa",
            "Menambah provinsi",
            "Menghapus budaya lokal"
        ],
        answer: 1
    },

    {
        question: "Sila pertama Pancasila menekankan nilai…",
        options: ["Keadilan sosial", "Persatuan", "Politik", "Religiusitas"],
        answer: 3
    },

    {
        question: "Karakter yang dihasilkan dari sila kedua adalah…",
        options: [" Nasionalis", "Religius", "Empati dan peduli", "Budaya"],
        answer: 2
    },

    {
        question: "Sila ketiga Pancasila menekankan pentingnya…",
        options: ["Ekonomi", "Karakter", "Persatuan", "Budaya"],
        answer: 2
    },

    {
        question: "Sila keempat menekankan praktik…",
        options: ["Ekonomi", "Musyawarah", "Keadilan", "Budaya"],
        answer: 1
    },

    {
        question: "Sila kelima menekankan nilai…",
        options: ["Keadilan sosial", "Karakter", "Politik", "Budaya"],
        answer: 0
    },

    {
        question: "Integrasi Pancasila dalam kurikulum dilakukan dengan cara…",
        options: ["Mengutamakan teori saja", "Menghapus mata pelajaran lain", "Memasukkan nilai Pancasila dalam semua mata kuliah", "Mengurangi jam belajar"],
        answer: 2
    },

    {
        question: "Pembiasaan nilai Pancasila di sekolah dapat dilakukan melalui…",
        options: ["Mengurangi jam pelajaran", "Meningkatkan ujian tertulis", "Menghapus kegiatan ekstrakurikuler", "Upacara bendera"],
        answer: 3
    },

    {
        question: "Keteladanan guru dalam integrasi Pancasila berarti…",
        options: ["Menjadi role model", "Mengurangi interaksi", "Memberi hukuman keras", "Mengutamakan nilai akademik"],
        answer: 0
    },

    {
        question: "Kegiatan gotong royong mencerminkan sila…",
        options: ["Ketiga", "Kelima", "Pertama", "Kedua"],
        answer: 0
    },

    {
        question: "Diskusi lintas iman di kampus mencerminkan sila…",
        options: ["Ketiga", "Kelima", "Pertama", "Kedua"],
        answer: 2
    },

    {
        question: "Simulasi musyawarah di kelas mencerminkan sila…",
        options: ["Ketiga", "Kelima", "Pertama", "Keempat"],
        answer: 3
    },

    {
        question: "Program peduli lingkungan mencerminkan sila…",
        options: ["Ketiga", "Kelima", "Pertama", "Kedua"],
        answer: 3
    },

    {
        question: "Upacara bendera menumbuhkan karakter…",
        options: ["Religius", "Demokratis", "Nasionalis", "Humanis"],
        answer: 2
    },

    {
        question: "Menghormati hak orang lain mencerminkan sila…",
        options: ["Ketiga", "Kelima", "Pertama", "Kedua"],
        answer: 3
    }


];

// ===============================
// QUIZ LOGIC
// ===============================
let score = 0;
const answered = {};
const userAnswers = {};

// LOAD QUIZ
function loadQuiz() {
    const container = document.getElementById("quiz-container");
    if (!container) return;

    container.innerHTML = "";

    quizData.forEach((q, index) => {
        const card = document.createElement("div");
        card.classList.add("quiz-card");

        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div style="display:flex; gap:10px; align-items:center;">
                <div class="question-number">${index + 1}</div>
                <h3>${q.question}</h3>
            </div>

            ${q.options.map((opt, i) => `
                <div class="option" data-q="${index}" data-i="${i}">
                    ${String.fromCharCode(65 + i)}. ${opt}
                </div>
            `).join("")}

            <button class="btn-check" data-check="${index}">
                ✔ Cek Jawaban
            </button>

            <div id="feedback-${index}"></div>
        `;

        container.appendChild(card);
    });

    bindQuizEvents();
}

// EVENT QUIZ (LEBIH STABIL)
function bindQuizEvents() {

    // pilih jawaban
    document.querySelectorAll(".option").forEach(el => {
        el.addEventListener("click", () => {
            const qIndex = el.dataset.q;
            const optIndex = el.dataset.i;

            if (answered[qIndex]) return;

            userAnswers[qIndex] = Number(optIndex);

            const options = el.parentElement.querySelectorAll(".option");
            options.forEach(o => o.classList.remove("selected"));

            el.classList.add("selected");
        });
    });

    // cek jawaban
    document.querySelectorAll(".btn-check").forEach(btn => {
        btn.addEventListener("click", () => {
            checkAnswer(btn.dataset.check);
        });
    });
}

// CEK JAWABAN
function checkAnswer(index) {
    if (answered[index]) return;

    const q = quizData[index];
    const user = userAnswers[index];
    const feedback = document.getElementById(`feedback-${index}`);
    const options = feedback.parentElement.querySelectorAll(".option");

    if (user === undefined) return;

    answered[index] = true;

    if (user === q.answer) {
        options[user].classList.add("correct");
        feedback.innerHTML = `<div class="feedback correct">✅ Benar</div>`;
        score++;
    } else {
        options[user].classList.add("wrong");
        options[q.answer].classList.add("correct");
        feedback.innerHTML = `<div class="feedback wrong">❌ Salah</div>`;
    }

    document.getElementById("score").innerText = `${score}/${quizData.length}`;
}

// RESET
function resetQuiz() {
    score = 0;

    Object.keys(userAnswers).forEach(k => delete userAnswers[k]);
    Object.keys(answered).forEach(k => delete answered[k]);

    loadQuiz();
    document.getElementById("score").innerText = `0/${quizData.length}`;
}
