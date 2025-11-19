[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/your-username/telegram-image-bed)

🚀方式
✅ 文件文件()前预览确认
###🎯核心📋种格式（）🔍搜索功能
📊 批量复制链接🗑️图片管理
-📱完美适配移动端 💎🆓 Workers KV数据存储- 🌍 无需服务器  Serverless 架构

##� 项目结构

```
telegram-image-bed/
├── src/
│   ├── index.html          # 前端页面
│   ├── index.js            # Worker 脚本（构建生成）
│   ├── script.js           # 后端逻辑
│   ├── style.css           #样文件（可选）
│   └──buildworker.js     # 构建脚本
├── wrangler.toml           #Cloudflare Workers 配置├── package.json            # 项目配置└── README.md               项目说明
```

#部署方式一：使用 GitHub + Cloudflare Pages（推荐）

#### ****，
 ``
   示例: 85490825T70bpg1Xnx2XYqtlntTyc6OocY```**2**
1. 创建一个（用于存储图片频道获取 ID：
   - 方法1：到频道，你的token  - 方法2：使用[@userinfobot](ttps://me/usernfobot) 转发频道消息获取
   ``
  示例70181
   ``**1.3 创建 KV命名空间**
1登录[Dashord](tt://dsh.coudfare.com/)2. 进入 `Workers & Pages → KV3命名空间，命名为`IMAGE_DB`
4.记录 ID   
   示例: 856a4b0473748d9963600c117cbbfd
   ```
### 2.部署到Cloudfla

**2.1 Fo项目到你的itHub**点击右上角Fork按钮，fork本项目到你的账号
**2.2 连接 Cloudflae Ps**

1.登录 [Cloudflr Dahboard](htts://dsh.loudflar.om/)
2. 进入 `Wokrs & Pgs`→`Catapplcation→Pags
3.选择 Conc t Git4. 授权并选择你 fork 的仓库5. 配置构建设置：
      Frwork ret:NoneBuld comma: pmrunbul
Build outut dictory: publc
Root directory: /   6.点击 `Save and Deploy`

**环境变量和绑定**部署完成后，进入项目设置：
1.**Sttins→Envirnmt vaib**添加：
  ```
   ELERAM= ELERAM= 频道  ```
2. **Settis→ Function → KV namspae bindings** 添加：
   ```
   Vaiablname:MGE_B   KV namespace:选择创建 IMAGE_DB   3**重新**：   - 进入`Deloyets`页面   -点击最新的 `...` →`Retyment#完成Cludflae Pag分配的
s:你的项目名.ges.ev```### 方式二：使用WrnCLI#1.安装Wranglerbasml -wrn# 2. 登录Cloudflarebaswrn lon# 3. 配置wrangler.toml编辑`wrngl.toml，填入你的配置：omlname ="tgram-imagbd"
mn = "sr/dex."
cmpatibility_date = "2024-01-01"[vars]TELEGRAM_BOT_TOKEN=你的BotToken
TELEGRAM_CHAT_=你的频道ID"

[[kv_namesce]]
bining = IMAGE_DB"
id= 你的KV命名空间ID#4. 部署bas构建np run uil#部署到Clouflarsnpmru poy
```

##📝配置说明

###必需配置

|配置项|说明|示例 ||--------|------|------|
|`TELEGRAM_BOT_TOKEN`|Telegam BoToken|`8540259082:AAH...`|
|`TELEGRAM_CHAT_ID`|Telegram频道ID|`-1002370158691`|
|`IMAGE_DB`|KV命名空间绑定|在Cloudflare控制台配置|

##可选配置
可以在``的`[vars]`部分添加：

```toml
[vars]
#管理密码（可选，用于删除图片）
ADMIN_PASSWORD="yr_psswod"

#允许的图片格式ALLOWED_TYPES= "im/peg,image/pg,image/gif,image/webp"

最大文件大小（字节）MAX_FIL_SIZ="10485760"10MB�使用上传点击：拖拽：页面：预览确认：查看预览缩略图，点击可查看大确认：点击"确认"按钮开始获取1. 选择链接（）
2.点击表格中的"复制"按钮
3 或勾选多张图片，点击"批量复制"#搜索图片

在搜索框输入文件名或标签，点击"搜索"按钮删除图片点击表格中的"删除"按钮（如配置了管理密码先验证）

##🔧开发

###本地开发`bash
#安装依赖
npminstal

# 构建项目
nprubuild
#本地测试
wgerdev`项目构建

项目使用 `sc/buid-workjs`脚本将前端和后端代码合并：bashpun uil```

生成的文件：
-``-Worker脚本- `uc/inx.html`前端页面

##自动部署推送到GitHub后，Cloudflr Pg会自动构建和部署。
##📸预览

<tals>
<summary>点击查看界面截图</summary>

###桌面端[截图占位#移动端
[截图占位]

</details>🛠️技术栈**前端**:HML5+SS3+VanillaJavaScrip**后端**:
- **存储**: Bot API (图片存储)  ()**部署**:Pages / ##⚠️注意事项
.** **-单个文件最大 20MB-BAPI上传速度受Tegram服务器限制
2.**Coudflar限制** - Woke免费版每天100,000 次请求KV免费版每天100,000次读取 - 脚本最大1MB3 **隐私安全**
-图片存储在eleam频道中  -建议设置频道为私有-可配置管密码保护删除功能License�或建议[ssue](https://github.com/your-username/telegram-image-bed/is) Star