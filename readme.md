# sorted-iterators-find-matching

**Given an [iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)/list of sorted items, find matching items in another (sorted) iterator/list.**

[![npm version](https://img.shields.io/npm/v/sorted-iterators-find-matching.svg)](https://www.npmjs.com/package/sorted-iterators-find-matching)
[![build status](https://api.travis-ci.org/derhuerst/sorted-iterators-find-matching.svg?branch=master)](https://travis-ci.org/derhuerst/sorted-iterators-find-matching)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/sorted-iterators-find-matching.svg)
![minimum Node.js version](https://img.shields.io/node/v/sorted-iterators-find-matching.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)


## Installation

```shell
npm install sorted-iterators-find-matching
```


## Usage

Let's say you have a *sorted* list of people

```js
const people = [
	{id: 'ada', name: 'Ada'},
	{id: 'bob', name: 'Bob'},
	{id: 'dora', name: 'Dora'},
]
```

and a list of books, *sorted by who owns them*:

```js
const books = [
	// Ada has no books.
	{nr: 5, belongsTo: 'bob'},
	{nr: 1, belongsTo: 'bob'},
	{nr: 4, belongsTo: 'bob'},
	// We don't know who Carlos is.
	{nr: 6, belongsTo: 'carlos'},
	{nr: 2, belongsTo: 'carlos'},
	{nr: 0, belongsTo: 'dora'},
	{nr: 3, belongsTo: 'elisa'},
]
```

**Because both lists are sorted by the "person ID", all books owned by a single person occur *consecutively*. Therefore, we can tell which books a person owns, only by reading the books list until it mentions a *different* person.** This is what `sorted-iterators-find-matching` does:

```js
const iterateMatching = require('sorted-iterators-find-matching')

// We define a function that, given a person, tells if the book belongs to
// - that person, or
// - a person with an alphabetically ealier/lower person ID, or
// - a person with an alphabetically later/higher person ID.
const matchBookWithPerson = (person, book) => {
	if (person.id === book.belongsTo) return 0
	return person.id < book.belongsTo ? -1 : 1
}
const ownedBooks = iterateMatching(matchBookWithPerson, books)

for (const person of people) {
	console.log(`${person.name} has these books:`)
	for (const book of ownedBooks(person)) console.log(`- ${book.nr}`)
}
```

### async iterators

If you have two [async iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator), use `sorted-iterators-find-matching/async`:

```js
const iterateMatching = require('sorted-iterators-find-matching/async')

const match = (itemOfListA, itemOfListB) => {
	if (itemOfListA.field === itemOfListB.field) return 0
	return itemOfListA.field < itemOfListB.field ? -1 : 1
}
const matching = iterateMatching(match, listA)

// Note the `for await`!
for await (const itemA of listA) {
	for await (const itemB of matching(itemA)) {
		console.log(itemA, itemB)
	}
}
```


## Contributing

If you have a question or need support using `sorted-iterators-find-matching`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, use [the issues page](https://github.com/derhuerst/sorted-iterators-find-matching/issues).
