import css from './index.css'
import src from './index.jpeg';


var img = document.createElement('img');
img.width = 300;
img.height = 200;
img.src = src;

var div = document.createElement('div');
div.className = 'container';
div.textContent = 'Hello world!';

document.body.append(img);
document.body.append(div);