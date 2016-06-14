/**
 * Created by admin on 2015/12/29.
 */

var defaultConfig = {
    "head": {
        "title": "此处填写标题"
    },
    "body": {
        "object": {
            "style": {
                "global": {
                    "background_color": "#fec157;",
                    "font_color": "#fec157;",
                    "vote_group_id": "213"
                },
                "home_page": {
                    "img": "http://assets.dxycdn.com/app/event/20151229/img/start.png",
                    "start_button": "开始页按钮的文字内容",
                    "mask_title" : 'pc端标题'           
                },
                "vote_page": {
                    "trim_strip_img": "http://assets.dxycdn.com/app/event/20151229/img/trim-strip.png",
                    "button_img": "http://assets.dxycdn.com/app/event/20151229/img/topic-bg.png"
                },
                "stat_page": {
                    "title_background_img":"http://assets.dxycdn.com/app/event/20151229/img/tit-bg.png",
                    "bar_img": "http://assets.dxycdn.com/app/event/20151229/img/statistics-tit.png",
                    "background_color": "#fec157;",
                    "redirect_img" : 'http://assets.dxycdn.com/app/event/20151229/img/jump.png',
                    "title_words": "ssss",
                },
                "qr" : {
                    "qr_img" : "http://api.dxy.cn/qr-code/?url=http://edm.dxycdn.com/topic/h5event/1452147092696/index.htm&size=11&margin=1&format=png"
                }
            },
            "votes": [{
                "img": "http://assets.dxycdn.com/app/event/20151229/img/topic-13.png"
            }, {
                "img": "http://assets.dxycdn.com/app/event/20151229/img/topic-12.png"
            },{
                "img": "http://assets.dxycdn.com/app/event/20151229/img/topic-12.png"
            }],
            "wechat" : {
                 "login_url" : "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd7d7ed7ce244aae9&redirect_uri=http%3A%2F%2Fdxy.com%2Fauth%2Flogin%2Fwechat%3Fredirect_uri%3DaHR0cHM6Ly9hY2NvdW50LmR4eS5jb20vbG9naW4_cmVkaXJlY3RfdXJpPWh0dHA6Ly9keHkuY29tL3Byb21vdGlvbi9kLzIwMTYwMTA4MTc1NDE0Lmh0bQ&response_type=code&scope=snsapi_login#wechat_redirect",
                 "share" : {
                     "title": "sssss",
                     "link": "http://dxy.com/promotion/d/20160108175414.htm",
                     "desc": "有槽不吐，憋着辛苦。",
                     "imgUrl": "http://assets.dxycdn.com/app/event/20151229/img/share.jpg",
                 }
            }
        }
    }
}; 
window.obj = {
    body : {
        object : window.obj
    }
};

$.extend(true, defaultConfig, window.obj);

window.obj = defaultConfig;

var ts = '20151229',
    debug =false;
// 微信相关
function setWxConfig(data) {
    var config = {
        debug: false,
        appId: data.appid,
        timestamp: data.timestamp,
        nonceStr: data.noncestr,
        signature: data.sign,
        jsApiList: [
            'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo'
        ]
    };
    wx.config(config);
}


var tpl = "<%_.each(content.nodes, function(node, i){%>\
                <span ><%=node.node_value%></span>\
            <%})%>";

function setShareConfig(config) {
    wx.onMenuShareTimeline(config);
    wx.onMenuShareAppMessage(config);
    wx.onMenuShareQQ(config);
    wx.onMenuShareWeibo(config);
}

// 微信分享设置
var shareConfig = window.obj.body.object.wechat.share;
shareConfig.success = function(){
     _gaq.push(["_trackEvent", 'event', 'gravidaGoods', 'shared']);
};
if(/micromessenger/i.test(navigator.userAgent)){
    $.ajax({
        type: 'GET',
        url: 'https://sim.dxy.cn/japi/js/sign/8',
        dataType: 'jsonp',
        jsonp: 'callback',
        jsonpCallback: 'setWxConfig',
        success: function(data, stat, xhr){
            wx.ready(function(){
                setShareConfig(shareConfig);
            });
        }
    });
}

// 主程序
var TEST = {

    nodes : {
        mask: '.J-mask2',
        guide: '.J-guide',
        startBtn: '.J-start-btn',
        shiftBlk: '.J-shift-blk',
        processBlk: 'pos-process',
        resultBlk: 'pos-result',
        topicContainer: '.J-topic-container',
        topicScale: 'topic-click',
        title: '.J-title',
        themeWord: '.J-theme',
        themeSrc: '.J-img-theme',
        answer_1: '.J-answer-one',
        answer_2: '.J-answer-two',
        answer_3: '.J-answer-three',
        statistics: '.J-statistics',
        left_ratio: '.J-ratio-left',
        left_ratio_num: '.J-num-left',
        right_ratio: '.J-ratio-right',
        right_ratio_num: '.J-num-right',
        small_img: '.J-result-img'
    },

    // 判断当前题数
    count: 0,

    // 是否执行投票流程
    do: false,

    // 存储投票信息
    msgContainer: {},

    // 返回给后端的用户选项答案
    sendAnswer: {},

    renderTemplate : function(){
        var startTpl = $('#startTpl').html(),
            maskTpl = $('#maskTpl').html();
        $('.start').html(_.template(startTpl)(window.obj));
        $('.mask').html(_.template(maskTpl)(window.obj));
        this.setCss();
    },

    init: function () {
        var self = this;
        self.renderTemplate();
        self.result(function(){
             if(self.do) {
                self.requestVote();
                $(self.nodes.topicContainer).on('click', function (e) {
                    var obj = $(e.target);
                    self.clickEffect(obj);
                });
            }
        });
    },

    // 引导用户登录
    guide: function () {
        $(TEST.nodes.mask).show();
        $(TEST.nodes.guide).on('click',function () {
            window.location.href = window.obj.body.object.wechat.login_url;
        });
    },

    // 开始游戏
    start: function () {
        var self = this;
        $(self.nodes.shiftBlk).addClass(self.nodes.processBlk);
        self.renderNode();
    },

    setCss : function(){
        $('body, .pos-process .process, .pos-result .blk, .pos-result .result').css('backgroundColor', obj.body.object.style.global.background_color);
        $('.trim-strip').css('backgroundImage', 'url("'+obj.body.object.style.vote_page.trim_strip_img+'")');
        $('.result .jump .click, .start .container-img .start-btn').css('color', obj.body.object.style.global.font_color);
    },

    // 请求获取投票题目内容
    requestVote: function () {
        var self = this;
        $.ajax({
            //  测试接口   http://f2e.dxy.net/tools/json/120.json
            url: '/view/i/functionmarker/single?obj_id='+window.obj.body.object.style.global.vote_group_id+'&type=10',
            async: false,
            type: 'GET',
            dataType: 'json',
            success: function (msg) {
                var nodes = msg.data.items[0].votes;
                window.obj.votes = nodes;
                self.votesCount = nodes.length;
                self.sortNode(nodes);
            }
        });
    },

    /**
     * 题目排序
     * @param {Array} nodes 请求的投票题目
     */
    sortNode: function (nodes) {
        // var nodeConatiner,
        //     j,
        //     i = 0,
        //     self = this,
        //     nodeLen = nodes.length;
        // for(i; i < nodeLen; i++) {
        //     for(j = i + 1 ; j < nodeLen; j++) {
        //         if(nodes[i].sort > nodes[j].sort) {
        //             nodeContainer = nodes[i];
        //             nodes[i] = nodes[j];
        //             nodes[j] = nodeContainer;
        //         }
        //     }
        // }
        var self = this;
        self.sortVote(nodes);
    },

    /**
     * 题目的选项排序
     * @param {Array} nodes 排好顺序的题目
     */
    sortVote: function (nodes) {
        // var voteContainer,
        //     j,
        //     i = 0,
        //     k = 0,
        //     self = this,
        // voteLen = nodes[0].nodes.length;
        // for(k; k < nodes.length; k++) {
        //     var votes = nodes[k].nodes;
        //     for(i; i < voteLen; i++) {
        //         for(j = i + 1 ; j < voteLen; j++) {
        //             if(votes[i].sort > votes[j].sort) {
        //                 voteContainer = votes[i];
        //                 votes[i] = votes[j];
        //                 votes[j] = voteContainer;
        //             }
        //         }
        //     }
        //     i = 0;
        //     nodes[k].nodes = votes;
        // }
        var self = this;
        self.msgContainer = nodes;

        // 开始游戏
        if(self.do) {
            $(self.nodes.startBtn).on('click', function (){
                // _gaq.push(["_trackEvent", 'event', 'gravidaGoods', 'firstClick']);
                self.start();
            });
        }
    },

    // 渲染选项内容
    renderNode: function () {
        var self = this,
            content = self.msgContainer[self.count];
        if(self.count > self.votesCount-1) {

            // _gaq.push(["_trackEvent", 'event', 'gravidaGoods', 'lastClick']);
            self.send();
            self.shiftBlk();
            self.result();
            return;
        }
        $(self.nodes.title).text('第'+(self.count+1)+'题('+(self.count+1)+'/'+self.votesCount+')');
        $(self.nodes.themeWord).text(content.vote_title);
        $(self.nodes.themeSrc).attr('src','http://assets.dxycdn.com/app/event/20151229/img/topic-'+(self.count+1)+'.png?t=1452855753450');
        $(self.nodes.topicContainer).html(_.template(tpl)({
            content : content,
            config : obj
        }));
        // $(self.nodes.answer_1).text(content.nodes[2].node_value);
        // $(self.nodes.answer_2).text(content.nodes[1].node_value);
        // $(self.nodes.answer_3).text(content.nodes[0].node_value);
        self.clearEffect();
        self.setCss();
    },

    /**
     * 选择答案时的动态效果并调到下题
     * @param topic 当前选择的答案对象
     * @return {null}
     */
    clickEffect: function (topic) {
        var self = this;
        var singleAnswer = self.saveAnswer(topic);
        topic.addClass(self.nodes.topicScale);
        setTimeout(function () {
            topic.removeClass(self.nodes.topicScale);
            self.count += 1;
            self.renderNode();
        },400);
    },

    // 保存答案
    saveAnswer: function (topic) {
        var self = this,
            answerContainer,
            index,
            vote = self.msgContainer;
        if(self.count === 0) {
            self.sendAnswer.group_id = vote[0].group_id;
            self.sendAnswer.answer = [];
        }
        answerContainer = {};
        answerContainer.vote_id = vote[self.count].vote_id;
        index = topic.index();
        // if(topic.index() === 0) {
        //     index = 2;
        // } else if (topic.index() === 2) {
        //     index = 0;
        // } else {
        //     index = 1;
        // }
        answerContainer.node_id = vote[self.count].nodes[index].node_id;
        self.sendAnswer.answer[self.count] = answerContainer;
    },

    // 测试题页切换到结果页
    shiftBlk: function () {
        var self = this;
        $(self.nodes.shiftBlk).removeClass(self.nodes.processBlk).addClass(self.nodes.resultBlk);
    },

    // 恢复点击题目的动态效果
    clearEffect: function () {
        var self = this;
        $(self.nodes.topicContainer).children('span').each(function () {
            if($(this).hasClass(self.nodes.topicScale)) {
                $(this).removeClass(self.nodes.topicScale);
                return;
            }
        });
    },

    // 发送答案
    send: function () {
        var self = this,
            i = 0;

        var str = "group_id="+self.sendAnswer.group_id;
        for(i; i < self.sendAnswer.answer.length; i++) {
           str += "&node_id="+self.sendAnswer.answer[i].node_id +"&vote_id="+ self.sendAnswer.answer[i].vote_id;
        }
        console.log(str);

        $.ajax({
            url: '/user/i/vote/result/batch_add',
            type: 'POST',
            async: false,
            data: str
        });
    },

    // 请求结果数据
    result: function (callback) {
        var self = this;
        $.ajax({
            //   测试接口    http://f2e.dxy.net/tools/json/121.json
            url:'/user/i/vote/stat/list?group_id='+window.obj.body.object.style.global.vote_group_id+'&items_per_page=50',
            async: true,
            type: 'GET',
            dataType: 'json',
            error: function () {
                if(confirm('请先登录微信账号')) {
                    window.location.href = window.obj.body.object.wechat.login_url;
                } else {
                    self.guide();
                }
            },
            success: function (result) {
                if(!result.error) {
                    if(self.do) {
                        self.unifyVote(result);
                    } else {
                        // 已登录已投票，直接渲染结果
                        self.requestVote();
                        self.unifyVote(result);
                        self.shiftBlk();
                    }
                } else {
                    // 已登录未投票
                    self.do = true;
                    callback();
                }
            }
        });
    },

    /**
     * 将同一题的选项放在一起
     * @param {json} result
     * @return null
     */
    unifyVote: function (result) {
        var self = this;
        _.each(result.data.items, function(item, i){
            var count = item.count,
                vid = item.vote_id,
                nid = item.node_id,
                vote = _.find(self.msgContainer, function(v){
                    return v.vote_id === vid;
                }),
                node = _.find(vote.nodes, function(n){
                    return n.node_id === nid;
                });
            if(!vote.total){
                vote.total = 0;
            }
            if(!node.total){
                node.total = 0;
            }
            vote.total += count;
            node.total += count;
        });
        // var j,
        //     container,
        //     newVote = [ ],
        //     self = this,
        //     nodes = result.data.items,
        //     nodesLen = nodes.length,
        //     i = 0;

        // // 将结果数据排序，同一题排在一起
        // for( i ; i < nodesLen; i++ ) {
        //     for(j = i + 1; j < nodesLen; j++) {
        //         if(nodes[i].vote_id > nodes[j].vote_id){
        //             container = nodes[i];
        //             nodes[i] = nodes[j];
        //             nodes[j] = container;
        //         }
        //     }
        // }
        // // 将同一题的选项排序放在newVote内
        // i = 0;
        // j = 0;
        // for(i; i < nodesLen; i = i + 3) {
        //     newVote[j] =[ ];
        //     newVote[j][0] = nodes[i];
        //     newVote[j][1] = nodes[i + 1];
        //     newVote[j][2] = nodes[i+ 2];
        //     j ++;
        // }
        self.renderCartogram();
    },

    /**
     * 填充结果页统计的数据百分比
     * @param {Array} newContainer
     * @return null
     */
    renderCartogram: function () {
        var resultTpl = $('#resultTpl').html();
        $('.result').html(_.template(resultTpl)(window.obj));
        var self = this,
            i = 0,
            j = 0,
            ratioContainer = [];

        _.each(self.msgContainer, function(vote, i){
            ratioContainer[i] = {
                vote_id : vote.vote_id,
                node_ratio_left : Math.round(vote.nodes[0].total * 100 /  vote.total)+'%',
                node_ratio_right:  Math.round(vote.nodes[1].total * 100 /  vote.total)+'%'
            };
        });

        // for(i; i < newContainer.length; i++) {
        //     allCount = 0;
        //     _.each(newContainer[i], function(node){
        //         if(node){
        //              allCount += node.count;
        //         }
        //     });
        //     ratioContainer[i] = {
        //         vote_id: newContainer[i][0].vote_id,
        //         node_ratio_left: Math.round(newContainer[i][0].count * 100 /  allCount)+'%',
        //         node_ratio_right:  newContainer[i][2] ? Math.round(newContainer[i][2].count * 100 /  allCount)+'%' : Math.round(newContainer[i][1].count * 100 /  allCount)+'%'
        //     };
        // }

        $(self.nodes.statistics).each(function () {
            $(this).find(self.nodes.left_ratio).css('width', ratioContainer[j].node_ratio_left);
            $(this).find(self.nodes.left_ratio_num).text(ratioContainer[j].node_ratio_left);
            $(this).find(self.nodes.right_ratio).css('width', ratioContainer[j].node_ratio_right);
            $(this).find(self.nodes.right_ratio_num).text(ratioContainer[j].node_ratio_right);
            j ++;
        });
        self.setCss();
    },

    /**
     * 排好题目顺序
     * @param {Array} newContainer
     * @returns null
     */
    matchVotes: function (newContainer) {
        var i = 0,
            j,
            container,
            self = this,
            msgLen = self.msgContainer.length;
        for(i; i < msgLen; i++) {
            for(j = i+1; j < msgLen; j++){
                if(self.msgContainer[i].vote_id == newContainer [j].vote_id) {
                    container = newContainer[i];
                    newContainer [i] = newContainer [j];
                    newContainer[j] = container;
                }
            }
        }
       // console.log(newContainer);
        return self.matchNodes(newContainer);
    },

    /**
     * 为题目中的选项排好顺序
     * @param {Array} newContainer
     * @returns {Array} container 排序好的最终数据
     */
    matchNodes: function (newContainer) {
        var j = 0,
            i = 0,
            k = 0,
            self = this,
            container,
            msgLen = self.msgContainer.length;

        for(i; i < 3; i++) {
            j = 0;
            for(j; j < 3; j++) {
                k = 0;
                for(k; k < 3; k++) {
                    if(self.msgContainer[i].nodes[j].node_id == newContainer[i][k].node_id ) {
                        container = newContainer[i][j];
                        newContainer[i][j] = newContainer[i][k];
                        newContainer[i][k] = container;
                    }
                }
            }
        }
       // console.log(newContainer);
        return newContainer;
    }
};

$(function () {
    FastClick.attach(document.body);
    // 初始化
    if(true) {
        debug = true;
        // 初始化
        TEST.init() ;
    }

    //ga
    if(debug) {
        $(TEST.nodes.startBtn).on('click', function () {
            _gaq.push(["_trackEvent", 'event', 'gravidaGoods', 'startClick']);
        });
        $('.click').on('click',function() {
            _gaq.push(["_trackEvent", 'event', 'gravidaGoods', 'clickMore']);
        });
    }
});
