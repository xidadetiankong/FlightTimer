// pages/calclator/calculator.js
Page({

  data: {
    resultData: [], //最终结果存储，按下等号后起作用
    inputvalue: '', //only for showing the inputvalue将输入参数单独展示
    inputTemp: '', //记录数字输入记录
    equationRC:'',//算式输入记录


    resultTemp: '', //临时结果展示，点击op后生效,c初始值空1
    numberInput: '', //输入数据总数展示在输入框，点击num或op后生效2
    opValue: '' //3
  },
  // 其中包含以下函数 opBtn /numBtn/dotBtn/delBtn/restBtn/后期添加equalbtn将数据传至resultData
  //1.define the function of the equalbtn
  equalbtn:function(){

    var resultTemp = this.data.resultTemp;
    var numberInput = this.data.numberInput;
    var opValue = this.data.opValue;
    var equationRC=this.data.equationRC

    //先判断是否为空值
    if(resultTemp!=''&&opValue!=''&&numberInput!=''){
console.log('在哪里',(123).toString())
      switch(opValue){
        
        case '+': resultTemp=((parseFloat(resultTemp)+parseFloat(numberInput) ) .toFixed(6)).toString()
        console.log('在这里')
        break;
        case '-': resultTemp=((parseFloat(resultTemp)-parseFloat(numberInput) ) .toFixed(6)).toString()
        console.log('在这里')
        break;
        case '*': resultTemp=((parseFloat(resultTemp)*parseFloat(numberInput) ) .toFixed(6)).toString()
        console.log('在这里')
        break;
        case '/': resultTemp=((parseFloat(resultTemp)/parseFloat(numberInput) ) .toFixed(6)).toString()
        console.log('在这里')
        break;
        case '%': resultTemp=((parseFloat(resultTemp)%parseFloat(numberInput) ) .toFixed(6)).toString()
        console.log('在这里')
        break;

        
      }
    }



    console.log('终于到这了')
    this.setData({
      opValue: '',
      inputvalue: '=',
      resultTemp:resultTemp,
      numberInput:'',
      equationRC:resultTemp
    })

  },





  //1.define the function of the operator
  opBtn: function (e) {
    var resultTemp = this.data.resultTemp;
    var numberInput = this.data.numberInput;
    var opValue = this.data.opValue;
    var equationRC=this.data.equationRC

    //先判断是否为空值
    if (resultTemp === '' && ((opValue === '')||(opValue != '+')||(opValue != '-')||(opValue === '%')||(opValue === '*')||(opValue === '/'))) {
    
       wx.showToast({
         title: '请先输入数字',
       })
       this.setData({
        numberInput: '', //输入数据展示，点击num或op后生效
        inputvalue: '', //only for showing the inputvalue
        resultTemp: '', //临时结果展示，点击op后生效
        opValue: '',
        inputTemp: '',
       })
    }else if(resultTemp!=''&&opValue!=''&&numberInput!=''){
console.log('在哪里',(123).toString())
      switch(opValue){
        
        case '+': resultTemp=((parseFloat(resultTemp)+parseFloat(numberInput) ) .toFixed(6)).toString()
        console.log('在这里')
        break;
        case '-': resultTemp=((parseFloat(resultTemp)-parseFloat(numberInput) ) .toFixed(6)).toString()
        console.log('在这里')
        break;
        case '*': resultTemp=((parseFloat(resultTemp)*parseFloat(numberInput) ) .toFixed(6)).toString()
        console.log('在这里')
        break;
        case '/': resultTemp=((parseFloat(resultTemp)/parseFloat(numberInput) ) .toFixed(6)).toString()
        console.log('在这里')
        break;
        case '%': resultTemp=((parseFloat(resultTemp)%parseFloat(numberInput) ) .toFixed(6)).toString()
        console.log('在这里')
        break;

        
      }
    }



    console.log(e.target.dataset.val)
    this.setData({
      opValue: e.target.dataset.val,
      inputvalue: e.target.dataset.val,
      resultTemp:resultTemp,
      numberInput:'',
      equationRC:resultTemp
    })
  },
  //2.define the value of number button
 
  numBtn: function (e) {
    var num = e.target.dataset.val; //单次输入值
    var inputTemp = this.data.inputTemp;


    var resultTemp = this.data.resultTemp //1
    var numberIp = this.data.numberInput; //2
    var opValue = this.data.opValue //3


    if (resultTemp === '' && (opValue === '') &&(numberIp === '')) { //构建1号值初始值
      resultTemp = num
      console.log('aa')
      this.setData({
        resultTemp: num,
        inputTemp: num //只是传数据至输入框
      })
    } 
      else if ((resultTemp != '') && (opValue === '')&&(numberIp === '')) { //构建一号值
      resultTemp = resultTemp + num

      this.setData({
        resultTemp: resultTemp,
        inputTemp: resultTemp
      })
      console.log('bb', resultTemp)
    }
    else if ((resultTemp === '') &&(opValue === '-')&&(numberIp === '')) { //构建负值
      resultTemp ='-'+ num

      this.setData({
        resultTemp: resultTemp,
        inputTemp: resultTemp,
        opValue:''
      })
      
    }else if ((resultTemp === '') &&(opValue === '+')&&(numberIp === '')) { //构建先输入*时值
      resultTemp =''+ num

      this.setData({
        resultTemp: resultTemp,
        inputTemp: resultTemp,
        opValue:''
      })
      
    }else if ((resultTemp === '') &&(opValue === '*')&&(numberIp === '')) { //构建先输入*时值
      resultTemp ='0*'+ num

      this.setData({
        resultTemp: resultTemp,
        inputTemp: resultTemp,
        opValue:''
      })
      
    }
    else if ((resultTemp === '') &&(opValue === '/')&&(numberIp === '')) { //构建先输入/时值
      resultTemp ='0/'+ num

      this.setData({
        resultTemp: resultTemp,
        inputTemp: resultTemp,
        opValue:''
      })
      
    } else if ((resultTemp === '') &&(opValue === '%')&&(numberIp === '')) { //构建先输入/时值
      resultTemp =''+ num

      this.setData({
        resultTemp: resultTemp,
        inputTemp: resultTemp,
        opValue:''
      })
      
    }
    else if ((resultTemp != '') && (opValue != '') && numberIp === '') { //构建2号值初始值
      numberIp = num

      this.setData({
        numberInput: numberIp,
        inputTemp: numberIp //只是传数据至输入框
      })
      console.log('cc', numberIp)
    } else if ((resultTemp != '') && (opValue != '') && numberIp != '') { //构建2号值
      numberIp = numberIp + num
      this.setData({
        numberInput: numberIp,
        inputTemp: numberIp,
        equationRC:resultTemp+opValue+numberIp+'=',//算式输入记录
      })

      console.log('dd', numberIp)
    }; //构建2号值





    //限定输入框最大位数
    if (numberIp.length > 13 || inputTemp.length > 13 || resultTemp.length > 13) {
      wx.showToast({
        title: '已输入最大位数',
      })
      this.data.numberInput = numberIp.substring(0, 12);
      this.data.inputTemp = inputTemp.substring(0, 12);
      this.data.resultTemp = resultTemp.substring(0, 12)
    };

    //限制π值重复输入
    if(resultTemp===('3.143.14')&&num==='3.14'){
     
      wx.showToast({
        title: '请勿重复输入π',
      })
      this.setData({resultTemp:'3.14'})
    }

  
    var val = e.target.dataset.val;
    switch (num) {

      case (String(3.14)):
        this.setData({
          inputvalue: 'π'
        })
        break;
      default:
        this.setData({
          inputvalue: val
        })
    }

  },
  //4.define the decimal
  dotBtn: function () {
    var resultTemp = this.data.resultTemp //1
    var numberIp = this.data.numberInput; //2
    var dotnum = res => {
      if ((res === '')) {
        res = res + '0.'
        return res
      } else if ((res.indexOf('.') >= 0)) {
        wx.showToast({
          title: '请不要重复输入.',
        })
        return res
      } else {
        res = res + '.'
        return res
      }
    }
    if (numberIp === '') {
      this.setData({
        resultTemp: dotnum(resultTemp),

      })
    } else {
      this.setData({

        numberInput: dotnum(numberIp)
      })
    }


    // console.log('.')

  },
  //5.define the function backspace 
  delBtn: function () {
    console.log('退格')
    var inputTemp = this.data.inputTemp;



    var resultTemp = this.data.resultTemp; //1
    var numberIp = this.data.numberInput; //2
    var delet = res => {
      var length = res.length - 1;

      res = res.substring(0, length)
      return res
    }
    if (inputTemp === resultTemp) {
      this.setData({
        resultTemp: delet(resultTemp),
        inputTemp: delet(resultTemp),
      })
    } else if (inputTemp === numberIp) {
      this.setData({
        numberInput: delet(numberIp),
        inputTemp: delet(numberIp),
      })
    }


  },
  //6.define the function of reset
  restBtn: function () {
    console.log('清空')
    this.setData({
      resultData: [], //最终结果存储，按下等号后起作用
      numberInput: '', //输入数据展示，点击num或op后生效
      inputvalue: '', //only for showing the inputvalue
      resultTemp: '', //临时结果展示，点击op后生效
      opValue: '',
      inputTemp: '',
      equationRC:''
    })
  },
  


})