/**
 * Created by winter on 2014/9/24.
 */


function Observer(){};
Observer.prototype = {
     update:function(){}
};
function ButtonObserver(button,visibleType){}
ButtonObserver.prototype = new Observer();
ButtonObserver.prototype = {
    button:null,
    visibleTypeList:null,
    concreteSubject:null,
    update: function(){
        var isDisabled = true;
        for(j = 0; j < this.visibleTypeList.length; j++){
            if(this.concreteSubject.nodeType == this.visibleTypeList[j]){
                isDisabled = false;
                break;
            }
        }
        this.button.setDisabled(isDisabled);
    }
}
function MenuObserver(button,visibleType){}
MenuObserver.prototype = new Observer();
MenuObserver.prototype = {
    menuButton:null,
    visibleTypeList:null,
    concreteSubject:null,
    update: function(){
        var isShow = false;
        for(k = 0; k < this.visibleTypeList.length; k++){
            if(this.concreteSubject.nodeType == this.visibleTypeList[k]){
                isShow = true;
                break;
            }
        }
        if(isShow){
            this.menuButton.show();
        }else{
            this.menuButton.hide();
        }
    }
}

function Subject(){}
Subject.prototype = {
      index:0,
      observers:new Array(),
      addObserver: function(observer){
          this.observers[this.index++] = observer;
      },
      removeObserver:function(observer){
          this.observers.remove(observer)
      },
      notify:function(){
          for( i = 0; i < this.observers.length; i ++){
              this.observers[i].update();
          }
      }
}
//被观察的第一个实体对象
function ConcreteSubject(){}
ConcreteSubject.prototype = new Subject();
ConcreteSubject.prototype.nodeType = null;

function Subject2(){}
Subject2.prototype = {
    index:0,
    observers:new Array(),
    addObserver: function(observer){
        this.observers[this.index++] = observer;
    },
    removeObserver:function(observer){
        this.observers.remove(observer)
    },
    notify:function(){
        for( i = 0; i < this.observers.length; i ++){
            this.observers[i].update();
        }
    }
}
//被观察的第二个实体对象
function ConcreteSubject2(){}
ConcreteSubject2.prototype = new Subject2();
ConcreteSubject2.prototype.nodeType = null;


function BtnAndType(button,typeList) {
    this.button =button,
    this.typeList = typeList
}

