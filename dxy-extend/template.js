define("dxy-plugins/replacedview/drug/mobile.view", function(){var tpl = '<div class=\'m-drug-view-wraper\'>'+
'	<div>'+
'		<img src=\'\'>'+
'	</div>'+
'	<div class=\'m-drug-view-body\'>'+
'		<h4><%=drug_name%></h4>'+
'		<p><%=drug_company%></p>'+
'	</div>'+
'	<div class="m-drug-view-footer">'+
'		<%if(drug_tags){%>'+
'		<%_.each(drug_tags, function(tag){%>'+
'		<span class="tag"><%=tag%></span>'+
'		<%})%>'+
'		<%}%>'+
'		<span class=\'right-arrow\'>></span>'+
'	</div>'+
'</div>';return tpl;});
define("dxy-plugins/replacedview/vote/views/alert.view", function(){var tpl = '<div class="editor-alert-box <%if(cls){print(cls)}%>">'+
'	<p><%=title%></p>'+
'	<a href="javascript:;"><%=button_title%></a>'+
'</div>';return tpl;});
define("dxy-plugins/replacedview/vote/views/dialog.view", function(){var tpl = '<div>'+
'  <ul class="nav nav-tabs" role="tablist">'+
'    <li role="presentation" class="active"><a href="#add-vote" aria-controls="add-vote" role="tab" data-toggle="tab">新投票</a></li>'+
'    <li role="presentation"><a href="#vote-list" aria-controls="vote-list" role="tab" data-toggle="tab">已有投票</a></li>'+
'  </ul>'+
'  <div class="tab-content">'+
'    <div role="tabpanel" class="tab-pane active" id="add-vote">'+
'		<form style="margin-top:20px;">'+
'          <div class="form-group clearfix">'+
'            <label class="col-sm-3">投票名称：</label>'+
'            <div class="col-sm-9">'+
'              <input type="text" class="form-control limit-length"  data-max="45"  data-target="vote-name-limit" placeholder="" name="vote_name" value="<%=vote_name%>">'+
'              <em id="vote-name-limit" class="limit-counter"><%=vote_name.length%>/45</em>'+
'            </div>'+
'          </div>'+
'          <p class="text-muted form-group clearfix">'+
'          	<span class="col-sm-3"></span><span class="col-sm-9">投票名称只用于管理，不显示在下发的投票内容中</span></p>'+
'          <div class="form-group clearfix">'+
'            <label class="col-sm-3">截止时间：</label>'+
'            <div class="col-sm-9">'+
'              <input type="text" class="form-control" placeholder="" name="vote_endtime" value="<%=vote_endtime%>">'+
'            </div>'+
'          </div>'+
'          <div class="form-group clearfix">'+
'            <label class="col-sm-3">投票权限：</label>'+
'            <div class="col-sm-9">'+
'              <input type="radio" placeholder="" id="vote_permission_1" name="vote_permission" <%if(vote_permission===\'1\'){print(\'checked\')}%> value="1">'+
'              <label for="vote_permission_1">所有人</label>'+
'              <input type="radio" placeholder="" name="vote_permission" id="vote_permission_2" <%if(vote_permission===\'2\'){print(\'checked\')}%> value="2">'+
'              <label for="vote_permission_2">已登陆</label>'+
'            </div>'+
'          </div>'+
'        </form>'+
'        <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">'+
'		  <div class="panel panel-default">'+
'		    <div class="panel-heading" role="tab" id="headingOne">'+
'		      <h4 class="panel-title">'+
'		        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse-1" aria-expanded="true" aria-controls="collapse-1" class="btn-block">'+
'		         问题一'+
'		        </a>'+
'		      </h4>'+
'		    </div>'+
'		    <div id="collapse-1" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">'+
'		      <div class="panel-body">'+
'		      	<form style="margin-top:20px;">'+
'		          <div class="form-group clearfix">'+
'		            <label class="col-sm-2">标题：</label>'+
'		            <div class="col-sm-10">'+
'		              <input type="text" class="form-control limit-length"  data-target="vote-title-limit" data-max="35" placeholder="" name="vote_title" value="<%=vote_title%>">'+
'		              <em id="vote-title-limit" class="limit-counter"><%=vote_title.length%>/35</em>'+
'		            </div>'+
'		          </div>'+
'		          <div class="form-group clearfix">'+
'		            <label class="col-sm-2"></label>'+
'		            <div class="col-sm-10">'+
'		              <input type="radio" id="vote_type_1" placeholder="" name="vote_type"  <%if(vote_type===\'1\'){print(\'checked\')}%> value="1">'+
'		              <label for=\'vote_type_1\'>单选</label>'+
'		              <input type="radio" id="vote_type_2" placeholder="" name="vote_type" <%if(vote_type===\'2\'){print(\'checked\')}%> value="2">'+
'		              <label for="vote_type_2">多选</label>'+
'		            </div>'+
'		          </div>'+
'		          <div class="vote-options">'+
'		          	<%_.each(vote_options,function(opt,i){%>'+
'						<div class="form-group clearfix">'+
'				            <label class="col-sm-2">选项<%=(i+1)%>：</label>'+
'				            <div class="col-sm-6">'+
'				              <input type="text" data-max="35" data-target="vote-option-limit-<%=i%>" class="form-control limit-length" placeholder=""  value="<%=opt.value%>" name="vote_option_<%=i%>">'+
'				              <em id="vote-option-limit-<%=i%>" class="limit-counter"><%=opt.value?opt.value.length:0%>/35</em>'+
'				            </div>'+
'				            <div class="col-sm-2 btn btn-default">'+
'				            	上传图片'+
'				            	 <input type="file" style="position: absolute; right: 0px; top: 0px; font-family: Arial; font-size: 118px; margin: 0px; padding: 0px; cursor: pointer;opacity: 0;width:100%;height:35px;" data-id="<%=i%>" class="vote-option-img" name="vote_img_<%=i%>">'+
'				            </div>'+
'				            <a href="javascript:;" class="J-remove-option col-sm-2" data-id="<%=i%>">删除选项</a>'+
'				        </div>'+
'				        <%if(opt.img){%>'+
'				        <div class="form-group clearfix">'+
'				        	<div class="col-sm-12">'+
'				        		<img src="<%=opt.img%>" style="width:40px;height:40px;">'+
'				        	</div>'+
'				        </div>'+
'				        <%}%>'+
'		          	<%})%>'+
'			       </div>'+
'			       <hr>'+
'			       <a href="javascript:;" id="J-add-option">添加选项</a>'+
'		        </form>'+
'		      </div>'+
'		    </div>'+
'		  </div>'+
'		</div>'+
''+
'    </div>'+
'    <div role="tabpanel" class="tab-pane" id="vote-list">vote list</div>'+
'  </div>'+
'</div>';return tpl;});
define("dxy-plugins/replacedview/vote/views/editor.view", function(){var tpl = '<div class="editor-vote-wraper">'+
'	<p>'+
'		<span class="tag"><%if(+vote_type===1){print(\'单选投票\')}else{print(\'多选投票\')}%></span>'+
'		<span class="tag"><%=vote_endtime%></span>'+
'		<span class="tag"><%if(+vote_permission===1){print(\'所有人\')}else{print(\'已登录\')}%></span>'+
'	</p>'+
'	<h4><%=vote_title%></h4>'+
'	<ul>'+
'		<%_.each(vote_options,function(opt){ %> '+
'			<li>'+
'				<%=opt.value%>'+
'			</li>'+
'		<%})%>'+
'	</ul>'+
'</div>';return tpl;});
define("dxy-plugins/replacedview/vote/views/mobile.view", function(){var tpl = '<%if(+vote_type===1){%>'+
'	<%if(new Date()<new Date(vote_endtime)){%>'+
'	<div class="editor-vote-wraper vote-single <%if(!user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>">'+
'		<img src="http://assets.dxycdn.com/app/dxydoctor/img/editor/icon-single-poll.png" class="vote-type">'+
'		<h4><%=vote_title%></h4>'+
'		<div class="vote-body">'+
'			<ul>'+
'				<%_.each(vote_options,function(opt,i){ %> '+
'					<li data-id="<%=i%>"  class="<%if(opt.checked){print(\'checked\')}%>">'+
'						<%if(user_voted){%>'+
'						<p>'+
'							<%=opt.value%>'+
'						</p>'+
'						<div style="height:10px;">'+
'							<p class="vote-state-bar">'+
'								<span style="width:<%if(vote_total){print(opt.total/vote_total*100)}else{print(\'0\')}%>%;display:inline-block;padding-right: 0px;"></span>'+
'							</p>'+
'							<span class="vote-state"><%if(vote_total){print(opt.total/vote_total*100)}else{print(\'0\')}%>%</span>'+
'						</div>'+
'						<%}else{%>'+
'						<div class="<%if(opt.checked){print(\'active\')}%>">'+
'							<%if(opt.img){%>'+
'							<span class="img">'+
'								<img src="<%=opt.img%>">'+
'							</span>'+
'							<%}%>'+
'							<span><%=opt.value%></span>'+
'						</div>'+
'						<%}%>'+
'					</li>'+
'				<%})%>'+
'			</ul>'+
'			<a href="javascript:;" class="user-vote">'+
'				<%if(user_voted){print(\'已投票\')}else{print(\'我要投票\')}%>'+
'			</a>'+
'		</div>'+
'	</div>'+
'	<%}else{%>'+
'		end'+
'	<%}%>'+
'<%}else{%>'+
'	<%if(new Date()<new Date(vote_endtime)){%>'+
'	<div class="editor-vote-wraper vote-multiple <%if(!user_voted){print(\'user_not_voted\')}else{print(\'user_voted\')}%>">'+
'		<img src="http://assets.dxycdn.com/app/dxydoctor/img/editor/icon-muli-poll.png" class="vote-type">'+
'		<h4><%=vote_title%></h4>'+
'		<div class="vote-body">'+
'			<ul>'+
'				<%_.each(vote_options,function(opt,i){ %> '+
'					<li data-id="<%=i%>"  class="<%if(opt.checked){print(\'checked\')}%>">'+
'						<%if(user_voted){%>'+
'						<p>'+
'							<%=opt.value%>'+
'						</p>'+
'						<div style="height:10px;">'+
'							<p class="vote-state-bar">'+
'								<span style="width:<%if(vote_total){print(opt.total/vote_total*100)}else{print(\'0\')}%>%;display:inline-block;padding-right: 0px;"></span>'+
'							</p>'+
'							<span class="vote-state"><%if(vote_total){print(opt.total/vote_total*100)}else{print(\'0\')}%>%</span>'+
'						</div>'+
'						<%}else{%>'+
'						<div class="<%if(opt.checked){print(\'active\')}%>">'+
'							<%if(opt.img){%>'+
'							<span class="img">'+
'								<img src="<%=opt.img%>">'+
'							</span>'+
'							<%}%>'+
'							<span><%=opt.value%></span>'+
'						</div>'+
'						<%}%>'+
'					</li>'+
'				<%})%>'+
'			</ul>'+
'			<a href="javascript:;" class="user-vote">'+
'				<%if(user_voted){print(\'已投票\')}else{print(\'我要投票\')}%>'+
'			</a>'+
'		</div>'+
'	</div>'+
'	<%}else{%>'+
'		end'+
'	<%}%>'+
'<%}%>';return tpl;});