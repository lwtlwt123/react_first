import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 渲染了一个单独的button
/*
   当组件只包含一个render方法,不包含state,使用函数组件
   不需要定义一个继承于React.Component的类,我们可以定义一个函数,
   这个函数接受props作为参数,返回需要渲染的元素
*/
function Square(props) {
      return (
        //   点击某个格子，在控制台打印出‘click’
        // 箭头函数  减少输入的代码  避免this带来的困扰

        //onclick时间监听函数中调用this.setState
        // 我们就可以在每次<button>被点击的时候通知react去重新渲染组件
        // 组件更新之后,Square组件的this.state.value的值就会变为x 
        <button 
        className="square" 
        onClick={props.onClick}>
            {/* 接受子组件传递的数据 */}
          {props.value}
        </button>
      );
    // 希望Square组件科技记住它被点击过，用x填充对相应的方格
    // 可以在React组件的构造函数中设置this.state来初始化state  this.state应该被视为一个组件的私有属性
    //  在this.state中存储当前每个方块(Square)的值
    //  向class中添加一个构造函数 初始化state

    // constructor(props) {
    //   // 在JavaScript class中,每次定义子类的构造函数时,都要调用
    //   // super方法 在含有构造函数的React组件中,构造函数
    //   // 必须以super(props)开头
    //   super(props);
    //   this.state = {
    //     value:null,
    //   }
    // }    
  }
  
  //渲染了9个方块
  class Board extends React.Component {
    /*
         将所有的state状态数据存储在Board父组件中,之后Board组件可以将这些数据通过props
         传递给哥哥Square子组件
    */
  //  constructor(props){
  //    super(props);
  //   //  this(props);
  //    this.state = {
  //      squares:Array(9).fill(null),
  //      xIsNext:true
  //    }
  //  }
  
    renderSquare(i) {
        // 从父组件Board传递给了子组件Square
      return <Square 
      value={this.props.squares[i]} 
      onClick = {() => this.props.onClick(i)}
      />;
    }
  
    render() {
  
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  

  //渲染了含有默认值
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history:[{
          squares:Array(9).fill(null),
        }],
        xIsNext:true,
        stepNumber:0
      }
    }
    handleClick(i){
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if(calculateWinner(squares)||squares[i]){
        return;
      }
      squares[i] = this.state.xIsNext?'x':'o';
      this.setState({
        history:history.concat([{
          squares:squares
        }]),
        stepNumber:history.length,
       xIsNext:!this.state.xIsNext
     });
    }
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
      let status;
      if(winner){
        status = 'Winner----'+ winner;
      }else{
        status = 'Next player----' + (this.state.xIsNext?'x':'o');
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares = {current.squares}
              onClick = {(i) => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }