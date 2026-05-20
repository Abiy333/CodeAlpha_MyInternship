const songs = [
  {
    title: "28",
    artist: "Ruth B ft. Dean Lewis",
    src: "media/Ruth-B-feat-Dean-Lewis-28-(CeeNaija.com).mp3",
    duration: "3:42",
    gradient: ["#3b0764", "#be185d"],
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    src: "media/Blinding Lights - The Weeknd.mp3",
    duration: "3:20",
    gradient: ["#1e003d", "#ff0055"],
  },
  {
    title: "Golden Hour",
    artist: "JVKE",
    src: "media/JVKE golden hour official music video.mp3",
    duration: "3:29",
    gradient: ["#431407", "#d97706"],
  },
  {
    title: "Heat Waves",
    artist: "Glass Animals",
    src: "media/Heat Waves - Glass Animals.mp3",
    duration: "3:59",
    gradient: ["#0c1445", "#3b82f6"],
  },
  {
    title: "As It Was",
    artist: "Harry Styles",
    src: "media/Harry Styles - As It Was (Official Video).mp3",
    duration: "2:37",
    gradient: ["#042f2e", "#2dd4bf"],
  },
];

function generateRandomGradient() {
  const primaryHue = Math.floor(Math.random() * 360);
  const secondaryHue = (primaryHue + 40) % 360;

  return [`hsl(${primaryHue}, 85%, 20%)`, `hsl(${secondaryHue}, 90%, 55%)`];
}

let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let isLiked = false;
let playlistOpen = false;

const songEl = document.getElementById("song");
const progressEl = document.getElementById("progress");
const ctrlIcon = document.getElementById("ctrlIcon");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const volumeEl = document.getElementById("volume");
const albumArt = document.getElementById("albumArt");
const bgGlow = document.getElementById("bgGlow");
const playlistEl = document.getElementById("playlist");

function formatTime(secs) {
  if (isNaN(secs) || secs < 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function updateSlider(el) {
  const pct = el.max ? (el.value / el.max) * 100 : parseFloat(el.value) * 100;
  el.style.background = `linear-gradient(to right, #8b5cf6 ${pct}%, rgba(255,255,255,0.08) ${pct}%)`;
}

function loadSong(index, autoplay = false) {
  const s = songs[index];

  document.getElementById("songTitle").textContent = s.title;
  document.getElementById("songArtist").textContent = s.artist;

  const currentGradient = generateRandomGradient();
  const color1 = currentGradient[0];
  const color2 = currentGradient[1];

  albumArt.style.background = `conic-gradient(from 0deg, ${color1}, ${color2}, ${color1})`;

  bgGlow.style.background = `radial-gradient(ellipse 80% 60% at 50% 40%, ${color2.replace(")", ", 0.1")}, transparent 70%)`;

  progressEl.value = 0;
  progressEl.max = 100;
  updateSlider(progressEl);
  currentTimeEl.textContent = "0:00";
  totalTimeEl.textContent = s.duration;

  if (s.src) {
    songEl.src = s.src;
    songEl.load();
  } else {
    songEl.src = "";
  }

  document.querySelectorAll(".playlist-item").forEach((el, i) => {
    el.classList.toggle("active", i === index);
  });

  const activeItem = document.querySelector(".playlist-item.active");
  if (activeItem) {
    const artBadge = activeItem.querySelector(".playlist-art");
    if (artBadge)
      artBadge.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
  }

  if (autoplay) {
    playSong();
  } else {
    pauseSong();
  }
}

function playSong() {
  if (songEl.src) {
    songEl.play().catch(() => {});
  }
  isPlaying = true;
  ctrlIcon.classList.replace("fa-play", "fa-pause");
  albumArt.classList.add("playing");
}

function pauseSong() {
  songEl.pause();
  isPlaying = false;
  ctrlIcon.classList.replace("fa-pause", "fa-play");
  albumArt.classList.remove("playing");
}

function playPause() {
  isPlaying ? pauseSong() : playSong();
}

function nextSong() {
  let next;
  if (isShuffle) {
    next = Math.floor(Math.random() * songs.length);
  } else {
    next = (currentIndex + 1) % songs.length;
  }
  currentIndex = next;
  loadSong(currentIndex, true);
}

function prevSong() {
  if (songEl.currentTime > 3) {
    songEl.currentTime = 0;
    return;
  }
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex, isPlaying);
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  document.getElementById("shuffleNavBtn").style.color = isShuffle
    ? "var(--accent)"
    : "";
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  document.getElementById("repeatBtn").classList.toggle("active", isRepeat);
}

function toggleLike() {
  isLiked = !isLiked;
  const btn = document.getElementById("likeBtn");
  btn.innerHTML = isLiked
    ? '<i class="fa-solid fa-heart" style="color:#e879f9"></i>'
    : '<i class="fa-regular fa-heart"></i>';
}

function togglePlaylist() {
  playlistOpen = !playlistOpen;
  playlistEl.classList.toggle("open", playlistOpen);
}

songEl.addEventListener("timeupdate", () => {
  if (!songEl.duration) return;
  progressEl.max = songEl.duration;
  progressEl.value = songEl.currentTime;
  currentTimeEl.textContent = formatTime(songEl.currentTime);
  totalTimeEl.textContent = formatTime(songEl.duration);
  updateSlider(progressEl);
});

progressEl.addEventListener("input", () => {
  songEl.currentTime = progressEl.value;
  updateSlider(progressEl);
});

progressEl.addEventListener("change", () => {
  if (isPlaying) playSong();
});

songEl.addEventListener("ended", () => {
  if (isRepeat) {
    songEl.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

songEl.volume = parseFloat(volumeEl.value);
updateSlider(volumeEl);

volumeEl.addEventListener("input", () => {
  songEl.volume = parseFloat(volumeEl.value);
  updateSlider(volumeEl);
  const icon = document.getElementById("volIcon");
  if (songEl.volume === 0) icon.className = "fa-solid fa-volume-xmark";
  else if (songEl.volume < 0.5) icon.className = "fa-solid fa-volume-low";
  else icon.className = "fa-solid fa-volume-high";
});

function buildPlaylist() {
  playlistEl.innerHTML = songs
    .map(
      (s, i) => `
        <div class="playlist-item ${i === 0 ? "active" : ""}" onclick="selectSong(${i})">
          <div class="playlist-art" style="background: linear-gradient(135deg, ${s.gradient[0]}, ${s.gradient[1]})">
            ${i + 1}
          </div>
          <div class="playlist-info">
            <div class="playlist-title">${s.title}</div>
            <div class="playlist-artist">${s.artist}</div>
          </div>
          <div class="now-playing-dot"></div>
          <div class="playlist-dur">${s.duration}</div>
        </div>
      `,
    )
    .join("");
}

function selectSong(index) {
  currentIndex = index;
  loadSong(index, true);
}

document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;
  if (e.code === "Space") {
    e.preventDefault();
    playPause();
  }
  if (e.code === "ArrowRight") nextSong();
  if (e.code === "ArrowLeft") prevSong();
});

buildPlaylist();
loadSong(0);
