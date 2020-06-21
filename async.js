'use strict'

const NONE = Symbol('no item kept')

const createIterateMatching = (compareFn, sortedItems) => {
	if (typeof compareFn !== 'function') {
		throw new TypeError('compareFn must be a function')
	}

	if (!sortedItems) throw new Error('invalid sortedItems')
	if (typeof sortedItems[Symbol.asyncIterator] === 'function') {
		// iterable, get an iterator from it
		sortedItems = sortedItems[Symbol.asyncIterator]()
	}
	if (typeof sortedItems.next !== 'function') {
		throw new Error('sortedItems must be an async iterator or iterable')
	}

	let keptItem = NONE
	const iterateMatching = async function* (model) {
		if (keptItem !== NONE) {
			const cmp = compareFn(model, keptItem)
			if (cmp === 0) {
				// model == keptItem, emit & discard keptItem
				yield keptItem
				keptItem = NONE
			} else if (cmp > 0) {
				// model > keptItem, discard keptItem
				keptItem = NONE
			} else {
				// model < keptItem, keep keptItem, abort fn
				return;
			}
		}

		while (true) {
			const {done, value: item} = await sortedItems.next()
			if (done) return;

			const cmp = compareFn(model, item)
			if (cmp < 0) {
				// model < item, keep item for later
				keptItem = item
				return;
			}
			if (cmp === 0) {
				// model == item, emit item
				yield item
			}
			// model > item, discard item
		}
	}

	return iterateMatching
}

module.exports = createIterateMatching
