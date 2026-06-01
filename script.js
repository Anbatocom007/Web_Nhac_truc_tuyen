// ========== DATA ==========
const songs = [
  { title:"Wrong Times", artist:"Puppy, Dangrangto", file:"songs/wrong-times.mp3", image:"images/song1.jpg", genre:"English" },
  { title:"Blue Tequila", artist:"Táo", file:"songs/blue-tequila.mp3", image:"images/song2.jpg", genre:"V-Pop" },
  { title:"Đã Từng Là", artist:"Vũ.", file:"songs/da-tung-la.mp3", image:"images/song3.jpg", genre:"Ballad" },
  { title:"Vì Anh Đâu Có Biết", artist:"Madihu ft. Vũ.", file:"songs/vi-anh-dau-co-biet.mp3", image:"images/song4.jpg", genre:"Ballad" },
  { title:"Lạ Lùng", artist:"Vũ.", file:"songs/la-lung.mp3", image:"images/song5.jpg", genre:"Ballad" },
  { title:"Bình Yên", artist:"Vũ. ft. Binz", file:"songs/binh-yen.mp3", image:"images/song6.jpg", genre:"Chill" },
  { title:"Exit Sign", artist:"HIEUTHUHAI ft. marzuz", file:"songs/exit-sign.mp3", image:"images/song7.jpg", genre:"Rap" },
  { title:"Thủy Triều", artist:"Quang Hùng MasterD", file:"songs/thuy-trieu.mp3", image:"images/song8.jpg", genre:"V-Pop" },
  { title:"Trói Em Lại", artist:"Quang Hùng MasterD", file:"songs/troi-em-lai.mp3", image:"images/song9.jpg", genre:"V-Pop" },
  { title:"Tràn Bộ Nhớ", artist:"Dương Domic", file:"songs/tran-bo-nho.mp3", image:"images/song10.jpg", genre:"Chill" },
  { title:"Mất Kết Nối", artist:"Dương Domic", file:"songs/mat-ket-noi.mp3", image:"images/song11.jpg", genre:"Chill" },
  { title:"Từng Ngày Yêu Em", artist:"Madihu", file:"songs/tung-ngay-yeu-em.mp3", image:"images/song12.jpg", genre:"Ballad" },
  { title:"Hãy Trao Cho Anh", artist:"Sơn Tùng M-TP", file:"songs/hay-trao-cho-anh.mp3", image:"images/song13.jpg", genre:"V-Pop" },
  { title:"Âm Thầm Bên Em", artist:"Sơn Tùng M-TP", file:"songs/am-tham-ben-em.mp3", image:"images/song14.jpg", genre:"V-Pop" },
  { title:"Nơi Này Có Anh", artist:"Sơn Tùng M-TP", file:"songs/noi-nay-co-anh.mp3", image:"images/song15.jpg", genre:"V-Pop" },
  { title:"Tuyển Bạn Gái", artist:"OgeNus, Dangrangto", file:"songs/tuyen-ban-gai.mp3", image:"images/song16.jpg", genre:"Rap" }
];

// ========== DOM ELEMENTS ==========
const playerTitle = document.getElementById("player-title");
const playerArtist = document.getElementById("player-artist");
const playerImage = document.getElementById("player-image");
const audioPlayer = document.getElementById("audio-player");
const trendingList = document.getElementById("trending-list");
const recommendList = document.getElementById("recommend-list");
const chillList = document.getElementById("chill-list");
const hitsList = document.getElementById("hits-list");
const progress = document.getElementById("progress");
const time = document.getElementById("time");
const search = document.getElementById("search");
const volume = document.getElementById("volume");
const muteBtn = document.getElementById("mute-btn");

// ========== STATE ==========
let currentSong = 0;
let shuffle = false;
let repeat = false;
let muted = false;
let likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];

// ========== RENDER ==========
function renderSongs(list, start, end){
  for(let i = start; i < end; i++){
    list.innerHTML += `
      <div class="song-card" onclick="playSong(${i})">
        <img src="${songs[i].image}">
        <h3>${songs[i].title}</h3>
        <p>${songs[i].artist}</p>
        <button class="like" data-song-id="${i}" onclick="toggleLike(${i}, event)">${likedSongs.includes(i) ? "❤️" : "🤍"}</button>
      </div>
    `;
  }
}

renderSongs(trendingList, 0, 4);
renderSongs(recommendList, 4, 8);
renderSongs(chillList, 8, 12);
renderSongs(hitsList, 12, 16);

// ========== PLAYER ==========
function playSong(index){
  currentSong = index;
  audioPlayer.src = songs[index].file;
  audioPlayer.play();
  playerTitle.innerText = songs[index].title;
  playerArtist.innerText = songs[index].artist;
  playerImage.src = songs[index].image;
  playerImage.classList.add("playing");
  document.querySelector(".player-controls button:nth-child(3) i").className = "fa-solid fa-pause";

  // Lưu lịch sử nghe kèm timestamp
  let history = JSON.parse(localStorage.getItem("recentSongs")) || [];
  // Xóa entry cũ của bài này nếu có
  history = history.filter(entry => entry.index !== index);
  // Thêm mới lên đầu với timestamp
  history.unshift({ index, time: Date.now() });
  // Giới hạn 30 bài
  history = history.slice(0, 30);
  localStorage.setItem("recentSongs", JSON.stringify(history));
}

function togglePlay(){
  const icon = document.querySelector(".player-controls button:nth-child(3) i");
  if(audioPlayer.paused){
    audioPlayer.play();
    icon.className = "fa-solid fa-pause";
    playerImage.classList.add("playing");
  } else {
    audioPlayer.pause();
    icon.className = "fa-solid fa-play";
    playerImage.classList.remove("playing");
  }
}

function nextSong(){
  if(shuffle){
    currentSong = Math.floor(Math.random() * songs.length);
  } else {
    currentSong++;
  }
  if(currentSong >= songs.length) currentSong = 0;
  playSong(currentSong);
}

function prevSong(){
  currentSong--;
  if(currentSong < 0) currentSong = songs.length - 1;
  playSong(currentSong);
}

function toggleShuffle(){ shuffle = !shuffle; }
function toggleRepeat(){ repeat = !repeat; }

// ========== AUDIO EVENTS ==========
audioPlayer.addEventListener("timeupdate", () => {
  progress.max = audioPlayer.duration;
  progress.value = audioPlayer.currentTime;
  let current = audioPlayer.currentTime;
  let total = audioPlayer.duration;
  if(!total) return;
  let cm = Math.floor(current / 60);
  let cs = Math.floor(current % 60);
  let tm = Math.floor(total / 60);
  let ts = Math.floor(total % 60);
  time.innerText = `${cm}:${cs.toString().padStart(2,"0")} / ${tm}:${ts.toString().padStart(2,"0")}`;
});

progress.addEventListener("input", () => {
  audioPlayer.currentTime = progress.value;
});

audioPlayer.addEventListener("ended", () => {
  if(repeat){
    playSong(currentSong);
  } else {
    nextSong();
  }
});

// ========== VOLUME ==========
volume.addEventListener("input", () => {
  audioPlayer.volume = volume.value;
});

function toggleMute(){
  muted = !muted;
  audioPlayer.muted = muted;
  muteBtn.innerHTML = muted
    ? '<i class="fa-solid fa-volume-xmark"></i>'
    : '<i class="fa-solid fa-volume-high"></i>';
}

// ========== SEARCH ==========
search.addEventListener("input", () => {
  let value = search.value.toLowerCase();
  document.querySelectorAll(".song-card").forEach(card => {
    let text = card.innerText.toLowerCase();
    card.style.display = text.includes(value) ? "block" : "none";
  });
});

// ========== LIKE ==========
function toggleLike(index, event){
  event.stopPropagation();
  if(likedSongs.includes(index)){
    likedSongs = likedSongs.filter(i => i !== index);
  } else {
    likedSongs.unshift(index);
  }
  localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
  updateLikeUI();
}

function updateLikeUI(){
  document.querySelectorAll(".like").forEach(btn => {
    const songId = parseInt(btn.getAttribute("data-song-id"));
    if(!isNaN(songId)){
      btn.innerHTML = likedSongs.includes(songId) ? "❤️" : "🤍";
    }
  });
}

// ========== NAVIGATION ==========
function goHome(){
  document.querySelector(".top-banner").style.display = "block";
  document.querySelectorAll(".main-content > h1").forEach(h => h.style.display = "block");
  document.getElementById("trending-list").style.display = "grid";
  document.getElementById("recommend-list").style.display = "grid";
  document.getElementById("chill-list").style.display = "grid";
  document.getElementById("hits-list").style.display = "grid";
  document.getElementById("recent-page").style.display = "none";
  document.getElementById("top10-page").style.display = "none";
  document.getElementById("genre-page").style.display = "none";
  document.getElementById("library-page").style.display = "none";
  setActiveMenu(0);
}

function openRecent(){
  hideAllPages();
  setActiveMenu(4);

  const history = JSON.parse(localStorage.getItem("recentSongs")) || [];

  // Helper: format thời gian nghe
  function timeAgo(ts){
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if(mins < 1) return "Vừa xong";
    if(mins < 60) return `${mins} phút trước`;
    if(hours < 24) return `${hours} giờ trước`;
    if(days === 1) return "Hôm qua";
    return `${days} ngày trước`;
  }

  // Phân nhóm: Hôm nay / Hôm qua / Trước đó
  function getGroup(ts){
    const diff = Date.now() - ts;
    if(diff < 86400000) return "Hôm nay";
    if(diff < 172800000) return "Hôm qua";
    return "Trước đó";
  }

  let html = `
    <div class="recent-header">
      <div class="recent-title-row">
        <i class="fa-solid fa-clock-rotate-left" style="color:#1ed760;font-size:26px"></i>
        <h1>Nghe gần đây</h1>
      </div>
      <p>${history.length} bài đã nghe</p>
    </div>
  `;

  if(history.length === 0){
    html += `
      <div class="lib-empty">
        <span>🎵</span>
        <p>Chưa có bài hát nào trong lịch sử</p>
        <small style="color:#555">Phát một bài để bắt đầu</small>
      </div>
    `;
  } else {
    // Nhóm theo thời gian
    const groups = {};
    history.forEach(entry => {
      // Tương thích cả format cũ (số) và mới (object)
      const idx = typeof entry === "object" ? entry.index : entry;
      const ts  = typeof entry === "object" ? entry.time  : Date.now();
      const grp = getGroup(ts);
      if(!groups[grp]) groups[grp] = [];
      groups[grp].push({ idx, ts });
    });

    ["Hôm nay","Hôm qua","Trước đó"].forEach(grp => {
      if(!groups[grp]) return;
      html += `<div class="recent-group-label">${grp}</div>`;
      html += `<div class="recent-list">`;
      groups[grp].forEach(({ idx, ts }) => {
        const s = songs[idx];
        html += `
          <div class="recent-row" onclick="playSong(${idx})">
            <div class="recent-row-img">
              <img src="${s.image}">
              <div class="recent-play-overlay"><i class="fa-solid fa-play"></i></div>
            </div>
            <div class="recent-row-info">
              <h3>${s.title}</h3>
              <p>${s.artist}</p>
            </div>
            <span class="lib-genre-tag">${s.genre}</span>
            <span class="recent-time-ago">${timeAgo(ts)}</span>
            <button class="like" data-song-id="${idx}" onclick="toggleLike(${idx}, event)">${likedSongs.includes(idx) ? "❤️" : "🤍"}</button>
          </div>
        `;
      });
      html += `</div>`;
    });
  }

  document.getElementById("recent-page").innerHTML = html;
  document.getElementById("recent-page").style.display = "block";
}

function showTop10(){
  hideAllPages();
  setActiveMenu(3);

  // Top 10 giả lập — play count tượng trưng
  const top10 = [
    { index:14, plays:2847 },
    { index:12, plays:2631 },
    { index:13, plays:2418 },
    { index:2,  plays:2205 },
    { index:7,  plays:1993 },
    { index:9,  plays:1876 },
    { index:5,  plays:1754 },
    { index:6,  plays:1632 },
    { index:0,  plays:1521 },
    { index:10, plays:1408 },
  ];

  let html = `
    <div class="top10-header">
      <div class="top10-title-row">
        <i class="fa-solid fa-fire" style="color:#f97316;font-size:28px"></i>
        <h1>Top 10 nghe nhiều nhất</h1>
      </div>
      <p>Cập nhật hàng tuần</p>
    </div>
    <div class="top10-list">
  `;

  top10.forEach((item, idx) => {
    const s = songs[item.index];
    const isTop3 = idx < 3;
    const medals = ["🥇","🥈","🥉"];
    html += `
      <div class="top10-row ${isTop3 ? "top3" : ""}" onclick="playSong(${item.index})">
        <div class="top10-rank">
          ${isTop3 ? `<span class="medal">${medals[idx]}</span>` : `<span class="rank-num">${idx + 1}</span>`}
        </div>
        <img src="${s.image}">
        <div class="top10-info">
          <h3>${s.title}</h3>
          <p>${s.artist}</p>
        </div>
        <div class="top10-plays">
          <i class="fa-solid fa-headphones"></i>
          ${item.plays.toLocaleString()}
        </div>
        <button class="like" data-song-id="${item.index}" onclick="toggleLike(${item.index}, event)">${likedSongs.includes(item.index) ? "❤️" : "🤍"}</button>
      </div>
    `;
  });

  html += `</div>`;
  document.getElementById("top10-page").innerHTML = html;
  document.getElementById("top10-page").style.display = "block";
}

function setActiveMenu(index){
  document.querySelectorAll(".menu li").forEach(li => li.classList.remove("active"));
  document.querySelectorAll(".menu li")[index].classList.add("active");
}

// ========== AUTH ==========
let authMode = "login";

function openAuth(mode){
  authMode = mode;
  document.getElementById("auth-popup").style.display = "flex";

  if(mode === "signup"){
    document.getElementById("auth-title").innerText = "Tạo tài khoản";
    document.getElementById("auth-subtitle").innerText = "Tham gia MyMusic miễn phí!";
    document.getElementById("auth-btn-text").innerText = "Đăng ký";
    document.getElementById("field-name").style.display = "block";
    document.getElementById("field-confirm").style.display = "block";
    document.getElementById("auth-forgot").style.display = "none";
    document.getElementById("auth-switch").innerHTML = `Đã có tài khoản? <a href="#" onclick="openAuth('login'); return false">Đăng nhập</a>`;
  } else {
    document.getElementById("auth-title").innerText = "Đăng nhập";
    document.getElementById("auth-subtitle").innerText = "Chào mừng trở lại!";
    document.getElementById("auth-btn-text").innerText = "Đăng nhập";
    document.getElementById("field-name").style.display = "none";
    document.getElementById("field-confirm").style.display = "none";
    document.getElementById("auth-forgot").style.display = "block";
    document.getElementById("auth-switch").innerHTML = `Chưa có tài khoản? <a href="#" onclick="openAuth('signup'); return false">Đăng ký ngay</a>`;
  }
}

function submitAuth(){
  closeAuth();
}

function closeAuth(){
  document.getElementById("auth-popup").style.display = "none";
}

function handleAuthOverlayClick(e){
  if(e.target === document.getElementById("auth-popup")) closeAuth();
}

function togglePassword(){
  const pw = document.getElementById("password");
  const eye = document.getElementById("pw-eye");
  if(pw.type === "password"){
    pw.type = "text";
    eye.className = "fa-solid fa-eye-slash";
  } else {
    pw.type = "password";
    eye.className = "fa-solid fa-eye";
  }
}

// ========== LOADER ==========
window.onload = () => {
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
  }, 1500);
};

// ========== GENRES ==========
const genres = [
  { name:"V-Pop",   icon:"🇻🇳", color:"linear-gradient(135deg,#1DB954,#0a7a35)" },
  { name:"Ballad",  icon:"💙", color:"linear-gradient(135deg,#4f8ef7,#1a3a8f)" },
  { name:"Chill",   icon:"🌙", color:"linear-gradient(135deg,#a78bfa,#5b21b6)" },
  { name:"Rap",     icon:"🎤", color:"linear-gradient(135deg,#f97316,#92400e)" },
  { name:"English", icon:"🌍", color:"linear-gradient(135deg,#0ea5e9,#0369a1)" },
];

function showGenres(){
  hideAllPages();
  setActiveMenu(2);

  let html = `<h1 class="genre-title">Chủ đề & Thể loại</h1><div class="genre-grid">`;
  genres.forEach(g => {
    html += `
      <div class="genre-card" style="background:${g.color}" onclick="showGenreSongs('${g.name}')">
        <span class="genre-icon">${g.icon}</span>
        <span class="genre-name">${g.name}</span>
      </div>
    `;
  });
  html += `</div>`;

  document.getElementById("genre-page").innerHTML = html;
  document.getElementById("genre-page").style.display = "block";
}

function showGenreSongs(genreName){
  const filtered = songs.map((s, i) => ({...s, index: i})).filter(s => s.genre === genreName);
  let html = `
    <div class="genre-songs-header">
      <button class="back-btn" onclick="showGenres()">
        <i class="fa-solid fa-chevron-left"></i> Thể loại
      </button>
      <h1>${genres.find(g => g.name === genreName).icon} ${genreName}</h1>
      <p>${filtered.length} bài hát</p>
    </div>
    <div class="genre-songs-list">
  `;
  filtered.forEach(s => {
    html += `
      <div class="recent-item" onclick="playSong(${s.index})">
        <img src="${s.image}">
        <div>
          <h3>${s.title}</h3>
          <p>${s.artist}</p>
        </div>
        <button class="like" data-song-id="${s.index}" onclick="toggleLike(${s.index}, event)">${likedSongs.includes(s.index) ? "❤️" : "🤍"}</button>
      </div>
    `;
  });
  html += `</div>`;
  document.getElementById("genre-page").innerHTML = html;
}

// ========== LIBRARY ==========
function hideAllPages(){
  document.querySelector(".top-banner").style.display = "none";
  document.querySelectorAll(".main-content > h1").forEach(h => h.style.display = "none");
  document.getElementById("trending-list").style.display = "none";
  document.getElementById("recommend-list").style.display = "none";
  document.getElementById("chill-list").style.display = "none";
  document.getElementById("hits-list").style.display = "none";
  document.getElementById("recent-page").style.display = "none";
  document.getElementById("top10-page").style.display = "none";
  document.getElementById("genre-page").style.display = "none";
  document.getElementById("library-page").style.display = "none";
}

function showLibrary(tab = "all"){
  hideAllPages();
  setActiveMenu(1);

  const recent = JSON.parse(localStorage.getItem("recentSongs")) || [];
  const recentIndexes = recent.map(e => typeof e === "object" ? e.index : e);
  const tabs = [
    { id:"all",    label:"Tất cả" },
    { id:"liked",  label:`Yêu thích (${likedSongs.length})` },
    { id:"recent", label:`Đã nghe (${recent.length})` },
  ];

  let tabHtml = tabs.map(t => `
    <button class="lib-tab ${tab === t.id ? "active" : ""}" onclick="showLibrary('${t.id}')">
      ${t.label}
    </button>
  `).join("");

  let contentHtml = "";

  if(tab === "all"){
    contentHtml = `<div class="lib-grid">`;
    songs.forEach((s, i) => {
      contentHtml += `
        <div class="lib-card" onclick="playSong(${i})">
          <div class="lib-card-img">
            <img src="${s.image}">
            <div class="lib-play-overlay"><i class="fa-solid fa-play"></i></div>
          </div>
          <div class="lib-card-info">
            <h3>${s.title}</h3>
            <p>${s.artist}</p>
            <span class="lib-genre-tag">${s.genre}</span>
          </div>
          <button class="like lib-like" data-song-id="${i}" onclick="toggleLike(${i}, event)">${likedSongs.includes(i) ? "❤️" : "🤍"}</button>
        </div>
      `;
    });
    contentHtml += `</div>`;
  }

  else if(tab === "liked"){
    if(likedSongs.length === 0){
      contentHtml = `<div class="lib-empty"><span>❤️</span><p>Chưa có bài hát yêu thích</p></div>`;
    } else {
      contentHtml = `<div class="lib-list">`;
      likedSongs.forEach((i, idx) => {
        contentHtml += `
          <div class="lib-row" onclick="playSong(${i})">
            <span class="lib-num">${idx + 1}</span>
            <img src="${songs[i].image}">
            <div class="lib-row-info">
              <h3>${songs[i].title}</h3>
              <p>${songs[i].artist}</p>
            </div>
            <span class="lib-genre-tag">${songs[i].genre}</span>
            <button class="remove-like" data-song-id="${i}" onclick="event.stopPropagation(); removeLikeLib(${i})">✕</button>
          </div>
        `;
      });
      contentHtml += `</div>`;
    }
  }

  else if(tab === "recent"){
    if(recent.length === 0){
      contentHtml = `<div class="lib-empty"><span>🕐</span><p>Chưa có bài hát nào đã nghe</p></div>`;
    } else {
      contentHtml = `<div class="lib-list">`;
      recentIndexes.forEach((i, idx) => {
        contentHtml += `
          <div class="lib-row" onclick="playSong(${i})">
            <span class="lib-num">${idx + 1}</span>
            <img src="${songs[i].image}">
            <div class="lib-row-info">
              <h3>${songs[i].title}</h3>
              <p>${songs[i].artist}</p>
            </div>
            <span class="lib-genre-tag">${songs[i].genre}</span>
            <button class="like" data-song-id="${i}" onclick="toggleLike(${i}, event)">${likedSongs.includes(i) ? "❤️" : "🤍"}</button>
          </div>
        `;
      });
      contentHtml += `</div>`;
    }
  }

  document.getElementById("library-page").innerHTML = `
    <div class="lib-header">
      <h1>Your Library</h1>
      <p>${songs.length} bài hát · ${likedSongs.length} yêu thích</p>
    </div>
    <div class="lib-tabs">${tabHtml}</div>
    <div class="lib-content">${contentHtml}</div>
  `;
  document.getElementById("library-page").style.display = "block";
}

function removeLikeLib(index){
  likedSongs = likedSongs.filter(i => i !== index);
  localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
  showLibrary("liked");
  updateLikeUI();
}