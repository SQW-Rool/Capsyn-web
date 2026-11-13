# Capsyn 介绍站（v2）

Capsyn（Windows 桌面灵动岛）的项目介绍 / 落地页。
纯静态：HTML + CSS + JavaScript，**没有构建步骤、没有第三方依赖、没有外部字体请求**。

- 应用源码：<https://github.com/SQW-Rool/Capsyn>
- 线上地址（GitHub Pages）：<https://sqw-rool.github.io/Capsyn-web/>

## 页面结构（单页）

| 区块 | 内容 |
|---|---|
| `#top` Hero | 标题 + 主 CTA（Latest v5.1.0 / 预发行 v6.0.0）+ **CSS/真实封面做的交互演示岛**（可悬停 / 点击，自动展开收起） |
| 数据条 | 0 运行时 / 7 功能板块 / 82 MB / WinUI 3 |
| `#features` 功能 | 6 张卡：灵动胶囊、时间工具、资源监测、拖拽解压、铃声与提醒、音乐岛 |
| `#music` 音乐岛 | 展开态截图 + 两枚胶囊截图（音乐 / 计时）+ 能力清单 + 实测说明 |
| `#gallery` 截图 | 8 张真实运行截图，可按「全部 / 时间与提醒 / 监测与音乐 / 拖拽解压」筛选 |
| `#versions` 版本 | v4.0.0 / v5.0.0 / v5.1.0(Latest) / v6.0.0(预发行) 能力对照表 |
| `#download` 下载 | 三张下载卡（Latest 5.1.0 / 稳定 5.0.0 / 预发行 6.0.0）+ SHA-256、体积、设置路径等提示 |
| `#start` 上手 | 三步：解压 → 运行 → 移到胶囊上 |
| `#faq` 常见问题 | 运行时 / SmartScreen / 隐私 / 播放器兼容 / 解压格式 / 卸载与升级 / 多显示器 / 为什么没有托盘 |
| `#roadmap` 路线图 | 明确列出「计划中 / 未开始 / 已放弃」的能力，不冒充已完成 |
| `#tech` 技术 | WinUI 3、Composition、逐帧窗口区域、零第三方依赖 |
| Footer | Release / 源码 / 反馈 / FAQ / 下载 |

## 目录结构

```
Capsyn-web/
├── index.html              # 单页
├── assets/
│   ├── css/style.css       # 全部样式（设计 token / 响应式 / 动效 / 减少动态偏好）
│   ├── js/main.js          # 导航、滚动高亮、演示岛、截图筛选、滚动出现、FAQ 单开
│   ├── img/*.png           # 真实运行截图 + 演示用封面（均从 Capsyn 实机截取）
│   └── favicon.svg
├── .nojekyll
└── README.md
```

## 本地预览

```powershell
cd E:\Capsyn-web
python -m http.server 8080
# 打开 http://localhost:8080/
```

## 截图 / 自动化验证

页面支持 `?static=1`：跳过所有滚动出现与演示动画，直接落位（给截图脚本 / 打印用）。

```powershell
# 用 Edge headless 截图（桌面 + 移动端）
& 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' `
  --headless=new --disable-gpu --hide-scrollbars `
  --window-size=1440,8000 --virtual-time-budget=6000 `
  --screenshot=home-full.png "file:///E:/Capsyn-web/index.html?static=1"
```

注意：Edge headless 在 Windows 上会把窗口宽度钳到约 500px，移动端请用 `--window-size=500,...` 验证（CSS 断点 760 / 1080 会生效）。

## 数据来源

- 版本与下载链接对齐 GitHub Release：Latest = `v5.1.0-ExtractionKernels`，预发行 = `v6.0.0-music-beta`；
- 截图由 Capsyn 实机运行后用 `PrintWindow(PW_RENDERFULLCONTENT)` 截取并按岛面裁剪；
- 功能描述与 FAQ 以仓库 `README.md` 的「已实现 / 刻意没做 / 已知问题」为准。
