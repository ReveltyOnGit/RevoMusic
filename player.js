
const audioPlayer = document.getElementById("audio-player");
const progressBar = document.getElementById("progress-bar");
const progressBarContainer = document.getElementById("progress-bar-container");
const albumCover = document.getElementById("album-cover");
const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");
const playPauseButton = document.getElementById("playPause-button");
const loopButton = document.getElementById("loop-button");

let playPauseStatus = false;
let loopStatus = false;

let musicProgress = NaN;

let musicCount = 0;

let indexMusic = 0;

let musicList = [];

window.onload = function () {
	loadMusic(indexMusic);
};

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
	} 
}

function displayMusic() {
	audioPlayer.src = musicList.audiofile;
	albumCover.src = musicList.albumcoverimg;
	songTitle.textContent = musicList.title;
	songArtist.textContent = musicList.artist;
	audioPlayer.title = musicList.title;
	if (playPauseStatus) {
		audioPlayer.play();
		playPauseButton.textContent = "⏸️";
	}
	musicProgress = NaN;
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


