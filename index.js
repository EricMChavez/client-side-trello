'use strict';
var dragCard = '';
var dragLane = '';
var dragPosition = '';
function tagCards() {
	let cards = document.getElementsByClassName('card');
	for (const card of cards) {
		card.addEventListener('dragstart', dragStartCard);
		card.addEventListener('dragend', dragEnd);
		card.addEventListener('dragover', dragOver);
		card.addEventListener('dragenter', dragEnterCard);
		card.addEventListener('dragleave', dragLeave);
		card.addEventListener('drop', dropCard);
	}
}
function tagLanes() {
	let lanes = document.getElementsByClassName('swimlane');
	for (const lane of lanes) {
		lane.addEventListener('dragstart', dragStartLane);
		lane.addEventListener('dragend', dragEnd);
		lane.addEventListener('dragover', dragOver);
		lane.addEventListener('dragenter', dragEnterLane);
		lane.addEventListener('dragleave', dragLeave);
		lane.addEventListener('drop', dropLane);
	}
}

function dragStartCard(e) {
	dragCard = this;
	e.stopPropagation();
}
function dragStartLane() {
	dragLane = this;
}
function dragEnterCard(e) {
	e.preventDefault();
	if (dragCard != '') {
		clearSpaces();
		let space = document.createElement('div');
		space.classList = 'space smallspace';
		space.addEventListener('dragover', dragOver);
		space.addEventListener('drop', dropCard);
		this.insertAdjacentElement('beforebegin', space);
		dragCard.style.display = 'none';
	}
}
function dropCard() {
	if (dragCard != '') {
		dragCard.style.display = 'block';
		this.parentNode.insertBefore(dragCard, this);
		dragCard = '';
		clearSpaces();
	}
}

function dragEnterLane(e) {
	e.preventDefault();
	if (dragLane != '') {
		clearSpaces();
		let space = document.createElement('div');
		space.classList = 'space largespace';
		space.addEventListener('dragover', dragOver);
		space.addEventListener('drop', dropLane);
		this.parentNode.insertBefore(space, this);
		dragLane.style.display = 'none';
	}
}
function dropLane() {
	if (dragLane != '') {
		dragLane.style.display = 'block';
		this.parentNode.insertBefore(dragLane, this);
		dragLane = '';
		clearSpaces();
	}
}
function dragOver(e) {
	e.preventDefault();
	if (dragCard != '' && this.className == 'card') {
		let cardMid = this.clientHeight / 2 + this.offsetTop;
		if (e.pageY < cardMid && dragPosition == 'up') {
			dragPosition = 'down';
			clearSpaces();
			let space = document.createElement('div');
			space.classList = 'space smallspace';
			space.addEventListener('dragover', dragOver);
			space.addEventListener('drop', dropCard);
			this.insertAdjacentElement('afterend', space);
		} else {
			dragPosition = 'up';
		}
	}
	if (dragLane != '' && this.className == 'swimlane') {
		let laneMid = this.clientWidth / 2 + this.offsetLeft;
		if (e.pageX > laneMid && dragPosition == 'left') {
			dragPosition = 'down';
			clearSpaces();
			let space = document.createElement('div');
			space.classList = 'space largespace';
			space.addEventListener('dragover', dragOver);
			space.addEventListener('drop', dropLane);
			this.insertAdjacentElement('afterend', space);
			dragLane.style.display = 'none';
		} else {
			dragPosition = 'left';
		}
	}
}
function dragEnd() {
	clearSpaces();
	if (dragCard != '') {
		dragCard.style.display = 'block';
	}
	if (dragLane != '') {
		dragLane.style.display = 'block';
	}
	dragCard = '';
	dragLane = '';
}
function dragLeave() {}

function clearSpaces() {
	let spaces = document.getElementsByClassName('space');
	for (let space of spaces) {
		space.parentNode.removeChild(space);
	}
}
tagCards();
tagLanes();
