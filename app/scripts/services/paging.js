services.factory("Paging", function() {
  var Paging = {};

  var _pageSize = 5,
      _h = 30,   //行高 30pixel
      currentPage = 1,
      paramStart = 0,
      pageNums = 3; //总页数

  //_pageSize = Math.floor((window.innerHeight - 250) / _h);

  Paging.getPageSize = function() {
    return _pageSize;
  }

  Paging.setPageSize = function(_size) {
    _pageSize = _size;
  }

  Paging.getCurrentPage = function() {
    return currentPage;
  }

  Paging.setCurrentPage = function(_page) {
    currentPage = _page;
    paramStart = (_page - 1) * _pageSize;
  }

  Paging.getParamStart = function() {
    return paramStart;
  }

  Paging.setParamStart = function(_start) {
    paramStart = _start;
  }

  Paging.getPageNums = function() {
    return pageNums;
  }

  Paging.getPageList = function(_count) {
    var pageList = [],
        start = 1,
        end = 0,
        i = 0;

    if(_count <= 0)
      return [];

    pageNums = Math.ceil(_count / _pageSize);

    if(pageNums <= 11) {
      for(i = 1; i <= pageNums; i ++) {
        pageList.push({value: i, disable: false});
      }

      return pageList;
    }

    end = currentPage <= 6 ? currentPage + 2 : 3;

    for(i = start; i <= end; i ++)
      pageList.push({value: i, disable: false});

    pageList.push({value: '...', disable: true});

    if(currentPage > 6 && currentPage <= (pageNums - 6)) {
      start = currentPage - 2;
      end = currentPage + 2;
      for(i = start; i <= end; i ++)
        pageList.push({value: i, disable: false});

      pageList.push({value: '...', disable: true});
    }

    start = currentPage > pageNums - 6 ? currentPage - 2 : pageNums - 2;
    end = pageNums;

    for(i = start; i <= end; i ++)
      pageList.push({value: i, disable: false});

    return pageList;

  };

  //页面跳转的处理
  Paging.jumpPage = function(trend, page, callback) {
    //trend: -1 前一页, 1 后一页, 0 表示跳页
    if((trend == -1 && currentPage == 1) || (trend == 1 && currentPage == pageNums))
      return;
    if(trend != 0) {
      currentPage += trend;
      paramStart += trend * _pageSize;
    } else {
      page = parseInt(page);
      if(page <= 0)
        currentPage = 1;
      else if(page >= pageNums)
        currentPage = pageNums
      else
        currentPage = page;
      paramStart = (currentPage - 1) * _pageSize;
    }

    callback();
  }

  return Paging;
});