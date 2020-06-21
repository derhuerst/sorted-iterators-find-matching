'use strict'

const matching = require('.')
const matchingAsync = require('./async')

const people = [
	{id: 'ada', name: 'Ada'},
	{id: 'bob', name: 'Bob'},
	{id: 'dora', name: 'Dora'},
]
const books = [
	{nr: 5, belongsTo: 'bob'},
	{nr: 1, belongsTo: 'bob'},
	{nr: 4, belongsTo: 'bob'},
	{nr: 6, belongsTo: 'carlos'},
	{nr: 2, belongsTo: 'carlos'},
	{nr: 0, belongsTo: 'dora'},
	{nr: 3, belongsTo: 'elisa'},
]

const matchBookWithPerson = (person, book) => {
	if (person.id === book.belongsTo) return 0
	return person.id < book.belongsTo ? -1 : 1
}

// sync iteration

const ownedBooks = matching(matchBookWithPerson, books)
for (const person of people) {
	console.log(`${person.name} has these books:`)
	for (const book of ownedBooks(person)) {
		console.log(`- ${book.nr}`)
	}
}

// async iteration

const asyncIterableFromArray = async function* (arr) {
	for (let i = 0; i < arr.length; i++) yield arr[i]
}
const asyncBooks = asyncIterableFromArray(books)
const asyncPeople = asyncIterableFromArray(people)

;(async () => {
	const ownedBooks = matchingAsync(matchBookWithPerson, asyncBooks)
	for await (const person of asyncPeople) {
		console.log(`${person.name} has these books:`)
		for await (const book of ownedBooks(person)) {
			console.log(`- ${book.nr}`)
		}
	}
})()
.catch((err) => {
	console.error(err)
	process.exit(1)
})
