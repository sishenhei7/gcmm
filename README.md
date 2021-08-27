# gcmm

Git config manager that can help you easy and fast set different git configs.

## usage

```bash
demo@demo:~$ gcmm ls

demo@demo:~$ gcmm add klook yangzhou zhou.yang@klook.com
Add klook: yangzhou zhou.yang@klook.com success!

demo@demo:~$ gcmm add github sishenhei7 1417145026@qq.com
Add github: sishenhei7 1417145026@qq.com success!

demo@demo:~$ gcmm ls
klook:   yangzhou ---- zhou.yang@klook.com
github:  sishenhei7 -- 1417145026@qq.com

demo@demo:~$ gcmm use klook
Git config has been set to yangzhou zhou.yang@klook.com

demo@demo:~$ gcmm ls
* klook:   yangzhou ---- zhou.yang@klook.com
  github:  sishenhei7 -- 1417145026@qq.com

demo@demo:~$ gcmm use github
Git config has been set to sishenhei7 1417145026@qq.com

demo@demo:~$ gcmm ls
  klook:   yangzhou ---- zhou.yang@klook.com
* github:  sishenhei7 -- 1417145026@qq.com

demo@demo:~$ gcmm remove klook
Delete klook success!

demo@demo:~$ gcmm ls
* github:  sishenhei7 -- 1417145026@qq.com
```

## tips

You can set diefferent git configs locally on different projects to get rid of switching git configs too frequently.

## Changelog

[Changelog](./CHANGELOG.md)

## 其它

编写此库的时候学到的东西：

1.关于```fs.writefile```的原子性。nodejs 的 fs.writeFile 只是一个简单的上层封装，这个方法不是原子的（如果正在写入文件的时候断电了或发生了其它异常，写入会终止，最终写入的文件是一个 broken 文件。）一般这种问题的解决方案是，首先写入一个临时文件，当写入完成之后，把要写入的文件删除，然后把临时文件重命名为要写入的文件，最后删除临时文件。[write-file-atomic](https://www.npmjs.com/package/write-file-atomic)库就提供了这种原子性的写入文件的方法。另外```fs.writefile```会覆盖之前的内容，```fs.appendFile```只是在文件内容后面追加，但是它有两个缺点，第一个是它不是原子的；第二个是每次追加的时候它都会创建一个文件标识符，当同时进行多次追加的时候，会创建很多文件标识符然后报错，这个时候更好的解决方案是使用 nodejs 流来复用文件标识符，进行多次追加。

2.获取 nodejs home 路径的方法：

```js
// old
function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

// new
const homedir = require('os').homedir()
```

3.解析 ini 文件的库：[ini](https://www.npmjs.com/package/ini)
