'use strict'
  //  |\   /|
  //   \|_|/
  //   /O O\
  // ==\_Y_/==
class Item {
	constructor(className, container) {
		this.container = container
		let item = document.createElement('div')
		item.className = className
		this.item = container.appendChild(item) // <---- Item
		this.item.onmousedown = e => {
			this.coords = this.getCoords(this.item)
			this.shiftX = e.pageX - this.coords.left
			this.shiftY = e.pageY - this.coords.top
			document.onmousemove = e => this.move(e)
			this.item.onmouseup = () => {
    			document.onmousemove = null
    			this.item.onmouseup = null
  			}
		}
		this.item.ondragstart = () => false
		let removeItem = document.createElement('div')
		removeItem.className = 'remove'
		removeItem.textContent = 'X'
		this.removeItem = this.item.appendChild(removeItem)
		this.removeItem.addEventListener('click', () => this.item.remove())
	}
	move(e) {
		this.item.style.left = e.pageX - this.shiftX + 'px'
		this.item.style.top = e.pageY - this.shiftY + 'px'
	}
	getCoords(element) {
		let coords = element.getBoundingClientRect()
		return {
			top: coords.top + pageYOffset,
			left: coords.left + pageXOffset
		}
	}
}
class ImageItem extends Item {
	constructor(className, container, files) {
		super(className, container)
		this.files = files
		if (files.length === 0) {
			this.item.remove()
		} else {
			let img = document.createElement('img')
			img.src = window.URL.createObjectURL(files)
			img.height = this.item.getBoundingClientRect().height
			img.onload = () => window.URL.revokeObjectURL(img.src)
			this.item.appendChild(img)
		}
	}
}
class TextItem extends Item {
	constructor(className, container) {
		super(className, container)
		let textContent = document.createElement('div')
		textContent.className = 'text-content'
		textContent.innerHTML = 'Текст...'
		this.item.appendChild(textContent)
	}
}
// <---------------------------->
let container = document.getElementById('container-editor')
let photoInput = document.getElementById('photo-input')

document.querySelector('#add-item').addEventListener('click', (e) => {
	e.preventDefault()
	new Item('item', container)
})
document.querySelector('#add-photo').addEventListener('click', (e) => {
	if (photoInput) photoInput.click()
	e.preventDefault()
	photoInput.onchange = () => {
		for (let i = 0; i < photoInput.files.length; i++) {
			new ImageItem('item', container, photoInput.files[i])
		}
		photoInput.value = ''
	}
})
document.querySelector('#add-text').addEventListener('click', (e) => {
	e.preventDefault()
	let textItem = new TextItem('item text', container)
})
document.querySelector('#color-set').addEventListener('click', (e) => {
	document.querySelector('#color-set').onchange = () => {
		container.style.backgroundColor = e.target.value

	}
})
document.querySelector('#save').addEventListener('click', (e) => {
	e.preventDefault()
	let itemsJSON = JSON.stringify(container.innerHTML)
	console.log(itemsJSON)
})
