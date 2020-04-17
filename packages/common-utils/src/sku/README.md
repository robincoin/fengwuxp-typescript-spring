

##### 基于商品SKU 规格选择
- 实现目标
```
  1：基于点击项计算其所有的组合
  2：根据计算的组合得到规格商品的库存
  3：将库存不足的标记为灰色

```

- 实现思路
```
 1：初始化所欲的规格排列组合
 2：匹配点击，每发生一次点击，进行计算当前点击的排列组合
 2.1：如果每一列规格都被选中，规格的总列数为n， 则对选中的属性取出(n-1)个和 其他的规格属性做排列组合
 3：遍历所有预期计算的组合，遍历匹配其组合对应的库存，如果，库存不足将对应的
    规格属性减一，如果库存满足则加1
 4： 输出当前选中的规格和库存不足的规格值（如果原本选中的规格值库存不足，将会被移除选中）

```