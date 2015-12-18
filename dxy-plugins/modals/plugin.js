UE.plugin.register('dxymodal', function(){
var editor = this;
var modals = '<div class="modal fade" id="dxy-bubbletalk-modal" tabindex="-1" role="dialog" aria-labelledby="dxy-bubbletalk-modal">'+
'  <div class="modal-dialog" role="document">'+
'    <div class="modal-content">'+
'      <div class="modal-header">'+
'        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
'        <h4 class="modal-title">插入气泡对话</h4>'+
'      </div>'+
'      <div class="modal-body">'+
'        <div contenteditable="true" style="width:100%;height:400px;border:1px solid #eee;overflow-y:scroll;" id="dxy-bubbletalk-content">'+
'          '+
'        </div>'+
'      </div>'+
'      <div class="modal-footer">'+
'        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'+
'        <button class="btn btn-primary" type="button" id="confirm-bubbletalk">确认修改</button>'+
'      </div>'+
'    </div>'+
'  </div>'+
'</div>'+
'<div class="modal fade" id="dxy-image-modal" tabindex="-1" role="dialog" aria-labelledby="dxy-image-modal">'+
'  <div class="modal-dialog" role="document">'+
'    <div class="modal-content">'+
'      <div class="modal-header">'+
'        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
'        <h4 class="modal-title">图片详情</h4>'+
'      </div>'+
'      <div class="modal-body">'+
'        <form>'+
'          <div class="form-group clearfix">'+
'            <label class="col-sm-3">图片链接：</label>'+
'            <div class="col-sm-9">'+
'              <input type="text" class="form-control" id="modal-image-link" placeholder="请输入图片链接">'+
'            </div>'+
'          </div>'+
'          <div class="form-group clearfix">'+
'            <label class="col-sm-3">图片描述：</label>'+
'            <div class="col-sm-9">'+
'              <input type="text" class="form-control" id="modal-image-desc" placeholder="请输入图片描述" >'+
'            </div>'+
'          </div>'+
'          <div class="form-group clearfix">'+
'            <label class="col-sm-3">高：</label>'+
'            <div class="col-sm-3">'+
'              <input type="text" class="form-control" id="modal-image-height" readonly>'+
'            </div>'+
'            <label class="col-sm-3">宽：</label>'+
'            <div class="col-sm-3">'+
'              <input type="text" class="form-control" id="modal-image-width" readonly>'+
'            </div>'+
'          </div>'+
'        </form>'+
'      </div>'+
'      <div class="modal-footer">'+
'        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'+
'        <button class="btn btn-primary" type="button" id="confirm-image">确认修改</button>'+
'      </div>'+
'    </div>'+
'  </div>'+
'</div>'+
'<div class="modal fade" id="dxy-drug-modal" tabindex="-1" role="dialog" aria-labelledby="dxy-drug-modal">'+
'  <div class="modal-dialog" role="document">'+
'    <div class="modal-content">'+
'      <div class="modal-header">'+
'        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
'        <h4 class="modal-title">插入药品</h4>'+
'      </div>'+
'      <div class="modal-body">'+
'        <form>'+
'          <div class="form-group row">'+
'            <label class="control-label col-md-6"><a>如何获取药品ID></a></label>'+
'            <label class="control-label col-md-6"><a>查找药品ID></a></label>'+
'          </div>'+
'          <div class="input-group" style="margin-bottom:15px;">'+
'            <input type="text" class="form-control" id="drug-id" placeholder="请输入5位药品数字ID">'+
'            <div class="input-group-btn">'+
'             <button class="btn btn-default" type="button" id="confirm-drug">确认提交</button>'+
'            </div>'+
'          </div>'+
'          <div class="form-group">'+
'            <label class="control-label" id="J-drug-info"></label>'+
'          </div>'+
'          <div class="form-group">'+
'           <label class="control-label" id="J-drug-not-find" style="display:none;">该药品 ID 不存在，请查验</label>'+
'          </div>'+
'        </form>'+
'      </div>'+
'    </div>'+
'  </div>'+
'</div>'+
'<div class="modal fade" id="dxy-vote-modal" tabindex="-1" role="dialog" aria-labelledby="dxy-vote-modal">'+
'  <div class="modal-dialog" role="document">'+
'    <div class="modal-content">'+
'      <div class="modal-header">'+
'        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
'        <h4 class="modal-title">投票组编辑</h4>'+
'      </div>'+
'      <div class="modal-body">'+
'      </div>'+
'      <div class="modal-footer">'+
'        <button class="btn btn-primary" type="button" id="confirm-vote">确定</button>'+
'      </div>'+
'    </div>'+
'  </div>'+
'</div>';
$(document).ready(function(){
	$('body').append($(modals));
});
});