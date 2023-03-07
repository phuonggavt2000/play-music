/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. active song
 * 9. crool act
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const DATA_KEY = "playMusic";

const playBtn = $(".btn-toggle-play");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const play = $(".player");
const range = $("#progress");
const btnNext = $(".btn-next");
const btnPrev = $(".btn-prev");
const btnRandom = $(".btn-random");
const btnRepeat = $(".btn-repeat");
const playList = $(".playlist");
var newSongs = [];

const app = {
  currentIndex: 0,
  isPlay: false,
  isRandom: false,
  isRepeat: false,
  isMouseDown: true,
  config: JSON.parse(localStorage.getItem(DATA_KEY)) || {},
  setConfig: function (key, value) {
    (this.config[key] = value),
      localStorage.setItem(DATA_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: "Mang chủng",
      singer: "Âm Khuyết Thi Thinh",
      path: "/assets/music/1.mp3",
      img: "/assets/img/1.jpg",
      status: "",
    },
    {
      name: "Gặp người đúng lúc",
      singer: "Luân Tang",
      path: "/assets/music/2.mp3",
      img: "/assets/img/2.jpg",
      status: "",
    },
    {
      name: "Muốn chết nhưng lại không dám",
      singer: "Tỉnh Lung",
      path: "/assets/music/3.mp3",
      img: "/assets/img/3.jpg",
      status: "",
    },
    {
      name: "Đáp án của bạn",
      singer: "A Nhũng",
      path: "/assets/music/4.mp3",
      img: "/assets/img/4.jpg",
      status: "",
    },
    {
      name: "Hạ còn vương nắng",
      singer: "datkka",
      path: "/assets/music/5.mp3",
      img: "/assets/img/5.jpg",
      status: "",
    },
    {
      name: "Đánh mất em",
      singer: "Quang Đăng trần",
      path: "/assets/music/6.mp3",
      img: "/assets/img/6.jpg",
      status: "",
    },
    {
      name: "Tướng quân",
      singer: "Nhật Phong",
      path: "/assets/music/7.mp3",
      img: "/assets/img/7.jpg",
      status: "",
    },
    {
      name: "Một triệu khả năng",
      singer: "Christine Welch ",
      path: "/assets/music/9.mp3",
      img: "/assets/img/9.jpg",
      status: "",
    },
    {
      name: "Anh mệt rồi",
      singer: "FrankD",
      path: "/assets/music/8.mp3",
      img: "/assets/img/8.jpg",
      status: "",
    },
  ],
  fistSongs: [],
  render: function () {
    const html = this.songs.map((song, index) => {
      return `
        <div class="song ${song.status}" data-index="${index}">
        <div
          class="thumb"
          style="
            background-image: url('${song.img}');
          "
        ></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
        <div class="wave-song">
           <span></span>
           <span></span>
           <span></span>
           <span></span>
           <span></span>
        </div>
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
        `;
    });
    $(".playlist").innerHTML = html.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvent: function () {
    const cd = $(".cd");
    const cdWidth = cd.offsetWidth;
    const _this = this;

    // Tạo animate Api
    const cdThumbAnimate = cdThumb.animate(
      [{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }],
      { duration: 9000, iterations: Infinity }
    );
    cdThumbAnimate.pause();

    // Khi scroll thì cdWidth sẽ giảm xuống
    document.addEventListener("scroll", function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth < 0 ? 0 : newCdWidth + "px";
      cd.style.opacity = newCdWidth / cdWidth;
    });

    //  Khi click vào Bnt play or pause
    playBtn.addEventListener("click", function () {
      if (_this.isPlay) {
        audio.pause();
      } else {
        audio.play();
      }
    });

    audio.onpause = function () {
      _this.isPlay = false;
      play.classList.remove("playing");
      cdThumbAnimate.pause();
      _this.handleWaveSong();
    };

    audio.onplay = function () {
      _this.isPlay = true;
      play.classList.add("playing");
      cdThumbAnimate.play();
      _this.handleWaveSong();
    };

    range.onchange = function () {
      let seekTime = (audio.duration / 100) * this.value;
      audio.currentTime = seekTime;
      _this.isMouseDown = !_this.isMouseDown;
    };

    range.addEventListener("mousedown", function () {
      _this.isMouseDown = !_this.isMouseDown;
    });

    audio.ontimeupdate = function () {
      if (audio.duration && _this.isMouseDown) {
        let CurrentPercent = (audio.currentTime / audio.duration) * 100;
        range.value = CurrentPercent;
      }
    };

    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        btnNext.click();
      }
    };

    btnNext.addEventListener("click", function () {
      _this.currentIndex++;
      if (_this.currentIndex >= $$(".song").length) {
        _this.currentIndex = 0;
      }
      $(".song.active").classList.remove("active");

      _this.loadCurrentSong();
      _this.scrollIntoView();
      audio.play();
    });

    btnPrev.addEventListener("click", function () {
      _this.currentIndex--;
      if (_this.currentIndex < 0) {
        _this.currentIndex = $$(".song").length - 1;
      }
      $(".song.active").classList.remove("active");

      _this.loadCurrentSong();
      _this.scrollIntoView();
      audio.play();
    });

    btnRandom.onclick = function () {
      _this.isRandom = !_this.isRandom;
      btnRandom.classList.toggle("active", _this.isRandom);
      _this.setConfig("isRandom", _this.isRandom);
      _this.randomSong();
      _this.scrollIntoView();
    };

    btnRepeat.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      btnRepeat.classList.toggle("active", _this.isRepeat);
      _this.setConfig("isRepeat", _this.isRepeat);
    };

    playList.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".fas")) {
        if (songNode) {
          _this.currentIndex = songNode.dataset.index;
          _this.render();
          _this.loadCurrentSong();
          audio.play();
        }
      }
    };
  },

  scrollIntoView: function () {
    const songs = $$(".song");

    songs[this.currentIndex].scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  },

  randomSong: function () {
    newSongs = [];
    this.getRandom();
    for (i = 0; i < this.songs.length; i++) {
      newSongs.push(app.songs[newSongs.shift()]);
    }
    if (this.isRandom) {
      app.songs = newSongs;
      this.currentIndex = 0;
      this.render();
      this.loadCurrentSong();
      audio.play();
    } else {
      app.songs = app.fistSongs;
      this.currentIndex = 0;
      this.render();
      this.loadCurrentSong();
      audio.play();
    }
  },

  loadCurrentSong: function () {
    const songs = $$(".song");

    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
    audio.src = this.currentSong.path;
    songs[this.currentIndex].classList.add("active");
  },

  getRandom: function () {
    for (i = 0; i < this.songs.length; i++) {
      let numberRandom = Math.floor(Math.random() * app.songs.length);
      if (!newSongs.includes(numberRandom)) {
        newSongs.push(numberRandom);
      }
    }
    if (newSongs.length < this.songs.length) {
      this.getRandom();
    }
  },

  setFistSong: function () {
    this.fistSongs = this.songs;
  },

  handleWaveSong: function () {
    if ($(".wave-song.active")) {
      $(".wave-song.active").classList.remove("active");
    }
    $$(".wave-song")[this.currentIndex].classList.toggle("active", this.isPlay);
  },

  loadConfig: function () {
    this.isRandom = !this.config.isRandom;
    this.isRepeat = !this.config.isRepeat;
    btnRandom.click();
    btnRepeat.click();
  },

  start: function () {
    this.setFistSong();
    this.defineProperties();
    this.handleEvent();
    this.render();
    this.loadConfig();
    this.loadCurrentSong();
  },
};

app.start();
