LocalModule.define("dxy-plugins/editview/customview/customviews/doctor_question/views/page.view", function(){var tpl = '<section class="laiwen-doctor-answer clearfix">'+
'	<section class="avatar">'+
'		<img src="<%=img.value%>">'+
'	</section>'+
'	<section class="dialog">'+
'		<section class="view-wraper"><%=content.value%></section>'+
'	</section>'+
'	<section class="clear">&nbsp;</section>'+
'</section>';return tpl;});
LocalModule.define("dxy-plugins/editview/customview/customviews/user_answer/views/page.view", function(){var tpl = '<section class="laiwen-user-question clearfix">'+
'	<%if(img.value){%>'+
'		<section class="avatar">'+
'			<img src="<%=img.value%>">'+
'		</section>'+
'	<%}%>'+
'	<section class="dialog">'+
'		<section class="view-wraper"><%=content.value%></section>'+
'	</section>'+
'	<section class="clear">&nbsp;</section>'+
'</section>';return tpl;});
LocalModule.define("dxy-plugins/editview/customview/views/config.view", function(){var tpl = '<div class="clearfix">'+
'  <form class="form-horizontal">'+
'  <%_.each(_.keys(config), function(key){%>'+
'    <div class="form-group">'+
'      <label for="inputEmail3" class="col-sm-3 control-label"><%=config[key].title%></label>'+
'      <div class="col-sm-9">'+
'        <input type="text" class="form-control input-<%=key%>" value="<%=config[key].value%>" placeholder="<%=config[key].placeholder%>">'+
'      </div>'+
'    </div>'+
'  <%})%>'+
'  </form>'+
'  <button class="btn btn-primary pull-right confirm-config" type="button">确认修改</button>'+
'<div>';return tpl;});
LocalModule.define("dxy-plugins/editview/customview/views/dashboard.view", function(){var tpl = '<div class="btn-group-vertical customview-dashboard-controll" role="group">'+
'	<%_.each(styles, function(style){%>'+
'	<button type="button" class="btn btn-default view-button" data-name="<%=style.viewname%>"><%=style.title%></button>'+
'	<%})%>'+
'</div>'+
'<div class="views-container" style="display:inline-block;">'+
'	'+
'</div>'+
'<div class="col-md-12 view-trash" style="margin-top:20px;text-align:center;">'+
'  <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>'+
'  拖动到这删除'+
'</div>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/annotation/views/dialog.view", function(){var tpl = '<div class="form-group">'+
'	<textarea class="form-control" id="annotation-value"  placeholder="请输入注释" rows=\'5\'><%=value%></textarea>'+
'</div>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/annotation/views/mobile_pop.view", function(){var tpl = '	<div class=\'arrow\'>'+
'	</div>'+
'	<%if(annotation){%>'+
'		<%if(url){%>'+
'			<a href="<%=url%>" target="_black" class="annotation-header">'+
'				<span class="annotation-title"><%=title%></span>'+
'				<span class="more"></span>'+
'			</a>'+
'		<%}else{%>'+
'			<div class="annotation-header">'+
'				<span class="annotation-title"><%=title%></span>'+
'			</div>'+
'		<%}%>'+
'		<div class="annotation-content"><%=slice(annotation.get(\'value\'))%></div>'+
'	<%}else{%>'+
'		<div class="loading">加载中...</div>'+
'	<%}%>'+
'	<%if(error){%>'+
'		<div>'+
'			<%=error%>'+
'		</div>'+
'	<%}%>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/annotation/views/pop.view", function(){var tpl = '	<%if(arrow){%>'+
'	<div class=\'arrow\'>'+
'	</div>'+
'	<%}%>'+
'	<%if(annotation){%>'+
'	<div class="annotation-content"><%=annotation.get(\'value\')%></div>'+
'	<%}else{%>'+
'	<div class="loading">加载中...</div>'+
'	<%}%>'+
'	<%if(error){%>'+
'	<div>'+
'		<%=error%>'+
'	</div>'+
'	<%}%>'+
'	<%if(url){%>'+
'	<div class="more">'+
'		<a href="<%=url%>" target="_black">查看更多<span></span></a>'+
'	</div>'+
'	<%}%>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/drug/views/app.view", function(){var tpl = '<a href="<%=drug_url%>" class=\'m-drug-view-wraper\' target="_black">'+
'	<div class="m-drug-view-img">'+
'		<img src=\'http://assets.dxycdn.com/app/dxydoctor/img/editor/drug-icon.png\'>'+
'	</div>'+
'	<div class=\'m-drug-view-body\'>'+
'		<h4><%=drug_name%></h4>'+
'		<p><%=drug_company%></p>'+
'	</div>'+
'</a>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/drug/views/mobile.view", function(){var tpl = '<a class=\'mobile-drug-view-wraper\' href="<%=drug_url%>" target="_black">'+
'	<div class=\'mobile-drug-view-body\'>'+
'		<h4><%=drug_name%></h4>'+
'		<p><%=drug_company%></p>'+
'	</div>'+
'	<div class="mobile-drug-view-footer">'+
'		<span class="arrow"></span>'+
'		<%if(is_medicare){%>'+
'		<span class="tag">医保</span>'+
'		<%}%>'+
'	</div>'+
'</a>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/mark.view", function(){var tpl = '<%if(marks){%>'+
''+
'<%_.each(marks, function(mark){%>'+
''+
'<a class="btn btn-default center-block mark-item" href="#" role="button" style="width:40%;" data-id=<%=mark.id%>><%=mark.name%></a>'+
'<br>'+
''+
'<%})%>'+
''+
'<%}%>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/video/views/main.view", function(){var tpl = '<div>'+
'<div class="form-group">'+
'  <input type="text" class="form-control" id="video-id"  placeholder="请输入腾讯视频id或链接" value="<%=value%>">'+
' </div>'+
' <div class="form-group">'+
' <div class="qq-upload-button" style="position: relative; overflow: hidden; direction: ltr;width: 100px;" >'+
' 	<p>上传视频截图</p>'+
' 	<input type="file" name="file" id="video-cover" style="position: absolute; right: 0px; top: 0px; font-family: Arial; font-size: 118px; margin: 0px; padding: 0px; cursor: pointer; opacity: 0;">'+
' </div>'+
'  <p class="help-block">手机上不自动播放视频，挑一张精彩的视频截图更能吸引用户点击播放。</p>'+
' </div>'+
' <div class="form-group">'+
' <img src="<%=cover%>" style="width:100%;">'+
' </div>'+
'</div>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/vote/views/alert.view", function(){var tpl = '<div class="editor-alert-box <%if(cls){print(cls)}%>">'+
'	<p><%=title%></p>'+
'	<a href="javascript:;"><%=button_title%></a>'+
'</div>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/vote/views/dialog.view", function(){var tpl = '<div>'+
'  <div class="tab-content">'+
'    <div role="tabpanel" class="tab-pane" id="add-vote">'+
'    '+
'    </div>'+
'    <div role="tabpanel" class="tab-pane active" id="vote-list">'+
'    	<%if(votelist){%>'+
'    	<div class="row">'+
'			<div class="input-group col-md-6" style="left:25%;">'+
'		      <input type="text" class="form-control" placeholder="根据名称筛选" id="J-vote-group-search">'+
'		      <div id="search-list-container">'+
'		      	'+
'		      </div>'+
'		    </div>'+
'		</div>'+
'		<table class="table table-hover">'+
'			<thead>'+
'				<tr>'+
'					<th>#</th>'+
'					<th>名称</th>'+
'					<th>开始时间</th>'+
'					<th>截止时间</th>'+
'					<th>状态</th>'+
'					<th>操作</th>'+
'				</tr>'+
'			</thead>'+
'			<tbody>'+
'				<%_.each(votelist.models, function(vote, i){%>'+
'				<tr class="<%if(new Date()<new Date(vote.get(\'e_time\')) && new Date()>=new Date(vote.get(\'s_time\'))){print(\'success\')}%>">'+
'					<td><%=vote.get(\'id\')%></td>'+
'					<td><%=vote.get(\'title\')%></td>'+
'					<td><%=vote.get(\'s_time\')%></td>'+
'					<td><%=vote.get(\'e_time\')%></td>'+
'					<td><%if(vote.get(\'status\')==0){print(\'禁用\')}else if(vote.get(\'status\')==1){print(\'正常\')}else{print(\'删除\')}%></td>'+
'					<td>'+
'						<a href="javascript:;" class="J-add-vote-from-votelist" data-id="<%=vote.get(\'id\')%>"><%if(mark.get(\'group\')){print(\'替换\')}else{print(\'插入\')}%></a>'+
'					</td>'+
'				</tr>'+
'				<%})%>'+
'			</tbody>'+
'		</table>'+
'		<nav>'+
'		  <ul class="pager">'+
'		    <li class="previous" id="vote-list-page-prev"><a href="#"><span aria-hidden="true">&larr;</span> 上一页</a></li>'+
'		    <li class="next" id="vote-list-page-next"><a href="#">下一页 <span aria-hidden="true">&rarr;</span></a></li>'+
'		  </ul>'+
'		</nav>'+
'		<%}else{%>'+
'			<span class=\'center-block\'>加载中...</span>'+
'		<%}%>'+
'    </div>'+
'  </div>'+
'</div>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/vote/views/editor.view", function(){var tpl = '<div class="editor-vote-container">'+
'<p>'+
'	<span class="tag">投票</span>'+
'	<span class="tag"><%if(group.get(\'show_type\')==0){print(\'默认类型\')}else if(group.get(\'show_type\')==1){print(\'横排单选\')}%></span>'+
'	<span class="tag"><%if(group.get(\'status\')==\'0\'){print(\'禁用\')}else if(group.get(\'status\')==\'1\'){print(\'正常\')}else{print(\'删除\')}%></span>'+
'	<span class="tag"><%if(new Date()<new Date(group.get(\'e_time\')) && new Date()>=new Date(group.get(\'s_time\'))){print(\'进行中\')}else if(new Date()>new Date(group.get(\'e_time\'))){print(\'已过期\')}else{print(\'未开始\')}%></span>'+
'</p>'+
'<%_.each(votes, function(vote, i){%>'+
'<%if(+vote.attach.get(\'type\')===0){%>'+
'	<div class="editor-vote-wraper vote-single <%if(!vote.attach.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>">'+
'		<h4><%=vote.attach.get(\'title\')%></h4>'+
'		<div class="vote-body">'+
'			<ul>'+
'				<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'					<li data-id="<%=j%>"  class="<%if(opt.checked){print(\'checked\')}%>" data-model="group-attach-<%=i%>-attach-attach" data-id="<%=j%>">'+
'						<%if(vote.attach.user_voted){%>'+
'						<p>'+
'							<%=opt.attach.get(\'value\')%>'+
'						</p>'+
'						<div style="height:10px;">'+
'							<p class="vote-state-bar">'+
'								<span style="width:<%if(vote.vote_total){print(opt.total/vote.vote_total*100)}else{print(\'0\')}%>%;display:inline-block;padding-right: 0px;"></span>'+
'							</p>'+
'							<span class="vote-state"><%if(vote.vote_total){print(opt.total/vote.vote_total*100)}else{print(\'0\')}%>%</span>'+
'						</div>'+
'						<%}else{%>'+
'						<div class="<%if(opt.checked){print(\'active\')}%>">'+
'							<%if(opt.attach.get(\'img\')){%>'+
'							<span class="img">'+
'								<img src="<%=opt.attach.get(\'img\')%>">'+
'							</span>'+
'							<%}%>'+
'							<span><%=opt.attach.get(\'value\')%></span>'+
'						</div>'+
'						<%}%>'+
'					</li>'+
'				<%})%>'+
'			</ul>'+
'		</div>'+
'	</div>'+
'<%}else{%>'+
'	<div class="editor-vote-wraper vote-multiple <%if(!vote.attach.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>">'+
'		<h4><%=vote.attach.get(\'title\')%></h4>'+
'		<div class="vote-body">'+
'			<ul>'+
'				<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'					<li data-id="<%=j%>"  class="<%if(opt.checked){print(\'checked\')}%>" data-model="group-attach-<%=i%>-attach-attach" data-id="<%=j%>">'+
'						<%if(vote.attach.user_voted){%>'+
'						<p>'+
'							<%=opt.attach.get(\'value\')%>'+
'						</p>'+
'						<div style="height:10px;">'+
'							<p class="vote-state-bar">'+
'								<span style="width:<%if(vote.vote_total){print(opt.total/vote.vote_total*100)}else{print(\'0\')}%>%;display:inline-block;padding-right: 0px;"></span>'+
'							</p>'+
'							<span class="vote-state"><%if(vote.vote_total){print(opt.total/vote.vote_total*100)}else{print(\'0\')}%>%</span>'+
'						</div>'+
'						<%}else{%>'+
'						<div class="<%if(opt.checked){print(\'active\')}%>">'+
'							<%if(opt.attach.get(\'img\')){%>'+
'							<span class="img">'+
'								<img src="<%=opt.attach.get(\'img\')%>">'+
'							</span>'+
'							<%}%>'+
'							<span><%=opt.attach.get(\'value\')%></span>'+
'						</div>'+
'						<%}%>'+
'					</li>'+
'				<%})%>'+
'			</ul>'+
'		</div>'+
'	</div>'+
'<%}%>'+
'<%})%>'+
''+
'</div>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/vote/views/h5.view", function(){var tpl = '<div class="editor-vote-group <%if(!group.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>" >'+
'<%if(expired){%>'+
'<a href="javascript:;" class="vote-expired-tip user-vote">'+
'	投票已过期'+
'</a>'+
'<%}%>'+
'<%_.each(votes, function(vote, i){%>'+
'<%if(+vote.attach.get(\'type\')===0){%>'+
'	<div class="editor-vote-wraper vote-single <%if(!group.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>">'+
'		<div class="vote-type"></div>'+
'		<h4><%=vote.attach.get(\'title\')%></h4>'+
'		<div class="vote-body">'+
'			<ul>'+
'				<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'					<li data-id="<%=j%>"  class="<%if(opt.checked){print(\'checked\')}%>" data-model="group-attach-<%=i%>-attach-attach" data-id="<%=j%>">'+
'						<%if(group.user_voted){%>'+
'						<p>'+
'							<%=opt.attach.get(\'value\')%>'+
'						</p>'+
'						<div style="height:10px;">'+
'							<p class="vote-state-bar">'+
'								<span style="width:<%if(vote.vote_total){print(opt.total/vote.vote_total*100)}else{print(\'0\')}%>%;display:inline-block;padding-right: 0px;"></span>'+
'							</p>'+
'							<span class="vote-state"><%if(vote.vote_total){print(Math.round(opt.total/vote.vote_total*100))}else{print(\'0\')}%>%</span>'+
'						</div>'+
'						<%}else{%>'+
'						<div class="<%if(opt.checked){print(\'active\')}%>">'+
'							<%if(opt.attach.get(\'img\')){%>'+
'							<span class="img">'+
'								<img src="<%=opt.attach.get(\'img\')%>">'+
'							</span>'+
'							<%}%>'+
'							<span><%=opt.attach.get(\'value\')%></span>'+
'						</div>'+
'						<%}%>'+
'					</li>'+
'				<%})%>'+
'			</ul>'+
'		</div>'+
'	</div>'+
'<%}else{%>'+
'	<div class="editor-vote-wraper vote-multiple <%if(!group.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>">'+
'		<div class="vote-type"></div>'+
'		<h4><%=vote.attach.get(\'title\')%></h4>'+
'		<div class="vote-body">'+
'			<ul>'+
'				<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'					<li data-id="<%=j%>"  class="<%if(opt.checked){print(\'checked\')}%>" data-model="group-attach-<%=i%>-attach-attach" data-id="<%=j%>">'+
'						<%if(group.user_voted){%>'+
'						<p>'+
'							<%=opt.attach.get(\'value\')%>'+
'						</p>'+
'						<div style="height:10px;">'+
'							<p class="vote-state-bar">'+
'								<span style="width:<%if(vote.vote_total){print(opt.total/vote.vote_total*100)}else{print(\'0\')}%>%;display:inline-block;padding-right: 0px;"></span>'+
'							</p>'+
'							<span class="vote-state"><%if(vote.vote_total){print(Math.round(opt.total/vote.vote_total*100))}else{print(\'0\')}%>%</span>'+
'						</div>'+
'						<%}else{%>'+
'						<div class="<%if(opt.checked){print(\'active\')}%>">'+
'							<%if(opt.attach.get(\'img\')){%>'+
'							<span class="img">'+
'								<img src="<%=opt.attach.get(\'img\')%>">'+
'							</span>'+
'							<%}%>'+
'							<span><%=opt.attach.get(\'value\')%></span>'+
'						</div>'+
'						<%}%>'+
'					</li>'+
'				<%})%>'+
'			</ul>'+
'		</div>'+
'	</div>'+
'<%}%>'+
'<%})%>'+
'<%if(!expired){%>'+
'<div class="vote-opt-wraper">'+
'<%if(!expired && isLogin){%>'+
'<a href="javascript:;" class="user-vote J-user-vote">'+
'	<%if(group.user_voted){print(\'你已投票\')}else if(isLogin){print(\'我要投票\')}%>'+
'</a>'+
'<%}else if(!isLogin){%>'+
'<a href="https://account.dxy.com/login?redirect_uri=<%=window.location.href%>" class="user-vote">'+
'	登录并投票'+
'</a>'+
'<%}%>'+
'</div>'+
'<%}%>'+
'</div>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/vote/views/mobile.view", function(){var tpl = '<div class="editor-vote-group <%if(!group.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%> mobile-vote">'+
'<%_.each(votes, function(vote, i){%>'+
'	<div class="editor-vote-wraper <%if(+vote.attach.get(\'type\')===0){print(\'vote-single\')}else{print(\'vote-multiple\')}%> <%if(!group.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>">'+
'		<h4><span>投票</span><%=vote.attach.get(\'title\')%></h4>'+
'		<div class="vote-body">'+
'			<ul>'+
'				<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'					<li data-id="<%=j%>"  class="<%if(opt.checked){print(\'checked\')}%>" data-model="group-attach-<%=i%>-attach-attach" data-id="<%=j%>">'+
'						<%if(group.user_voted){%>'+
'						<p>'+
'							<span class="vote-value"><%=opt.attach.get(\'value\')%></span><span class="vote-state"><%if(vote.vote_total){print(Math.round(opt.total/vote.vote_total*100))}else{print(\'0\')}%>%</span>'+
'						</p>'+
'						<div class="status-bar" style="width:<%if(vote.vote_total){print(opt.total/vote.vote_total*100)}else{print(\'0\')}%>%;">'+
'						</div>'+
'						<%}else{%>'+
'						<div class="<%if(opt.checked){print(\'active\')}%>">'+
'							<div class="vote-option-main">'+
'								<%if(opt.attach.get(\'img\')){%>'+
'								<span class="img">'+
'									<img src="<%=opt.attach.get(\'img\')%>">'+
'								</span>'+
'								<%}%>'+
'								<span class="vote-option-value"><%=opt.attach.get(\'value\')%></span>'+
'							</div>'+
'							<div class="vote-option-sub">'+
'								'+
'							</div>'+
'						</div>'+
'						<%}%>'+
'					</li>'+
'				<%})%>'+
'			</ul>'+
'		</div>'+
'	</div>'+
'<%})%>'+
'<div class="vote-opt-wraper">'+
'<%if(expired){%>'+
'<a href="javascript:;" class="vote-expired-tip user-vote">'+
'	投票已过期'+
'</a>'+
'<%}%>'+
'<%if(!expired){%>'+
'<a href="javascript:;" class="user-vote J-user-vote">'+
'	<%if(group.user_voted){print(\'已投票\')}else{print(\'我要投票\')}%>'+
'</a>'+
'<%}%>'+
'</div>'+
'</div>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/vote/views/searchList.view", function(){var tpl = '<%if(list && list.length>0){%>'+
'<ul class="search-list">'+
'	<%_.each(list, function(item,i){%>'+
'	<li data-id="<%=i%>"><%=item.get(\'title\')%></li>'+
'	<%})%>'+
'</ul>'+
'<%}%>';return tpl;});
LocalModule.define("dxy-plugins/replacedview/vote/views/singlebutton/mobile.view", function(){var tpl = '<div class="editor-button-vote-group <%if(!group.user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%> <%if(!expired){print(\'not_expired\')}else{print(\'expired\')}%>">'+
'<%if(group.user_voted){%>'+
'<%if(expired){%>'+
''+
'<%_.each(votes, function(vote, i){%>'+
'<p><%=vote.attach.get(\'title\')%></p>'+
'	<div class="editor-vote-wraper clearfix">'+
'	<table>'+
'	<tr>'+
'		<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'			<td class="editor-vote-option <%if(opt.checked){print(\'checked\')}%> <%if(opt.attach.get(\'params\') && opt.attach.get(\'params\').isTruth){print(\'truth-opt\')}else{print(\'not-truth-opt\')}%> <%if(j==0){print(\'first\')}else if(j==vote.attach.attach.models.length-1){print(\'last\')}else{print(\'middle\')}%>" style="border:none;<%if(j==0){print(\'text-align:left;border-radius: 10px 0px 0px 10px;\')}else if(j==vote.attach.attach.models.length-1){print(\'text-align:right;border-radius: 0px 10px 10px 0px;\')}else{print(\'text-align:center;\')}%>width:<%=opt.width%>%">'+
'				<span class="user-check">'+
'					<%if(opt.checked){print(\'我的选择\')}else{print(\'&nbsp;\')}%>'+
'				</span>'+
'				<span class="opt-value"><%=opt.attach.get(\'value\')%></span>'+
'				<span class="opt-stat"><i><%=opt.total||0%></i>票 <i><%if(vote.vote_total){print(Math.round(opt.total/vote.vote_total*100))}else{print(\'0\')}%></i>%</span>'+
'			</td>'+
'		<%})%>'+
'	</tr>'+
'	<tr style="height:10px;"></tr>'+
'	<tr>'+
'		<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'			<td class="editor-vote-option-stat <%if(opt.checked){print(\'checked\')}%> <%if(opt.attach.get(\'params\') && opt.attach.get(\'params\').isTruth){print(\'truth-opt\')}else{print(\'not-truth-opt\')}%> <%if(j==0){print(\'first\')}else if(j==vote.attach.attach.models.length-1){print(\'last\')}else{print(\'middle\')}%>" style="border:none;<%if(j==0){print(\'text-align:left;border-radius: 10px 0px 0px 10px;\')}else if(j==vote.attach.attach.models.length-1){print(\'text-align:right;border-radius: 0px 10px 10px 0px;\')}else{print(\'text-align:center;\')}%>width:<%=opt.width%>%">'+
'				<div class="right-answer"><span class="arrow"></span>正确答案</div>'+
'			</td>'+
'		<%})%>'+
'	</tr>'+
'	</table>'+
'	</div>'+
'<%})%>'+
''+
'<%if(false){%>'+
'<%_.each(votes, function(vote, i){%>'+
'	<p><%=vote.attach.get(\'title\')%></p>'+
'	<div class="editor-vote-wraper clearfix">'+
'		<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'			<div class="editor-vote-option <%if(opt.checked){print(\'checked\')}%>" style="<%if(j==0){print(\'text-align:left;border-radius: 10px 0px 0px 10px;\')}else if(j==vote.attach.attach.models.length-1){print(\'text-align:right;border-radius: 0px 10px 10px 0px;\')}else{print(\'text-align:center;\')}%>width:<%=opt.width%>%">'+
'				<span class="user-check"><%if(opt.checked){print(\'我的选择\')}else{print(\'&nbsp;\')}%></span>'+
'				<span class="opt-value"><%=opt.attach.get(\'value\')%></span>'+
'				<span class="opt-stat"><i><%=opt.total||0%></i>票 <i><%if(vote.vote_total){print(Math.round(opt.total/vote.vote_total*100))}else{print(\'0\')}%></i>%</span>'+
'			</div>'+
'		<%})%>'+
'	</div>'+
'<%})%>'+
'<%}%>'+
''+
'<%}else{%>'+
''+
'<%_.each(votes, function(vote, i){%>'+
'<p><%=vote.attach.get(\'title\')%></p>'+
'	<div class="editor-vote-wraper clearfix">'+
'	<table>'+
'	<tr>'+
'		<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'			<td class="editor-vote-option <%if(opt.checked){print(\'checked\')}%> <%if(opt.attach.get(\'params\') && opt.attach.get(\'params\').isTruth){print(\'truth-opt\')}else{print(\'not-truth-opt\')}%> <%if(j==0){print(\'first\')}else if(j==vote.attach.attach.models.length-1){print(\'last\')}else{print(\'middle\')}%>" style="border:none;<%if(j==0){print(\'text-align:left;border-radius: 10px 0px 0px 10px;\')}else if(j==vote.attach.attach.models.length-1){print(\'text-align:right;border-radius: 0px 10px 10px 0px;\')}else{print(\'text-align:center;\')}%>width:<%=opt.width%>%">'+
'				<span class="user-check">'+
'					<%if(opt.checked){print(\'我的选择\')}else{print(\'&nbsp;\')}%>'+
'				</span>'+
'				<span class="opt-value"><%=opt.attach.get(\'value\')%></span>'+
'				<span class="opt-stat"><i><%=opt.total||0%></i>票 <i><%if(vote.vote_total){print(Math.round(opt.total/vote.vote_total*100))}else{print(\'0\')}%></i>%</span>'+
'			</td>'+
'		<%})%>'+
'	</tr>'+
'	<tr style="height:10px;"></tr>'+
'	<tr>'+
'		<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'			<td class="editor-vote-option-stat <%if(opt.checked){print(\'checked\')}%> <%if(opt.attach.get(\'params\') && opt.attach.get(\'params\').isTruth){print(\'truth-opt\')}else{print(\'not-truth-opt\')}%> <%if(j==0){print(\'first\')}else if(j==vote.attach.attach.models.length-1){print(\'last\')}else{print(\'middle\')}%>" style="border:none;<%if(j==0){print(\'text-align:left;border-radius: 10px 0px 0px 10px;\')}else if(j==vote.attach.attach.models.length-1){print(\'text-align:right;border-radius: 0px 10px 10px 0px;\')}else{print(\'text-align:center;\')}%>width:<%=opt.width%>%">'+
'				<div class="right-answer"><span class="arrow"></span>正确答案</div>'+
'			</td>'+
'		<%})%>'+
'	</tr>'+
'	</table>'+
'	</div>'+
'<%})%>'+
''+
'<%if(false){%>'+
'<%_.each(votes, function(vote, i){%>'+
'<p><%=vote.attach.get(\'title\')%></p>'+
'	<div class="editor-vote-wraper clearfix">'+
'		<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'			<div class="editor-vote-option <%if(opt.checked){print(\'checked\')}%>" style="<%if(j==0){print(\'text-align:left;border-radius: 10px 0px 0px 10px;\')}else if(j==vote.attach.attach.models.length-1){print(\'text-align:right;border-radius: 0px 10px 10px 0px;\')}else{print(\'text-align:center;\')}%>width:<%=opt.width%>%">'+
'				<span class="user-check"><%if(opt.checked){print(\'我的选择\')}else{print(\'&nbsp;\')}%></span>'+
'				<span class="opt-value"><%=opt.attach.get(\'value\')%></span>'+
'				<span class="opt-stat"><i><%=opt.total||0%></i>票 <i><%if(vote.vote_total){print(Math.round(opt.total/vote.vote_total*100))}else{print(\'0\')}%></i>%</span>'+
'			</div>'+
'		<%})%>'+
'	</div>'+
'<%})%>'+
'<%}%>'+
''+
'<%}%>'+
'<%}else{%>'+
'<%if(expired){%>'+
''+
'<%_.each(votes, function(vote, i){%>'+
''+
'<%})%>'+
''+
'<%}else{%>'+
''+
'<%_.each(votes, function(vote, i){%>'+
'<p><%=vote.attach.get(\'title\')%></p>'+
'	<table class="editor-vote-wraper clearfix">'+
'		<tr>'+
'		<%_.each(vote.attach.attach.models,function(opt,j){ %> '+
'			<td class="editor-vote-option" style="<%if(j==0){print(\'padding-right:6px\')}else if(j==vote.attach.attach.models.length-1){print(\'padding-left:6px\')}else{print(\'padding-right:6px;padding-left:6px\')}%>"  data-model="group-attach-<%=i%>-attach-attach" data-id="<%=j%>" >'+
'				<div>'+
'					<span style="background-color: <%=bgcolors[j]%>"><%=opt.attach.get(\'value\')%></span>'+
'				</div>'+
'			</td>'+
'		<%})%>'+
'		</tr>'+
'	</table>'+
'<%})%>'+
''+
'<%}%>'+
'<%}%>'+
'</div>';return tpl;});