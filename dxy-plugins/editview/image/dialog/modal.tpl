<div class="modal fade" id="dxy-image-modal" tabindex="-1" role="dialog" aria-labelledby="dxy-image-modal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">图片详情</h4>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group clearfix">
            <label class="col-sm-3">图片链接：</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="modal-image-link" placeholder="请输入图片链接" readonly>
            </div>
          </div>
          <div class="form-group clearfix">
            <label class="col-sm-3">图片描述：</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="modal-image-desc" placeholder="请输入图片描述" >
            </div>
          </div>
          <div class="form-group clearfix">
            <label class="col-sm-3">高：</label>
            <div class="col-sm-3">
              <input type="text" class="form-control" id="modal-image-height" readonly>
            </div>
            <label class="col-sm-3">宽：</label>
            <div class="col-sm-3">
              <input type="text" class="form-control" id="modal-image-width" readonly>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        <button class="btn btn-primary" type="button" id="confirm-image">确认修改</button>
      </div>
    </div>
  </div>
</div>