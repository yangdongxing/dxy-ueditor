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
'		            <label class="col-sm-3">标题：</label>'+
'		            <div class="col-sm-9">'+
'		              <input type="text" class="form-control limit-length"  data-target="vote-title-limit" data-max="35" placeholder="" name="vote_title" value="<%=vote_title%>">'+
'		              <em id="vote-title-limit" class="limit-counter"><%=vote_name.length%>/35</em>'+
'		            </div>'+
'		          </div>'+
'		          <div class="form-group clearfix">'+
'		            <label class="col-sm-3"></label>'+
'		            <div class="col-sm-9">'+
'		              <input type="radio" id="vote_type_1" placeholder="" name="vote_type"  <%if(vote_type===\'1\'){print(\'checked\')}%> value="1">'+
'		              <label for=\'vote_type_1\'>单选</label>'+
'		              <input type="radio" id="vote_type_2" placeholder="" name="vote_type" <%if(vote_type===\'2\'){print(\'checked\')}%> value="2">'+
'		              <label for="vote_type_2">多选</label>'+
'		            </div>'+
'		          </div>'+
'		          <div class="vote-options">'+
'		          	<%_.each(vote_options,function(opt,i){%>'+
'						<div class="form-group clearfix">'+
'				            <label class="col-sm-3">选项<%=(i+1)%>：</label>'+
'				            <div class="col-sm-7">'+
'				              <input type="text" data-max="35" data-target="vote-option-limit-<%=i%>" class="form-control limit-length" placeholder=""  value="<%=opt.value%>" name="vote_option_<%=i%>">'+
'				              <em id="vote-option-limit-<%=i%>" class="limit-counter"><%=opt.value?opt.value.length:0%>/35</em>'+
'				            </div>'+
'				            <a href="javascript:;" class="J-remove-option col-sm-2" data-id="<%=i%>">删除选项</a>'+
'				        </div>'+
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
define("dxy-plugins/replacedview/vote/views/mobile.view", function(){var tpl = '';return tpl;});