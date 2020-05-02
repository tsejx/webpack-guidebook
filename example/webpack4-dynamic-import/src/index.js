const button = document.createElement('button');

button.textContent = '按钮';
button.addEventListener('click', function() {
  import('./foo.js')
    .then(res => console.log(res.default()))
    .catch(err => console.log('动态加载失败：', err));
});

document.body.append(button);
