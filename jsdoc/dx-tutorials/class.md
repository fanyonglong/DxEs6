
继承类
```javascript
var Parent=Mjb.Class.extend({
    constructor:function(name)
    {
        this.name=name;
    },
    getName:function()
    {
        return 
    }
});
var Child=Parent.extend({});
var child=new Child('李三');
var name=child.getName();// 李三
```