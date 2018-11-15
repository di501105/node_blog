const pageConfig = {
  perpage: 10,
};

const pagination = (snapshot, current, category = '') => {
  //分頁
  const totalResult = snapshot.length;
  const pageTotal = Math.ceil(totalResult / pageConfig.perpage); //總頁數
  let currentPage = current; //當前頁數
  if (currentPage > pageTotal) {
    currentPage = pageTotal;
  }
  //使用結果反推公式
  const minItem = (currentPage * pageConfig.perpage) - pageConfig.perpage + 1;//4
  const maxItem = (currentPage * pageConfig.perpage); //6

  const data = [];
  let i = 0;
  snapshot.forEach((snapshotChild) => {
    i += 1;
    if (i >= minItem && i <= maxItem) {
      const item = snapshotChild;
      item.num = i;
      data.push(item);
    }
  });
  const page = {
    pageTotal,
    currentPage,
    hasPre: currentPage > 1,
    hasNext: currentPage < pageTotal,
    category,
  };
  return {
    page,
    data,
  };

  // console.log(`總資料${totalResult} 每頁數量${perpage} 總頁數${pageTotal} ${minItem} ${maxItem}`);
};


module.exports = pagination;