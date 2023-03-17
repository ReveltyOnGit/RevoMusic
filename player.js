
const audioPlayer = document.getElementById("audio-player");
const progressBar = document.getElementById("progress-bar");
const progressBarContainer = document.getElementById("progress-bar-container");
const albumCover = document.getElementById("album-cover");
const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");
const playPauseButton = document.getElementById("playPause-button");
const loopButton = document.getElementById("loop-button");
const colorThief = new ColorThief();

let albumCoverColor;

let playPauseStatus = false;
let loopStatus = false;

let firstLoad = true;

let musicProgress = NaN;

let musicCount = 0;

let indexMusic = 0;

let musicList = [];

function loadMusic(index) {
	fetch('datas.json')
		.then(response => response.json())
		.then(data => {
			musicCount = data.length;
			musicList = data[index];
			displayMusic();
		})
		.catch(error => {
			console.error(error);
		});
}

window.onload = function () {
	loadMusic(indexMusic);
};

function playPause() {
	if (playPauseStatus) {
		audioPlayer.pause();
		playPauseButton.textContent = "▶️";
	} else {
		audioPlayer.play();
		playPauseButton.textContent = "⏸️";
	}
	playPauseStatus = !playPauseStatus;
}

function previousMusic() {
	if (indexMusic > 0) {
		indexMusic--;
		audioPlayer.pause();
		playPauseButton.textContent = "▶️";
		loadMusic(indexMusic);
	}
}

function nextMusic() {
	if (indexMusic + 1 < musicCount) {
		indexMusic++;
		audioPlayer.pause();
		playPauseButton.textContent = "▶️";
		loadMusic(indexMusic);
	} else if (indexMusic + 1 === musicCount) {
		if (loopStatus === false) {
			if (audioPlayer.ended) {
				playPauseButton.textContent = "▶️";
				playPauseStatus = false;
			}
		}
	}
}

function displayMusic() {
	albumCover.src = musicList.albumcoverimg;
	if (albumCover.complete) {
		albumCoverColor = colorThief.getColor(albumCover);
		document.body.style.backgroundColor = `rgb(${albumCoverColor.join(",")})`;
	} else {
		albumCover.addEventListener('load', function () {
			albumCoverColor = colorThief.getColor(albumCover);
			document.body.style.backgroundColor = `rgb(${albumCoverColor.join(",")})`;
		});
	}
	audioPlayer.src = musicList.audiofile;
	songTitle.textContent = musicList.title;
	songArtist.textContent = musicList.artist;
	audioPlayer.title = musicList.title;
	if (playPauseStatus) {
		audioPlayer.play();
		playPauseButton.textContent = "⏸️";
	}
	musicProgress = NaN;
	firstLoad = false;
}

function loopMusic() {
	if (loopStatus) {
		loopButton.textContent = "⏹️";
	} else {
		loopButton.textContent = "🔃";
	}
	loopStatus = !loopStatus;
}

function updateProgressBar() {
	musicProgress = Math.floor((100 / audioPlayer.duration) * audioPlayer.currentTime);
	progressBar.value = musicProgress;
}

audioPlayer.addEventListener("ended", function () {
	if (loopStatus) {
		audioPlayer.play();
	} else {
		nextMusic();
	}
});

function setProgressBar(e) {
	const progress = (e.target.value / 100) * audioPlayer.duration;
	audioPlayer.currentTime = progress;
}

audioPlayer.addEventListener("timeupdate", updateProgressBar);
progressBar.addEventListener("input", setProgressBar);


