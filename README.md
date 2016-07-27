# m-slider 移动端轮播图/幻灯片

---

以轮播的形式展示图片或自由组合内容。

## 何时使用

在一个模块内需要依次展现多图或多组对象时，常用到轮播模块。



## API

- 通过设置 Slider 的属性来产生不同的轮播样式

- 轮播的属性说明如下：

属性 | 说明 | 类型 | 默认值
-----|-----|-----|------
images | 设置轮播播放的图片序列 | Array | undefined
loop | 设置轮播是否循环 | Bool | true
auto | 设置轮播是否自动播放 | Bool | false
interval | 设置自动播放时间间隔, 仅在 `auto` 为 `true` 时生效 | Number | 3000
group | 为轮播图片序列分组, 设置每一组中包含的图片数量, 默认为`1`, 不分组 | Number | 1
narrow | 设置轮播为预露模式, 即显示前后一张图片的部分内容 | Bool | false
narrowValue | 设置轮播预露区域的最大值, 以百分比定义, 不需要添加单位 | Number | 20
freeMode | 设置轮播是否为跟随模式, 在跟随模式下, 无法设置循环, 自动轮播 | Bool | false
indicator | 设置轮播的指示器的显示和隐藏 | Bool | true
indicatorSeparate | 设置轮播指示器是否与轮播内容分离, `true`时, 轮播指示器不与图片重叠, 而是展示在图片内容下方 | Bool | false 


- 自由组合类型

使用 Slider.Frame 创建高度自定义的轮播

**使用Frame创建组合轮播时, images属性不再生效**
