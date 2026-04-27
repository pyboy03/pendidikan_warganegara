let typing = false;
let typingSpeed = 30; // kecepatan (ms)
let typingInterval;
let currentSceneKey = "start";

// 🎧 AUDIO MANAGER
const AudioManager = {
    bgm: null,

    playBGM(src) {
        // stop lama
        if (this.bgm) {
            this.bgm.pause();
        }

        this.bgm = new Audio(src);
        this.bgm.loop = true;
        this.bgm.volume = 0.4;

        // cek apakah user sudah pernah klik
        const audioUnlocked = localStorage.getItem("audioUnlocked");

        if (audioUnlocked) {
            this.bgm.play().catch(() => { });
        }
    },

    unlockAudio() {
        localStorage.setItem("audioUnlocked", "true");

        if (this.bgm) {
            this.bgm.play().catch(() => { });
        }
    },

    playSFX(src) {
        const sound = new Audio(src);
        sound.volume = 0.7;
        sound.play().catch(() => { });
    }
};

document.addEventListener("click", () => {

    // kalau masih typing → skip animasi
    if (typing) {
        clearInterval(typingInterval);
        typing = false;

        const currentScene = story[currentSceneKey];
        document.getElementById("text").innerText = currentScene.text;
        document.getElementById("next-indicator").style.opacity = 1;
        return; // 🔥 penting
    }

    // kalau sudah selesai & tidak ada pilihan
    const currentScene = story[currentSceneKey];

    if (!currentScene.choices || currentScene.choices.length === 0) {
        if (currentScene.next) {
            fadeOut(() => {
                showScene(currentScene.next);
                fadeIn();
            });
        }
    }
});

window.addEventListener("load", () => {
    const page = window.location.pathname;

    if (page.includes("index")) {
        AudioManager.playBGM("/pendidikan_warganegara/assets/audio/menu.mp3");
    }
    else if (page.includes("game")) {
        AudioManager.playBGM("/pendidikan_warganegara/assets/audio/game.mp3");
    }
    else if (page.includes("materi")) {
        AudioManager.playBGM("/pendidikan_warganegara/assets/audio/materi.mp3");
    }
    else if (page.includes("video")) {
        AudioManager.playBGM("/pendidikan_warganegara/assets/audio/video.mp3");
    }
});

function goToPage(page) {
    AudioManager.playSFX("assets/audio/click.mp3");

    fadeOut(() => {
        if (AudioManager.bgm) {
            AudioManager.bgm.pause(); // stop sebelum pindah
        }

        window.location.href = page;
    });
}


let story = {

    // 🎬 CUTSCENE AWAL
    intro: {
        type: "cutscene",
        text: "Suatu pagi di sekolah, Adi memulai harinya...",
        bg: "assets/bg/sekolah.jpg",
        next: "intro2"
    },

    intro2: {
        type: "cutscene",
        text: "Namun hari itu, ia melihat sesuatu yang tidak biasa...",
        bg: "assets/bg/halaman.jpg",
        next: "start"
    },

    // 🎮 SCENE 1
    start: {
        name: "Adi",
        text: "Hei, kenapa kamu buang sampah sembarangan?",
        bg: "assets/bg/kotor.jpg",
        left: "assets/character/adi_normal.png",
        right: "assets/character/teman_normal.png",
        speaker: "left",
        choices: [
            { text: "Menegur dengan baik", next: "scene2_baik", effect: { empati: 2 } },
            { text: "Diam saja", next: "scene2_diam", effect: { empati: -1 } }
        ]
    },

    // 🎮 SCENE 2
    scene2_baik: {
        name: "Teman",
        text: "Oh maaf, aku tidak sadar...",
        bg: "assets/bg/halaman.jpg",
        left: "assets/character/adi_normal.png",
        right: "assets/character/teman_sad.png",
        speaker: "right",
        choices: [
            { text: "Ajak membuang sampah", next: "scene3", effect: { integritas: 2 } }
        ]
    },

    scene2_diam: {
        name: "Narasi",
        text: "Kamu memilih diam, lingkungan tetap kotor...",
        bg: "assets/bg/kotor.jpg",
        left: "assets/character/adi_sad.png",
        speaker: "left",
        choices: [
            { text: "Lanjut", next: "scene3" }
        ]
    },

    // 🎮 SCENE 3 (KELAS)
    scene3: {
        name: "Guru",
        text: "Anak-anak, hari ini kita belajar tentang tanggung jawab.",
        bg: "assets/bg/kelas.jpg",
        left: "assets/character/adi_normal.png",
        right: "assets/character/guru_normal.png",
        speaker: "left",
        choices: [
            { text: "Mendengarkan", next: "scene4_baik", effect: { integritas: 2 } },
            { text: "Mengabaikan", next: "scene4_buruk", effect: { integritas: -2 } }
        ]
    },

    // 🎮 SCENE 4
    scene4_baik: {
        name: "Guru",
        text: "Bagus, kamu siswa yang bertanggung jawab.",
        bg: "assets/bg/kelas.jpg",
        left: "assets/character/adi_happy.png",
        right: "assets/character/guru_normal.png",
        speaker: "left",
        choices: [{ text: "Lanjut", next: "scene5" }]
    },

    scene4_buruk: {
        name: "Guru",
        text: "Kamu harus lebih fokus!",
        bg: "assets/bg/kelas.jpg",
        left: "assets/character/adi_sad.png",
        right: "assets/character/guru_angry.png",
        speaker: "left",
        choices: [{ text: "Lanjut", next: "scene5" }]
    },

    // 🎮 SCENE 5 (KELOMPOK)
    scene5: {
        name: "Teman",
        text: "Ayo kita kerja kelompok.",
        bg: "assets/bg/kelas.jpg",
        left: "assets/character/adi_normal.png",
        right: "assets/character/teman_normal.png",
        speaker: "left",
        choices: [
            { text: "Bekerja sama", next: "scene6", effect: { empati: 2 } },
            { text: "Membiarkan teman bekerja sendiri", next: "scene6", effect: { empati: -2 } }
        ]
    },

    // 🎮 SCENE 6 (KONFLIK BARU)
    scene6: {
        name: "Teman",
        text: "Tugasnya sulit... kita tidak punya banyak waktu.",
        bg: "assets/bg/kelas.jpg",
        left: "assets/character/adi_normal.png",
        right: "assets/character/teman_sad.png",
        speaker: "left",
        choices: [
            { text: "Membantu teman", next: "scene7", effect: { empati: 2 } },
            { text: "Menyalahkan teman", next: "scene7", effect: { integritas: -2 } }
        ]
    },

    // 🎮 SCENE 7 (REFLEKSI)
    scene7: {
        name: "Narasi",
        text: "Hari mulai sore... kamu merenungkan tindakanmu hari ini.",
        bg: "assets/bg/sore.jpg",
        left: "assets/character/adi_normal.png",
        speaker: "left",
        choices: [
            { text: "Lanjut", next: "endingCheck" }
        ]
    },

    // 🎯 CHECK ENDING
    endingCheck: {
        name: "Narasi",
        text: "Menentukan hasil perjalananmu...",
        bg: "assets/bg/sore.jpg",
        choices: []
    },

    // 🟢 ENDING BAIK
    ending_baik: {
        name: "Narasi",
        text: "Kamu membawa perubahan positif. Lingkungan jadi lebih bersih dan temanmu ikut belajar peduli 🌱",
        bg: "assets/bg/sekolah.jpg",
        left: "assets/character/adi_happy.png",
        speaker: "left",
        choices: [
            { text: "Main Lagi", next: "start" },

        ]
    },

    // 🔴 ENDING BURUK
    ending_buruk: {
        name: "Narasi",
        text: "Sikap acuh membuat keadaan tidak berubah... bahkan semakin buruk 😢",
        bg: "assets/bg/kotor.jpg",
        left: "assets/character/adi_sad.png",
        speaker: "left",
        choices: [
            { text: "Coba Lagi", next: "start" },

        ]
    },

    // 🟡 ENDING NETRAL
    ending_biasa: {
        name: "Narasi",
        text: "Kamu sudah cukup baik, tapi masih bisa lebih peduli 👍",
        bg: "assets/bg/sore.jpg",
        left: "assets/character/adi_normal.png",
        speaker: "left",
        choices: [
            { text: "Main Lagi", next: "start" },

        ]
    }
};

document.addEventListener("mousemove", (e) => {
    let x = (e.clientX / window.innerWidth - 0.5) * 10;
    let y = (e.clientY / window.innerHeight - 0.5) * 10;

    document.getElementById("background").style.transform =
        `translate(${x}px, ${y}px)`;

    document.getElementById("char-left").style.transform =
        `translate(${x * 1.5}px, ${y * 1.5}px)`;

    document.getElementById("char-right").style.transform =
        `translate(${x * 1.5}px, ${y * 1.5}px)`;
});

let stats = {
    empati: 0,
    integritas: 0
};

function getEnding() {
    if (stats.empati >= 2 && stats.integritas >= 1) {
        return "ending_baik";
    }
    else if (stats.empati < 0 || stats.integritas < 0) {
        return "ending_buruk";
    }
    else {
        return "ending_biasa";
    }
}

function typeWriter(textElement, fullText) {
    let index = 0;
    typing = true;
    textElement.innerText = "";

    clearInterval(typingInterval);

    typingInterval = setInterval(() => {
        textElement.innerText += fullText.charAt(index);
        index++;

        if (index >= fullText.length) {
            clearInterval(typingInterval);
            typing = false;

            // tampilkan tombol next
            document.getElementById("next-indicator").style.opacity = 1;
        }
    }, typingSpeed);
}


function showScene(scene) {
    currentSceneKey = scene;

    const text = document.getElementById("text");
    const choices = document.getElementById("choices");
    const name = document.getElementById("name");
    const charLeft = document.getElementById("char-left");
    const charRight = document.getElementById("char-right");
    const bg = document.getElementById("background");

    let current = story[scene];

    // reset next indicator
    document.getElementById("next-indicator").style.opacity = 0;

    // =========================
    // 🌄 BACKGROUND
    // =========================
    if (current.bg) {
        bg.style.opacity = 0;
        setTimeout(() => {
            bg.style.backgroundImage = `url('${current.bg}')`;
            bg.style.opacity = 1;
        }, 200);
    }

    // =========================
    // 🎬 CUTSCENE
    // =========================
    if (current.type === "cutscene") {

        name.innerText = "";
        choices.innerHTML = "";

        typeWriter(text, current.text);

        let nextBtn = document.createElement("button");
        nextBtn.innerText = "▶ Lanjut";

        nextBtn.onclick = () => {
            AudioManager.playSFX("assets/audio/click.mp3");

            fadeOut(() => {
                showScene(current.next);
                fadeIn();
            });
        };

        choices.appendChild(nextBtn);
        return;
    }

    // =========================
    // 📝 TEXT
    // =========================
    name.innerText = current.name;
    typeWriter(text, current.text);

    // =========================
    // 🎭 KARAKTER
    // =========================
    if (charLeft && charRight) {

        charLeft.style.display = current.left ? "block" : "none";
        charRight.style.display = current.right ? "block" : "none";

        if (current.left) charLeft.src = current.left;
        if (current.right) charRight.src = current.right;

        charLeft.classList.remove("active", "inactive");
        charRight.classList.remove("active", "inactive");

        if (current.speaker === "left") {
            charLeft.classList.add("active");
            charRight.classList.add("inactive");
        } else if (current.speaker === "right") {
            charRight.classList.add("active");
            charLeft.classList.add("inactive");
        }
    }

    // =========================
    // 🔘 PILIHAN
    // =========================
    choices.innerHTML = "";

    current.choices.forEach(choice => {
        let button = document.createElement("button");
        button.innerText = choice.text;

        button.onclick = () => {

            // 🔊 suara transisi awal
            AudioManager.playSFX("assets/audio/transition.mp3");

            fadeOut(() => {

                // 🔊 efek pilihan (GOOD / BAD / NETRAL)
                if (choice.effect?.empati > 0 || choice.effect?.integritas > 0) {
                    AudioManager.playSFX("assets/audio/good.mp3");
                }
                else if (choice.effect) {
                    AudioManager.playSFX("assets/audio/bad.mp3");
                }
                else {
                    AudioManager.playSFX("assets/audio/click.mp3");
                }

                // 📊 update stat
                if (choice.effect) {
                    for (let key in choice.effect) {
                        stats[key] += choice.effect[key];
                    }
                }

                // 🎯 cek ending
                if (choice.next === "endingCheck") {
                    const ending = getEnding();
                    showScene(ending);
                    fadeIn();
                    return;
                }

                // 🎮 pindah scene
                showScene(choice.next);
                fadeIn();
            });
        };

        choices.appendChild(button);
    });
}

// mulai game
showScene("intro");

function fadeOut(callback) {
    const fade = document.getElementById("fade");
    fade.classList.add("active");

    setTimeout(() => {
        if (callback) callback();
    }, 500);
}

function fadeIn() {
    const fade = document.getElementById("fade");
    fade.classList.remove("active");
}

window.addEventListener("load", () => {
    fadeIn();
});


function playVideo(src) {
    const video = document.getElementById("mainVideo");

    if (AudioManager.bgm) {
        AudioManager.bgm.pause();
    }

    video.src = src;
    video.play();

    video.requestFullscreen(); // aman di sini

    AudioManager.playSFX("assets/audio/click.mp3");
}

document.addEventListener("click", () => {
    AudioManager.unlockAudio();
});

document.addEventListener("click", () => {
    if (!AudioManager.bgm) return;

    AudioManager.bgm.play().catch(() => {});
});
