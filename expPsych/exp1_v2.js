var jsPsych = initJsPsych({
  on_finish: function() {
      //控制台打印所有数据
      console.log(jsPsych.data.get().values());
      //保存人口学变量
      console.log(id);
      //保存文件名
      filename = `data_${id}_${age}_${sex}`;
      
      exportToExcel(expData, filename);  //保存文件
  }
});//初始化jsPsych

var timeline = [];

//保存数据为csv
function exportToExcel(data, fileName) {
  const csv = convertToCSV(data); // 将数据转换为CSV格式
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); // 创建Blob对象
  const url = URL.createObjectURL(blob); // 转换为URL
  const link = document.createElement('a'); // 创建<a>元素
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click(); // 触发下载
  document.body.removeChild(link); // 清理
}

function convertToCSV(data) {
  const rows = [];
  for (let i = 0; i < data.length; i++) {
    const row = [];
    for (let j = 0; j < data[i].length; j++) {
      row.push(`"${data[i][j]}"`); // 将每个单元格格式化为带引号的字符串
    }
    rows.push(row.join(',')); // 将每行数据连接为一个字符串
  }
  return rows.join('\n'); // 将所有行数据连接为一个字符串
}


var filename;
var id;
var sex;
var age;
var targetNum;
var dir;
var trialIndex = 0;

var all_data = jsPsych.data.get().values();

//初始化实验数据，方向，刺激情绪，是否反应，方向判断
var expData = [['dir','valence','yesno','direction']];
var tempData;
var directionSeries = [];

var survey = {
  type: jsPsychSurveyText,
  questions: [
    {prompt: 'Subject ID', name: 'id'},
    {prompt: 'Age', name: 'age'},
    {prompt: 'Sex', placeholder: 'M/F', name: 'sex'}
  ],
  css_classes: 'surveyStyle',
  on_finish: function(data){
      console.log(data.response);
      id = data.response.id;
      sex = data.response.sex;
      age = data.response.age;
   }
};
timeline.push(survey);

var welcome = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "欢迎参加实验，按任意键继续"
};
timeline.push(welcome);

//full screen
timeline.push({
  type: jsPsychFullscreen,
  fullscreen_mode: true,
  message: `<p>即将进入全屏</p>`,
  button_label: '继续'
});   

var instruction = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<p>指导语</p>
  <p>实验中你会看到一系列快速呈现的图片</p>
  <p>你需要判断这些图片中是否有一张向左或向右旋转的图片</p>
  <p>按空格继续</p>`,
choices: [' ']
};
timeline.push(instruction);



var fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<span style="font-size:48px">+</span>',
  choices: 'NO_KEYS',
  size : 80,
  trial_duration: 500,
  
};


/* 随机打乱数组中的元素: Fisher-Yates算法
* @param {Array} a 包含元素的数组。 
*/ 
function shuffle (a) { 
for (let i = a.length - 1; i > 0; i--) { 
  // 随机选择一个位置
  const j = Math.floor (Math.random () * (i + 1)); 
  // 交换当前元素和随机元素
  [a [i], a [j]] = [a [j], a [i]]; 
} 
return a; 
} 

//随机数
function getRandomInteger (min, max) {
  // min和max都包含在可能的结果中
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//提示
var negativePrompt = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size:48px; color:white;">请忽略以下出现消极情绪的图片</p>',
  choices: 'NO_KEYS',
  trial_duration: 1000,
  on_finish: function(){
      tempData = [1];
  }
};//消极提示

var positivePrompt = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size:48px; color:white;">请忽略以下出现积极情绪的图片</p>',
  choices: 'NO_KEYS',
  trial_duration: 1000,
  on_finish: function(){
      tempData = [2];
  }
};//积极提示

var noPrompt = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size:48px; color:white;"></p>',
  choices: 'NO_KEYS',
  trial_duration: 100,
  on_finish: function(){
      tempData = [0];
  }
};//无提示

//SVRP

//总图片库

//正性图片数据库
var imagesPositive =  [];

var numPos = 37; //正性图片的数量
for(var i=1; i<=numPos; i++){
  var num = i.toString ().padStart (3, '0');
  // 将image和转换后的数字拼接起来
  var imName = 'positive/output/Positive' + num +'.jpg';
  imagesPositive.push({content: imName, class: 'emotion'});
};

var numNeu = 48; //中性图片的数量
for(var i=1; i<=numNeu; i++){
  var num = i.toString ().padStart (3, '0');
  // 将image和转换后的数字拼接起来
  var imName = 'neutral/output/Neutral' + num +'.jpg';
  imagesPositive.push({content: imName, class: 'flanker'});
};

var numNeuLeft = 48; //左旋图片的数量
for(var i=1; i<=numNeuLeft; i++){
  var num = i.toString ().padStart (3, '0');
  // 将image和转换后的数字拼接起来
  var imName = 'neutral/left/Neutral' + num +'left.jpg';
  imagesPositive.push({content: imName, class: 'left'});
};

var numNeuRight = 48; //右旋图片的数量
for(var i=1; i<=numNeuRight; i++){
  var num = i.toString ().padStart (3, '0');
  // 将image和转换后的数字拼接起来
  var imName = 'neutral/right/Neutral' + num +'right.jpg';
  imagesPositive.push({content: imName, class: 'right'});
};

var trialPos = {
  timeline: [
    {
      type: jsPsychImageKeyboardResponse,
      stimulus_height: 600,
      stimulus_width: 600,
      stimulus: jsPsych.timelineVariable('content'),
      choices: 'NO_KEYS',
      trial_duration: 100,
    }
  ],
  timeline_variables: imagesPositive,
  sample: {
    type: 'custom',
    fn: function(t){
      //t: [0,...]
      var indexFlanker = [];//中性图片
      for (var i=numPos;i<numPos+numNeu;i++){
        indexFlanker.push(i);
      }
      var indexFlankerShuffled = shuffle(indexFlanker);
      var svrpOrder = [];
      var j=0;
      var interferenceIndex = Math.floor (Math.random () * 13);//情绪刺激在rsvp的位置
      var interferenceNum = getRandomInteger(0,numPos-1);//情绪刺激的在图库的序号
      targetNum = getRandomInteger(numPos+numNeu, numPos+numNeu+numNeuLeft+numNeuRight-1);//目标刺激的位置
      console.log(tempData);
      console.log(imagesPositive[targetNum].class);
      //判断目标刺激出现的左右
      dir = imagesPositive[targetNum].class;
      console.log(dir);
      directionSeries.push(dir);
      for (var i=0; i<15;i++){
        if (i==interferenceIndex){
          svrpOrder.push(interferenceNum);
        }
        else if (i==interferenceIndex+2){
          svrpOrder.push(targetNum);
        }
        else{
          svrpOrder.push(indexFlankerShuffled[j]);
          j+=1;
        }
      }
      if (dir=='left'){
        console.log(1);
      }
      else{
        console.log(2);
      }
      return svrpOrder;
    }
  },
  on_timeline_start: function(){
    tempData = [];
    tempData.push(directionSeries[trialIndex]);
    trialIndex++;
    tempData.push(1);//正性1，中性0，负性2
  }
};

//负性图片数据库
var imagesNegative =  [];

var numNeg = 48; //负性图片的数量
for(var i=1; i<=numNeg; i++){
  var num = i.toString ().padStart (3, '0');
  // 将image和转换后的数字拼接起来
  var imName = 'negative/output/Negative' + num +'.jpg';
  imagesNegative.push({content: imName, class: 'emotion'});
};

//中性图片的数量
for(var i=1; i<=numNeu; i++){
  var num = i.toString ().padStart (3, '0');
  // 将image和转换后的数字拼接起来
  var imName = 'neutral/output/Neutral' + num +'.jpg';
  imagesNegative.push({content: imName, class: 'flanker'});
};

//左旋图片的数量
for(var i=1; i<=numNeuLeft; i++){
  var num = i.toString ().padStart (3, '0');
  // 将image和转换后的数字拼接起来
  var imName = 'neutral/left/Neutral' + num +'left.jpg';
  imagesNegative.push({content: imName, class: 'left'});
};

//右旋图片的数量
for(var i=1; i<=numNeuRight; i++){
  var num = i.toString ().padStart (3, '0');
  // 将image和转换后的数字拼接起来
  var imName = 'neutral/right/Neutral' + num +'right.jpg';
  imagesNegative.push({content: imName, class: 'right'});
};

var trialNeg = {
  timeline: [
    {
      type: jsPsychImageKeyboardResponse,
      stimulus_height: 600,
      stimulus_width: 600,
      stimulus: jsPsych.timelineVariable('content'),
      choices: 'NO_KEYS',
      trial_duration: 100,
    }
  ],
  timeline_variables: imagesNegative,
  sample: {
    type: 'custom',
    fn: function(t){
      //t: [0,...]
      var indexFlanker = [];//中性图片
      for (var i=numNeg;i<numNeg+numNeu;i++){
        indexFlanker.push(i);
      }
      var indexFlankerShuffled = shuffle(indexFlanker);
      var svrpOrder = [];
      var j=0;
      var interferenceIndex = Math.floor (Math.random () * 13);//情绪刺激在rsvp的位置
      var interferenceNum = getRandomInteger(0,numNeg-1);//情绪刺激的在图库的序号
      targetNum = getRandomInteger(numNeg+numNeu, numNeg+numNeu+numNeuLeft+numNeuRight-1);//目标刺激的位置
      console.log(tempData);
      console.log(imagesNegative[targetNum].class);
      //判断目标刺激出现的左右
      dir = imagesNegative[targetNum].class;
      console.log(dir);
      directionSeries.push(dir);
      for (var i=0; i<15;i++){
        if (i==interferenceIndex){
          svrpOrder.push(interferenceNum);
        }
        else if (i==interferenceIndex+2){
          svrpOrder.push(targetNum);
        }
        else{
          svrpOrder.push(indexFlankerShuffled[j]);
          j+=1;
        }
      }
      if (dir=='left'){
        console.log(1);
      }
      else{
        console.log(2);
      }
      return svrpOrder;
    }
  },
  on_timeline_start: function(){
    tempData = [];
    console.log(dir);
    console.log(targetNum);
    tempData.push(directionSeries[trialIndex]);
    trialIndex++;
    tempData.push(2);//正性1，中性0，负性2
  }
};

//中性图片数据库
var imagesNeutral =  [];

//中性图片的数量
for(var i=1; i<=numNeu; i++){
  var num = i.toString ().padStart (3, '0');
  // 将image和转换后的数字拼接起来
  var imName = 'neutral/output/Neutral' + num +'.jpg';
  imagesNeutral.push({content: imName, class: 'flanker'});
};

//左旋图片的数量
for(var i=1; i<=numNeuLeft; i++){
  var num = i.toString ().padStart (3, '0');
  // 将image和转换后的数字拼接起来
  var imName = 'neutral/left/Neutral' + num +'left.jpg';
  imagesNeutral.push({content: imName, class: 'left'});
};

//右旋图片的数量
for(var i=1; i<=numNeuRight; i++){
  var num = i.toString ().padStart (3, '0');
  // 将image和转换后的数字拼接起来
  var imName = 'neutral/right/Neutral' + num +'right.jpg';
  imagesNeutral.push({content: imName, class: 'right'});
};

var trialNeu = {
  timeline: [
    {
      type: jsPsychImageKeyboardResponse,
      stimulus_height: 600,
      stimulus_width: 600,
      stimulus: jsPsych.timelineVariable('content'),
      choices: 'NO_KEYS',
      trial_duration: 100,
    }
  ],
  timeline_variables: imagesNeutral,
  sample: {
    type: 'custom',
    fn: function(t){
      //t: [0,...]
      var indexFlanker = [];//中性图片
      for (var i=0;i<numNeu;i++){
        indexFlanker.push(i);
      }
      var indexFlankerShuffled = shuffle(indexFlanker);
      var svrpOrder = [];
      var j=0;
      var interferenceIndex = Math.floor (Math.random () * 13);//情绪刺激在rsvp的位置
      var interferenceNum = getRandomInteger(0,numNeu-1);//情绪刺激的在图库的序号
      targetNum = getRandomInteger(numNeu, numNeu+numNeuLeft+numNeuRight-1);//目标刺激的位置
      console.log(tempData);
      console.log(imagesNeutral[targetNum].class);
      //判断目标刺激出现的左右
      dir = imagesNeutral[targetNum].class;
      console.log(dir);
      directionSeries.push(dir);
      for (var i=0; i<15;i++){
        if (i==interferenceIndex){
          svrpOrder.push(interferenceNum);
        }
        else if (i==interferenceIndex+2){
          svrpOrder.push(targetNum);
        }
        else{
          svrpOrder.push(indexFlankerShuffled[j]);
          j+=1;
        }
      }
      if (dir=='left'){
        console.log(1);
      }
      else{
        console.log(2);
      }
      return svrpOrder;
    }
  },
  on_timeline_start: function(){
    tempData = [];
    console.log(dir);
    console.log(targetNum);
    tempData.push(directionSeries[trialIndex]);
    trialIndex++;
    tempData.push(0);//正性1，中性0，负性2
  }
};


//选择是否,0是,1否，但是保存的时候是1，否0
var choose = {
    type: jsPsychHtmlButtonResponse,
    stimulus: '<p style="font-size:48px">你是否看见了一张旋转的图片</p>',
    choices: ['是', '否'],
};
//选择左右，左0(1)，右1(2)
var direction = {
    timeline: [
      {
        type: jsPsychHtmlButtonResponse,
        stimulus: '<p style="font-size:48px">旋转的图片的方向是</p>',
        choices: ['左', '右'],
      }
    ],
    conditional_function: function(){
        var data = jsPsych.data.get().values();
        var responseYN = data[data.length-1].response;
        if (responseYN===1){
            var responseYN = data[data.length-1].response;
            tempData.push(1-responseYN);
            expData.push(tempData);
            console.log(tempData);
        }
        return responseYN===0;
    },
    on_finish: function(data){
        var data = jsPsych.data.get().values();
        var responseLR = data[data.length-1].response;
        tempData.push(1,responseLR+1);
        expData.push(tempData);
        console.log(tempData);
    }
};

var orderTrial = [];
var nTrial = 12;
for (var i=0;i<nTrial;i++)
{
  orderTrial.push(0);
  orderTrial.push(1);
  orderTrial.push(2);
}
orderTrial = shuffle(orderTrial);

for (var k=0;k<orderTrial.length;k++)
{
  timeline.push(fixation);
  if (orderTrial[k]==0){
    timeline.push(trialNeu);
  }
  if (orderTrial[k]==1){
    timeline.push(trialPos);
  }
  if (orderTrial[k]==2){
    timeline.push(trialNeg);
  }
  timeline.push(choose);
  timeline.push(direction);
}


  
timeline.push({
    type: jsPsychFullscreen,
    fullscreen_mode: false
  }); 
jsPsych.run(timeline);
  
console.log(all_data);
console.log(expData);