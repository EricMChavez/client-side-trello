'use strict';
var dragCard = '';
var dragLane = '';
var dragPosition = '';
var dragCardHeight;
var editedCard;
let trashcan = [];
let trash = document.getElementById('trash');
trash.addEventListener('dragover', hover);
trash.addEventListener('dragenter', nothing);
trash.addEventListener('dragleave', unhover);
trash.addEventListener('drop', trashDrop);
function trashDrop(e) {
	e.preventDefault();
	if (dragCard != '') {
		dragCard.style.display = 'none';
		trashcan.push(dragCard);
		dragCard = '';
		clearSpaces();
	}
	if (dragLane != '') {
		dragLane.style.display = 'none';
		trashcan.push(dragLane);
		dragLane = '';
		clearSpaces();
	}
	unhover(e);
}
function nothing(e) {
	e.preventDefault();
}
function unhover(e) {
	e.preventDefault();
	let trash = document.getElementById('trash');
	trash.style.backgroundColor = '';
	trash.style.color = 'black';
}
function hover(e) {
	e.preventDefault();
	let trash = document.getElementById('trash');
	trash.style.backgroundColor = 'black';
	trash.style.color = 'white';
}
function tagCards() {
	let cards = document.getElementsByClassName('card');
	for (let card of cards) {
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
	for (let lane of lanes) {
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
	dragCardHeight = window.getComputedStyle(dragCard, null).getPropertyValue('height');
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
		space.style.height = dragCardHeight;

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
			space.style.height = dragCardHeight;

			space.addEventListener('dragover', dragOver);
			space.addEventListener('drop', dropCard);
			this.insertAdjacentElement('afterend', space);
		} else {
			dragPosition = 'up';
		}
	}
	if (dragLane != '' && this.className == 'swimlane') {
		let laneMid = this.offsetLeft;
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
	if (dragLane != '') {
		dragLane.style.display = 'block';
		let space = document.getElementsByClassName('space')[0];
		space.parentNode.insertBefore(dragLane, space);
		dragLane = '';
	}
	if (dragCard != '') {
		dragCard.style.display = 'block';
		let space = document.getElementsByClassName('space')[0];
		space.parentNode.insertBefore(dragCard, space);
		dragCard = '';
	}
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
function editCard(card) {
	document.getElementById('greyOut').style.display = 'block';
	document.getElementById('cardEditer').style.display = 'block';
	document.getElementById('inputTitle').value = card.childNodes[0].innerHTML;
	document.getElementById('inputBody').value = card.childNodes[1].innerHTML;
	editedCard = card;
}
function endEdit() {
	document.getElementById('greyOut').style.display = 'none';
	document.getElementById('cardEditer').style.display = 'none';
}
function updateCard() {
	editedCard.childNodes[0].innerHTML = document.getElementById('inputTitle').value;
	editedCard.childNodes[1].innerHTML = document.getElementById('inputBody').value;
	endEdit();
	setDropzone();
}
function cardFactory() {
	let title = document.getElementById('newCardTitle').value;
	let newCard = document.createElement('div');
	newCard.classList = 'card';
	newCard.draggable = 'true';
	newCard.innerHTML = `<div onclick='editCard(this.parentNode)' class="cardTitle">${title}</div><div class='cardBody'></div>`;
	let position = document.getElementById('cardMaker').parentElement;
	position.insertAdjacentElement('beforebegin', newCard);
	document.getElementById('newCardTitle').value = '';
	document.getElementById('newCardTitle').focus();
	tagCards();
	setDropzone();
}
function grabCardMaker(pushed) {
	let allBtns = document.getElementsByClassName('cardBtn');
	for (let btn of allBtns) {
		btn.style.display = 'flex';
	}
	pushed.style.display = 'none';
	let cardMaker = document.getElementById('cardMaker');
	cardMaker.style.display = 'flex';
	document.getElementById('newCardTitle').value = '';
	pushed.insertAdjacentElement('beforebegin', cardMaker);
	document.getElementById('newCardTitle').focus();
}
function hideCardMaker() {
	if (document.getElementById('newCardTitle').value == '') {
		document.getElementById('cardMaker').style.display = 'none';
		let allBtns = document.getElementsByClassName('cardBtn');
		for (let btn of allBtns) {
			btn.style.display = 'flex';
		}
	}
}
function laneMaker() {
	document.getElementById('laneBtn').style.display = 'none';
	document.getElementById('laneMaker').style.display = 'flex';
	document.getElementById('newLaneTitle').focus();
}
function hideLaneMaker() {
	if (document.getElementById('newLaneTitle').value == '') {
		document.getElementById('laneBtn').style.display = 'flex';
		document.getElementById('laneMaker').style.display = 'none';
	}
}
function laneFactory() {
	let title = document.getElementById('newLaneTitle').value;
	let newLane = document.createElement('div');
	newLane.classList = 'swimlane';
	newLane.draggable = 'true';
	newLane.innerHTML = `<div contenteditable="true" class="laneTitle">${title}</div><div class="card dropzone"><div onclick="grabCardMaker(this)" class="cardBtn">+ Add Card</div></div>`;
	let position = document.getElementById('laneMaker');
	position.insertAdjacentElement('beforebegin', newLane);
	document.getElementById('newLaneTitle').value = '';
	hideLaneMaker();
	setDropzone();
	tagLanes();
	tagCards();
}
function restore() {
	let trashed = trashcan.pop();
	if (trashed) {
		trashed.style.display = 'block';
	}
}
function setDropzone() {
	let zones = document.getElementsByClassName('dropzone');
	for (let zone of zones) {
		zone.style.height = window.innerHeight - zone.offsetTop - 30 + 'px';
	}
}
