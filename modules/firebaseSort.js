const firebaseSort = {
  byData(snapshot, key, value) {
    const sortData = [];
    snapshot.forEach((snapshotChild) => {
      const child = snapshotChild.val();
      if (child[key] === value) {
        sortData.push(child);
      }
    });
    sortData.reverse();
    return sortData;
  }
};

module.exports = firebaseSort;