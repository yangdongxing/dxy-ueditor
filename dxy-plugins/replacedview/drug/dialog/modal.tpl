<div class="modal fade" id="dxy-drug-modal" tabindex="-1" role="dialog" aria-labelledby="dxy-drug-modal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">插入药品</h4>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group row">
            <label class="control-label col-md-6"><a>如何获取药品ID></a></label>
            <label class="control-label col-md-6"><a>查找药品ID></a></label>
          </div>
          <div class="input-group" style="margin-bottom:15px;">
            <input type="text" class="form-control" id="drug-id" placeholder="请输入5位药品数字ID">
            <div class="input-group-btn">
             <button class="btn btn-default" type="button" id="confirm-drug">确认提交</button>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label" id="J-drug-info"></label>
          </div>
          <div class="form-group">
           <label class="control-label" id="J-drug-not-find" style="display:none;">该药品 ID 不存在，请查验</label>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>