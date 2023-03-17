
const audioPlayer = document.getElementById("audio-player");
const progressBar = document.getElementById("progress-bar");
const progressBarContainer = document.getElementById("progress-bar-container");
const albumCover = document.getElementById("album-cover");
const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");
const playPauseButton = document.getElementById("playPause-button");
const loopButton = document.getElementById("loop-button");
const bassButton = document.getElementById("bass-button");
const revoEngineText = document.getElementById("revomusic-engine-text")
const colorThief = new ColorThief();

let audioContext;
let audioContextSrc;
let bassBooster = null;

let albumCoverColor;

let togglePage = 1;

let playPauseStatus = false;
let loopStatus = false;
let bassBoostStatus = false;

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
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		if (window.navigator.standalone === false) {
			document.getElementById("music-player").style.display = "none";
			document.getElementById("web-app-error").style.display = "block";
		}
	}
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

function bassBoostToggle() {
	if (bassBooster === null) {
		audioContext = new AudioContext();
		audioContextSrc = audioContext.createMediaElementSource(audioPlayer);
		bassBooster = audioContext.createBiquadFilter();
		bassBooster.type = "lowshelf";
		bassBooster.frequency.value = 200;
		bassBooster.gain.value = 0;
		audioContextSrc.connect(bassBooster);
		bassBooster.connect(audioContext.destination);
	}
	if (bassBoostStatus) {
		bassBooster.gain.value = 0;
		bassButton.textContent = "🔇";
		revoEngineText.textContent = "Désactivé • RevoMusic Audio Engine"
		bassBoostStatus = false;
	} else {
		bassBooster.gain.value = 7;
		bassButton.textContent = "💥";
		revoEngineText.textContent = "Activé • RevoMusic Audio Engine"
		bassBoostStatus = true;
	}
}


function moreButtonToggle() {
	if (togglePage === 1) {
		document.getElementById("song-control-container").style.display = "none";
		document.getElementById("other-control-container").style.display = "flex";
		togglePage = 2;
	} else if (togglePage === 2) {
		document.getElementById("song-control-container").style.display = "flex";
		document.getElementById("other-control-container").style.display = "none";
		togglePage = 1;
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


