var jsPsych = initJsPsych({
    on_finish:function(data){
        //console.log(score[1].Q0);
        console.log(data);
    }
});

var timeline = [];

var score = [];

var instruction = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <p>抑郁自评量表（SDS）</p><p>抑郁自评量表（Self-rating depression scale,SDS）由Zung编制于1965年，
    是用于心理咨询、抑郁症状筛查及严重程度评定的常用量表之一</p>
    <p>SDS共包含20个题目。请你仔细阅读每个题目，然后根据你最近一周的实际感受，选择一个最符合你情况的答案</p>
    <p>请你在开始答题前，确保你处于一个安静、舒适、不受干扰的环境，以保证问卷的准确性和有效性</p>
    <p>按任意键继续</p>
    `,
    choices: "ALL_KEYS",
};

timeline.push(instruction);

var questions = [
    {content: '我觉得闷闷不乐，情绪低沉'},
    {content: '我觉得一天中早晨最好'},
    {content: '我一阵阵哭出来或觉得想哭'},
    {content: '我晚上睡眠不好'},
    {content: '我吃得跟平常一样多'},
    {content: '我与异性密切接触时和以往一样感到愉快'},
    {content: '我发觉我的体重在下降'},
    {content: '我有便秘的苦恼'},
    {content: '我心跳比平常快'},
    {content: '我无缘无故地感到疲乏'},
    {content: '我的头脑跟平常一样清楚'},
    {content: '我觉得做经常做的事并没有困难'},
    {content: '我觉得不安而平静不下来'},
    {content: '我对将来抱有希望'},
    {content: '我比平常容易生气激动'},
    {content: '我觉得做出决定是容易的'},
    {content: '我觉得自己是个有用的人，有人需要我'},
    {content: '我的生活过得很有意思'},
    {content: '我认为如果我死了，别人会过得好些'},
    {content: '平常感兴趣的事我仍然感兴趣'}
]

var items = {
    type: jsPsychSurveyLikert,
    timeline: [
        {
            questions: [
                {
                    prompt: jsPsych.timelineVariable('content'),
                    labels: [
                        '没有或很少时间',
                        '少部分时间',
                        '相当多时间',
                        '绝大部分或全部时间'
                    ],
                    required: true
                }
            ],
            button_label: '确定'
        }
    ],
    /*sample: {
        type: 'with-replacement',
        size: 1,
    
    },*/
    timeline_variables: questions,
    on_finish: function(data){
        score.push(data.response);
    },
    on_timeline_finish: function(data){
        var data = jsPsych.data.get()
        console.log(data);
        console.log(score);
    }

}

timeline.push(items);
var final=0;
var debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        console.log(score[0]);
        for (var i=0;i<20;i++){
            if (i==1||i==4||i==5||i==10||i==11||i==13||i==15||i==16||i==17||i==19){
                final += 4-score[i]['Q0'];
            }
            else{
                final += score[i]['Q0'] +1;
            }
            console.log(final);
        }
        var finalStd = Math.floor(final*1.25);

        return `<p>你的标准分为${finalStd}</p>
          <p>根据SDS的中国常模</p>
          <p>标准分小于53为无抑郁</p>
          <p>标准分在53到62之间为轻度抑郁</p>
          <p>标准分在63到72之间为中度抑郁</p>
          <p>标准分大于72为重度抑郁</p>
          <p>注意：量表分值仅能作为一项参考指标而非绝对标准</p>
          `;

    },
    on_finish: function(){
        console.log(score);
    }
};
timeline.push(debrief_block);


jsPsych.run(timeline);
console.log(score);

  
