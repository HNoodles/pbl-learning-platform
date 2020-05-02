# pbl-learning-platform
A course project for Advanced Web Technologies at FDU. 

*希望大嘎顺手学一下Markdown，基础使用超简单*

*可用资源包括但不限于[菜鸟教程](https://www.runoob.com/markdown/md-tutorial.html)*

***推荐可以使用[Typora](https://typora.io/)进行编写，工具干净好用跨平台***



## 按页面分类的功能、UI设计

> 设置一个侧边栏或者导航栏，可以快速导向各种界面，没有权限的用户不应当出现该页面的标签。

### 登录页面

1. 学生和教师以及管理员的登录功能，对于基本的输入正确性检测（是否有输入，正确性校验，**密码不应当明文传输**）
   
3. 登录成功后跳转应当去往不同页面
   
    - 学生 + 教师：课程页面
    
    - 管理员：用户管理页面
    
4. 登录页面要有通向注册页面的路由

### 注册页面

1. 学生的注册功能，对于基本的输入正确性检测
   
   - 学号，必须，合法性（长度是否满足、只能输入数字）、重复性校验（是否和数据库中已经有的用户重复）
   - 姓名，必须，合法性（别过长，可以限定不要有特殊字符）
   - 性别，单选框（男、女、不愿透露）
   - 密码，必须，合法性（数字、字母、特殊字符（_、*）组合，八位及以上）
   - 确认密码，必须，合法性（和密码输入一致）
   - 头像可以不用这个时候上传，可以直接给个默认的，到后面想完善的再完善好了
   - 个人简介也是，后面再补充，这样比较友好，否则注册过程太冗长
   
2. 注册成功后有两种方案，一种是直接默认登录成功，跳转到个人信息界面，另一种是需要再次登录，跳转到登录界面

   > 具体实现的时候可以自由选择哪种方式，需要跳往的页面与登录后跳转的页面一致即可

### 个人信息管理、展示页面

1. 对个人信息的展示，不同身份的用户展示的形式应该是不同的

    - 简单来看，教师和学生的个人信息展示应该是一样的，包括：
      - 头像
      - 姓名
      - 学工号
      - 性别
      - 个人简介
      - 我修/教的课（可以选择仅自己可见，功能上比较人性化，但是管理员应该啥都能看到）
    
    - 管理员的个人信息展示：展示内容和学生、教师相同，只是少了我修/教的课
    
2. 对个人信息的修改

    - 学工号不允许修改
    - 可以解锁table变成input框以便修改数据，同时出现提交和取消两个按钮，点击提交进行校验，而后修改
    - 修改密码需要**在修改状态下**显示一个特别的按键，可以有单独的弹窗，需要输入老密码、新密码、确认密码，需要校验

3. 对个人信息的删除

   - 实现了修改也就实现了删除。
   
4. 上传头像功能（是否压缩，作为附加功能）

    - 头像可以有单独的上传新头像按键，也可以有恢复默认头像按键

      可以配合个人信息修改，**点击解锁修改了之后才显示这两个按键**。


### 课程管理页面

1. 课程为一个个card排列，展示内容为课程名称、课程简介、教师、学分、学时、以某种形式展示课程是否已经发布（例如有一个蓝色的badge的是已发布，灰色的是未发布，红色的是已删除）

    - 教师看到的分为`我教的课`、`其它课程`
      - 我教的课分为未发布和已发布和已删除，各自有两个按键
        - 未发布课程有修改和发布按键，修改实现可以参考个人信息修改
        - 已发布课程有禁用的修改按键和可用的删除按键（后台把状态改为已删除，学生无法看到所有相关信息，教师仍旧可以看到这个项）
        - 已删除课程有禁用的修改按键和可用的恢复按键（恢复后状态变为已发布，学生可以正常查看）
        - 要有添加新课程的按键，默认填充教师为本人
      - 其它课程有禁用的修改和删除按键，不能进入其它课程的项目管理页面
        - 未发布课程不可见

    - 学生看到的分为`我修的课`、`其它课程`
      - 其它课程显示加入按键，不能进入其它课程的项目管理页面

      - 未发布课程不可见

    - 管理员所有课程，包括未发布，都能看，且能够进入项目管理页面

2. 可以通过点击具体课程名称跳转到具体课程的项目管理界面，换言之，课程名称为一个链接


### 项目管理页面（下辖多个页面）

#### 项目展示页面

1. 展示某课程所有项目（学生可以加入，后查看详情；老师可以查看、添加、删除项目）

    - 项目以卡片形式展示，不同用户有不同按钮，不展示已删除状态的项目

      - 学生：未加入的项目有加入按钮，已经加入的项目可以查看详情，查看讨论版，查看文件管理空间，不可以退出项目

      - 老师：所有项目均有查看详情、查看讨论版、查看文件管理空间、删除按钮，（删除之后修改项目状态为已删除，不可恢复）

        - 还有一个添加项目的按钮（可以作为一个大的加号card的形式），点击以后弹出创建项目的对话框，包含
    - 项目名称
          - 所属课程（仅展示，不可修改）
          - 项目简介
          - 评分规则
            - 教师评分占比，必选，仅展示占比，默认为100%，如果勾选了自评和互评，就等于100%-自评占比-互评占比
              - 后端获取教师占比之后，拆分为两半，给到任务完成占比和讨论版发言占比
            - 是否允许自评，是的话，填充占比
            - 是否允许互评，是的话，填充占比
            - 校验：最多全选，自评互评之和不能大于100%

#### 项目详情页面

可以分为四个标签页

- 任务页面
- 成员页面
- 讨论版页面
- 文件管理空间页面

##### 任务页面

1. 默认以Card形式展示所有任务，内容包括：

    - 任务名称
    - 开始日期、截至日期
    - 重要程度
    - 负责人（点击应当能跳转到个人信息展示页面）
    - 完成情况（可以用badge表示），负责人可以选择已经完成任务
    - 分配任务下拉搜索框、添加任务、删除任务按键、督促完成任务按键（老师、组长有）
    - 所有内容老师、组长可修改

2. 任务页面可以点击某个开关转换为甘特图形式展示

    - 每一行为一个任务，左侧展示任务名和负责人，右侧表示项目时间跨度
    - 老师、组长可修改任务内容，可添加、删除任务、督促任务
    - 甘特图中任务颜色可以按照重要程度变化

##### 成员页面

1. 包含：

    - 成员学号
    - 姓名（点击应当能跳转到个人信息展示页面）
    - 评分（默认锁定，根据项目的自评、互评是否在数据库中占比不为null来解锁，可以一次性填完后提交）

##### 讨论版页面

1. 按最近回复时间从近到远显示每个帖子，每个帖子可以展示最新的两条回复（简单起见，也可以不展示）
   - 帖子包含主题、发起人、内容、时间
   - 帖子有回复按钮，点击可以展示出一个文本框进行回复
   - 发起人能够删除自己的帖子
2. 点击一个按键可以展开某个帖子，按照从远到近的时间查看所有回复
   - 回复包含回复人、内容、时间
   - 回复要能被回复，简单起见，可以点击回复以后直接在弹出的文本框里添加“回复某某：”为开头
   - 回复人能删除自己的回复

##### 文件管理空间页面

1. 有上传按键，点击应当弹出对话框，填充文件名、上传文件
2. 文件一行行展示，有文件名、上传人、下载按钮
3. 上传人和老师和管理员可以删除文件

### 评分页面

1. 教师可以从下拉框选择自己教的课程、选择课程中的项目，对其中参与的学生进行评分。
   
   - 展示一个表格，每一行为一个学生，每一列为参与评分的模块，包括：
     - 任务完成数
     - 任务完成得分，按比例，分数=100*（学生完成数 / 最高单人完成数）
     - 讨论版发言数
     - 讨论版得分，按比例，分数=100*（学生发言数 / 最高单人发言数）
     - 自评分
     - 互评分
     - 教师加分（输入）
     - 总分（生成）
     
   - 要有一个提交的按键，提交评分后不再变动
   - Better：表格应当能按照每列分别排序，应该有组件能实现该功能
   
2. 学生可以从下拉框中选择自己学的课程、选择课程中的项目，查看

   - 该项目中每个模块的分数占比，可以在表头中、该模块名边上括号标注（占XX%）
   - 自己在该项目中的得分，包括：
     - 任务完成数
     - 任务完成得分，按比例，分数=100*（学生完成数 / 最高单人完成数）
     - 讨论版发言数
     - 讨论版得分，按比例，分数=100*（学生发言数 / 最高单人发言数）
     - 自评分
     - 互评分
     - 教师加分（输入）
     - 总分（生成）
   - 如果评分未提交，学生可以预览预估自己的分数；如果已提交，学生查看最终得分；学生要被告知当前分数是否已经确定

3. 学生可以和同学间进行互评、自评。互评、自评在项目人员页面可以完成（如有）。


### 用户管理页面

1. 管理员可以看到这个页面
2. 显示所有用户列表，包括
   - 学工号
   - 姓名（点击可以跳到个人信息展示页面，那个页面中管理员有权限修改所有数据）
   - 用户身份
   - 解锁修改的按钮，但不能修改用户身份
   - 删除用户的按钮
     - 删除之后改变用户的状态为已删除，之后该用户无法登陆，但该用户的记录仍旧存在，只是点击该用户姓名进入详情页后显示用户已删除的默认空信息
     - 被删除用户不参与评分
3. 可以添加用户，填充
   - 学工号
   - 姓名
   - 性别（三选一）
   - 用户身份（三选一）
   - 密码
   - 确认密码




## 数据库设计
- user (<u>u_id</u>, type, u_name, gender, password, description, image)  

  - image为布尔值，true表示已经上传头像，名称为u_id.jpg；false表示使用默认头像
- course (<u>c_id</u>, t_id, c_name, point, class_time, description, status)  

  - status: 未发布，已发布，已删除
  - t_id是课程教师，reference u_id@user, type=teacher
- project (<u>p_id</u>, c_id, p_name, description, grading_status, task_grade_ratio, discussion_grade_ratio, self_grade_ratio, mutual_grade_ratio)  

  - grading_status: 未评分，已评分
  - c_id是所属的课程，reference c_id@course
  - task_grade_ratio, discussion_grade_ratio 各为前端教师评分占比的一半
  - self_grade_ratio, mutual_grade_ratio 可以为null，表示不开启自评、互评，不为null则表示评分占比
- assignment (<u>a_id</u>, p_id, s_id, a_name, a_description, importance, a_start_date, a_end_date, a_point, a_status, urge)  

  - s_id是被分配的同学，reference u_id@user, type=student
  - p_id是所属于的项目，reference p_id@project
  - urge是布尔值，表示目前该任务有没有被催促，默认false，学生进入项目详情页面时会根据该值弹出提示的催促尽快完成信息
- student_course (<u>s_id</u>, <u>c_id</u>)  

  - s_id是被分配的同学，reference u_id@user, type=student
- student_project (<u>s_id</u>, <u>p_id</u>, is_group_leader, task_grade, discussion_grade, self_grade, mutual_grade, teacher_grade)  

  - is_group_leader表示是否为leader，还是只是组员
  - s_id是同学，reference u_id@user, type=student
  - p_id是项目，reference p_id@project
  - task_grade, discussion_grade, self_grade, mutual_grade, teacher_grade
    - 默认为0，取数据时要考虑project表中是否评分状态为已评分，如果未评分需要自行计算数据，如果已评分则写入该表，通过该表查询
    - 总分需要去project表中查询占比，然后与这里的分数做加权平均得到
- discussion (<u>d_id</u>, p_id, u_id, content, time)
- p_id是所属于的项目，reference p_id@project
  - u_id是老师或者学生，reference u_id@user, type=student || teacher
- reply (<u>r_id</u>, d_id, u_id, content, time)
  - 讨论版数据（每个project有一个讨论版，讨论版可以有好多帖子，每个帖子包含发帖人、主题、内容、时间戳；每个帖子有好多回复，每个回复有回复人、时间戳）
  - u_id是老师或者学生，reference u_id@user, type=student || teacher
  - d_id是某个帖子的id，reference d_id@discussion
- file (<u>f_id</u>, <u>p_id</u>, u_id, f_name, description, file_URL)

  - f_name保留原有上传时的文件名
  - fileURL根据f_id和p_id生成
  - p_id是项目，reference p_id@project
  - u_id是老师或者学生，reference u_id@user, type=student || teacher
- evaluation (<u>p_id</u>, <u>active\_s_id</u>, <u>passive\_s_id</u>, grade)

  - p_id是项目，reference p_id@project
  - 两个s_id是同学，reference u_id@user, type=student
  - 如果两个s_id相同，表明是自评，不同则是互评
  - 如果来查询自评、互评成绩时还没有评分过，后端应该手动返回未评分而非null
  - 可以通过后端返回count和sum的形式完成要求，count是0前端就明白还没有人评分
  




## 按页面分类的接口设计（请求URL、输入、输出）

> 待完善，或许URL前面能写/api/url，例如/api/login，这样可以避免跟真实页面的请求路径冲突

### 登录页面

### 注册页面

### 个人信息管理、展示页面

### 课程管理页面

### 项目管理页面

#### 项目展示页面

#### 项目详情页面

##### 任务页面

##### 成员页面

##### 讨论版页面

##### 文件管理空间页面

### 评分页面

### 用户管理页面