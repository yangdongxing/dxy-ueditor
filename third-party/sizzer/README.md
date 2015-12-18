# selector engine
简单的选择器引擎，使用css选择器筛选node树。

##require
对node树中的node节点的接口有要求，要求实现：<br>

`node.getAttribute` `node.getElementsByTagName` `node.nodeName` `node.firstChild|node.firstChild()` `node.nextSlibing|node.nextSlibing` 

##example

	Y('* div.active[title~=hehe] span', document.body)

##feature
支持所有css1,css2选择器<br>
支持css3: ~

##todo
支持css3
