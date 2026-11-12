# Capsyn 介绍站

Capsyn（Windows 桌面灵动岛）的项目介绍 / 落地页。
纯静态：HTML + CSS + JavaScript，**没有任何构建步骤、没有第三方依赖、没有外部字体请求**。

- 应用源码：<https://github.com/SQW-Rool/Capsyn>
- 线上地址（GitHub Pages）：<https://sqw-rool.github.io/Capsyn-web/>

## 目录结构

```
Capsyn-web/
├── index.html              # 单页：Hero / 功能 / 截图 / 上手 / 下载 / 技术
├── assets/
│   ├── css/style.css       # 全部样式（含响应式、动效、暗色主题）
│   ├── js/main.js          # 导航、实时演示岛、截图筛选、滚动出现动画
│   ├── img/*.png           # 真实运行截图（已按内容裁掉空白画布）
│   └── favicon.svg
├── .nojekyll               # 让 GitHub Pages 跳过 Jekyll 处理
└── README.md
```

## 本地预览

任选一种（`file://` 直接双击也能看，但建议起个本地服务器，行为最接近线上）：

```powershell
# 有 Python
python -m http.server 8080

# 有 Node
npx serve .

# 只有 PowerShell（H 盘/任意目录均可）
powershell -c "$l=[System.Net.HttpListener]::new();$l.Prefixes.Add('http://localhost:8080/');$l.Start();while(1){$c=$l.GetContext();$p='.'+$c.Request.Url.AbsolutePath.Replace('/','\');if(Test-Path $p -PathType Container){$p=Join-Path $p 'index.html'};$b=[IO.File]::ReadAllBytes($p);$c.Response.OutputStream.Write($b,0,$b.Length);$c.Response.Close()}"
```

然后打开 <http://localhost:8080>。

## 怎么更新线上内容

```powershell
# 改完文件后
git add -A
git commit -m "更新：xxx"
git push origin main
```

推上去后 GitHub Pages 会自动重新发布（约 30–60 秒）。

## 换成自己的域名

1. 在仓库 Settings → Pages → Custom domain 填入域名；
2. 在 DNS 里加一条 `CNAME` 记录指向 `sqw-rool.github.io`；
3. 勾选 Enforce HTTPS。

> 也可以在仓库根目录放一个 `CNAME` 文件（内容就是你的域名），效果一样。

## 想换截图

截图来自应用运行时的窗口截图，裁掉了四周的空画布。重新截的话按这个约定放：

| 文件名 | 内容 |
| --- | --- |
| `metrics.png` | 指标看板（CPU / 内存 / 网络） |
| `stopwatch.png` | 正计时（记一圈） |
| `countdown.png` | 倒计时（环形进度） |
| `alarm.png` | 闹钟视图 |
| `settings.png` | 设置页铃声板块 |
| `alert.png` | 到点提醒面板 |
| `drop-zone.png` | 拖拽解压的虚线落点区 |
| `drop-result.png` | 解压完成结果 |
| `pill-dual.png` | 收起态：胶囊 + 独立小圆岛 |

`index.html` 里的 `<img>` 都写了 `width` / `height`，换图后记得同步这两个值（避免布局跳动）。

## 设计要点

- 深色底 + 冷色渐变光晕 + 细网格 + 噪点，纯 CSS 绘制，不占图片体积；
- Hero 右侧的「岛」是 CSS/JS 实时演示：时钟真的在走、悬停会展开看板、每 4 秒切换单/双计时状态；
- 数字用等宽字体（Cascadia Code → 系统 mono 回退），和应用内一致；
- 全站支持 `prefers-reduced-motion`：开了「减少动态效果」就不轮播、不做入场动画；
- 响应式：1080 / 860 / 640 三个断点，移动端导航折叠成抽屉。
