'use strict'

const {deepStrictEqual} = require('assert')
const matching = require('.')
const matchingAsync = require('./async')

// example from readme

const ADA = {id: 'ada'}
const BOB = {id: 'bob'}
const DORA = {id: 'dora'}
const people = [ADA, BOB, DORA]

const book5 = {belongsTo: 'bob'}
const book1 = {belongsTo: 'bob'}
const book4 = {belongsTo: 'bob'}
const book6 = {belongsTo: 'carlos'}
const book2 = {belongsTo: 'carlos'}
const book0 = {belongsTo: 'dora'}
const book3 = {belongsTo: 'elisa'}
const books = [book5, book1, book4, book6, book2, book0, book3]

const matchBookWithPerson = (person, book) => {
	if (person.id === book.belongsTo) return 0
	return person.id < book.belongsTo ? -1 : 1
}

const testSync = () => {
	// empty listB
	deepStrictEqual(
		Array.from(matching(() => 0, [])(ADA)),
		[]
	)

	// never matching
	deepStrictEqual(
		Array.from(matching(() => -1, books)(BOB)),
		[]
	)
	deepStrictEqual(
		Array.from(matching(() => 1, books)(BOB)),
		[]
	)

	// example from readme
	const ownedBooks = matching(matchBookWithPerson, books)
	deepStrictEqual(
		Array.from(people).flatMap(p => [
			p,
			Array.from(ownedBooks(p)),
		]),
		[
			ADA, [],
			BOB, [book5, book1, book4],
			DORA, [book0],
		]
	)
}

const testAsync = async () => {
	const asyncIterableFromArray = (arr) => ({
		[Symbol.asyncIterator]: async function* () {
			for (let i = 0; i < arr.length; i++) yield arr[i]
		},
	})
	const collect = async (asyncIterable) => {
		const vs = []
		for await (const v of asyncIterable) vs.push(v)
		return vs
	}

	const asyncPeople = asyncIterableFromArray(people)
	const asyncBooks = asyncIterableFromArray(books)

	// empty listB
	const asyncEmpty = (async function* () {})()
	deepStrictEqual(
		await collect(matchingAsync(() => 0, asyncEmpty)(ADA)),
		[]
	)

	// never matching
	deepStrictEqual(
		await collect(matchingAsync(() => -1, asyncBooks)(BOB)),
		[]
	)
	deepStrictEqual(
		await collect(matchingAsync(() => 1, asyncBooks)(BOB)),
		[]
	)

	// example from readme
	const ownedBooks = matchingAsync(matchBookWithPerson, asyncBooks)
	const res = []
	for await (const p of asyncPeople) {
		res.push(p, await collect(ownedBooks(p)))
	}
	deepStrictEqual(res, [
		ADA, [],
		BOB, [book5, book1, book4],
		DORA, [book0],
	])
}

// testSync() // todo
testAsync().catch((err) => {
	console.error(err)
	process.exit(1)
})
