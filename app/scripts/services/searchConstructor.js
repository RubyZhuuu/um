services.factory("SearchConstructor", function() {
  function SearchConstructor(_type) {
    this.data = [];
    this.data.push({k: "不限", v: true})
    for(var i in _type) {
      this.data.push({k: _type[i], v: false});
    }

    this.selected = [];
  }

  SearchConstructor.prototype.get = function() {
    return this.data;
  }

  SearchConstructor.prototype.switchItemStatus = function(_index, _toStatus, _callback) {
    //TODO 条件状态切换，_toStatus: 1(selected) or 0(unSelected)
    var value = '',
        indexInSelected = -1;

    if(_index === 0) {
      this.selected.length = 0;
    }

    if(_toStatus === 1) {
      value = this.data[_index].k;
      indexInSelected = this.selected.indexOf(value);

      if(indexInSelected !== -1)
        return;

      this.selected.push(value);
    } else {
      this.selected.splice(_index, 1);
    }

    if(typeof _callback === 'function')
      _callback();
  }

  SearchConstructor.prototype.getSelected = function() {
    return this.selected;
  }

  SearchConstructor.prototype.getSelectedString = function() {
    console.log(this.selected.toString());
    return this.selected.toString();
  }
  
  return {Instance: SearchConstructor};
});