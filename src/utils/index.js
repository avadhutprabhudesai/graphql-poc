import { uniq, chain } from 'ramda';

function removePrimitiveDulicates() {
  return uniq;
}

function mapIdsToObjects(source) {
  return chain((x) => source.filter((a) => x === a.id));
}

function flatMapArrayByKey(key) {
  return chain((x) => x[key]);
}

export { removePrimitiveDulicates, mapIdsToObjects, flatMapArrayByKey };
