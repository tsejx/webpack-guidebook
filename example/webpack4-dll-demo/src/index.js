import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    let list = [];
    for (let i = 0; i < 10; i++) {
      list.push(<li key={i}>{i}</li>);
    }

    return (
      <div className="container">
        <ul>{list}</ul>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
