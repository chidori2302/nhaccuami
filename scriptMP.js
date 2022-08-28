// 1. render song
// 2. Scroll top
// 3. Play/pause/seek 
// 4. CD rotate 
// 5. next/prev 
// 6. Random
// 7. next/repeat when end 
// 8. active song 
// 9. Scroll active song into view 
// 10. play song when click

const $=document.querySelector.bind(document);
const $$=document.querySelectorAll.bind(document);
const playIcon = $(`.player`);
let isPlaying = false;
let isRandom = false;
let isRepeat = false;
const cd = $(`.cd`);
const playlist = $(`.playlist`);
const heading = $(`header h2`);
const cdThumb = $(`.cd-thumb`);
const audio = $(`#audio`);
const playBtn = $(`.btn-toggle-play`);
const progress = $(`#progress`);
const nextBtn = $(`.btn-next`);
const prevBtn = $(`.btn-prev`);
const randomBtn = $(`.btn-random`);
const repeatBtn = $(`.btn-repeat`);

const cdThumbAnimate = cdThumb.animate([
    {transform: `rotate(360deg)`}
], {
    duration: 10000,
    iterations: Infinity 
})
cdThumbAnimate.pause();

const app = {
    curIndex: 0,
    
  songs: [
        {
            name: `Dreamer`,
            singer: `Eiko`,
            img: `./img7.jpg`,
            path: `./Dreamer - Eiko.mp3`
            
        },
        {
            name: `Believe In You`,
            singer: `Nonoc`,
            img: `./img2.jpg`,
            path: `./Believe In You.mp3`
        },
        {
            name: `Tsubame`,
            singer: `Yoasobi`,
            img: `./img3.jpg`,
            path: `./Tsubame - YOASOBI_ Midorizu.mp3`
        },
        {
            name: `Hito Shibai`,
            singer: `Fuchigami Mai`,
            img: `./img4.jpg`,
            path: `./HitoShibaiClassroomOfTheEliteSeason2Ending-FuchigamiMai-7583596.mp3`
        },
        {
            name: `Cứ Thở Đi`,
            singer: `Đức Phúc, Juky San`,
            img: `./img5.jpg`,
            path: `./Cu Tho Di - Duc Phuc_ Juky San.mp3`
        },
        {
            name: `Dance In The Game`,
            singer: `ZAQ`,
            img: `./img6.jpg`,
            path: `./DanceInTheGame-ZAQ-7610102.mp3`
        },
        {
            name: `Skeleton Knight in Another World`,
            singer: `DIALOGUE+`,
            img: `./img1.jpg`,
            path: `./01. 僕らが愚かだなんて誰が言った.mp3`
        },
        {
            name: `Feeling Good`,
            singer: `Eiko`,
            img: `./img8.jpg`,
            path: `./Feeling Good気分上々Kibun Joujou 歌詞 Lyrics KANROMENG.mp3`
        }
],
    render: function(){
        let htmls = app.songs.map((song, index)=>{
            return `<div data-index="${index}" class="song ${index === this.curIndex ? `active`:``}">
            <div class="thumb" style="background-image: url('${song.img}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        });
        $(`.playlist`).innerHTML = htmls.join(``);
    },
    handleEvent: function(){
        //Scroll
        let cdWidth = cd.offsetWidth;
        document.onscroll = function(){
            let scrollTop = window.scrollY || document.documentElement.scrollTop;
            let newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0? newCdWidth+`px`: 0;
            cd.style.opacity = newCdWidth/cdWidth;
        }
        //Play,Pause
        playBtn.onclick = function () {
            if (isPlaying){audio.pause();}
            else {audio.play();}
            
        }
        audio.onplay = function(){
            isPlaying = true;
            playIcon.classList.add("playing");
            cdThumbAnimate.play()
        }    
        audio.onpause = function(){
            isPlaying = false;
            playIcon.classList.remove("playing");
            cdThumbAnimate.pause()
        }  
        //When audio play
        audio.ontimeupdate=function(){
            progress.value = audio.currentTime / audio.duration*100;
        }  
        progress.onchange = function(){
            audio.currentTime = audio.duration/100*progress.value;
        }
        //Next,Prev
        nextBtn.onclick=function(){
            if (isRandom) {
                app.randomSong();
            } if (isRepeat) {
                audio.play()
            }
            else {
                app.nextSong();
            };
            audio.play();
            app.render();
            app.scrollInToView()
        }
        prevBtn.onclick=function(){
            if (isRandom) {
                app.randomSong();
            } else {
                app.prevSong();
            };
            
            audio.play()
            app.render();
        }
        //Random song
        randomBtn.onclick = function(){
            isRandom=!isRandom;
            randomBtn.classList.toggle(`active`, isRandom);

        }
        //End Song next
        audio.onended = function(){
            nextBtn.click();
        }
        //Repeat song
        repeatBtn.onclick = function(){
            isRepeat=!isRepeat;
            repeatBtn.classList.toggle(`active`, isRepeat);
        }
        //Choose song
        playlist.onclick = function(e) {
            let songNode = e.target.closest(`.song:not(.active)`)
            app.curIndex = Number(songNode.dataset.index)
            console.log(app.curIndex)
            app.getSong()
            audio.play()
            app.render()
        }

    },
    getSong: function(){
        heading.innerText = this.songs[this.curIndex].name;
        cdThumb.style = `background-image: url('${this.songs[this.curIndex].img}')`;
        audio.src=this.songs[this.curIndex].path;
    },
    
    nextSong: function(){
        this.curIndex++;
        if(this.curIndex>=this.songs.length){
            this.curIndex=0;
        };
        this.getSong();
    },
    prevSong: function(){
        this.curIndex--;
        if(this.curIndex<0){
            this.curIndex=this.songs.length-1;
        };
        this.getSong();
    },
    randomSong: function(){
        let nextIndex
        do {
            nextIndex=Math.floor(Math.random() * this.songs.length);
        }while(nextIndex === this.curIndex);
        this.curIndex = nextIndex;
        this.getSong();
    },
    scrollInToView: function(){
        $(`.song.active`).scrollIntoView({
            behavior: "smooth", 
            block: "end", 
            inline: "nearest"});
    },
    start: function(){
        this.getSong();
        this.handleEvent();
        this.render();
    }
}
app.start();