const pagination = function(resource, currentPage) {
  //分頁
  const totalResult = resource.length;
  const perpage = 3; //每頁三比資料
  const pageTotal = Math.ceil(totalResult / perpage); //總頁數
  // let currentPage = 2; //當前頁數
  if (currentPage > pageTotal) {
    currentPage = pageTotal;
  }
  //使用結果反推公式
  const minItem = (currentPage * perpage) - perpage + 1;//4
  const maxItem = (currentPage * perpage); //6

  const data = [];
  resource.forEach((item, i) => {
    let itemNum = i + 1;
    if (itemNum >= minItem && itemNum <= maxItem) {
      data.push(item);
    }
  });
  const page = {
    pageTotal,
    currentPage,
    hasPre: currentPage > 1,
    hasNext: currentPage < pageTotal
  };
  return {
    page,
    data
  };

  console.log(`總資料${totalResult} 每頁數量${perpage} 總頁數${pageTotal} ${minItem} ${maxItem}`);
};


module.exports = pagination;