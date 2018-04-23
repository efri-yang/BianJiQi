<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>php图片上传某个示例</title>
	<style>
		*{
			padding: 0;
			margin: 0;
			height: auto;
		}
		a{
			text-decoration: none;
			color: white;
		}


		.common{
			width: 80%;
			/*height: auto;*/
			padding: 1%;
			background: rgba(0,0,0,0.1);
			margin: auto;
			margin-top: 2%;
			border-radius: 5px;

		}
	
		.edi_button{
			cursor: pointer;
			width: 10%;
			height: 2rem;
		}

		.wordCount{
			font-size: 1rem;
			font-family: 'Forte';

		}

		.editor{
			
			
		}

		.edi_text{
			width: 100%;
			height: 2rem;
			text-align: center;
		}
		.w-e-text{
			height: 96%;
		}
	</style>
	<script src="jquery-3.2.0.js"></script>
	<script src="release/wangEditor.min.js" ></script>
</head>
<body>
	<header>
	
	<div id="edi_art" class="common editor">
		<div id="toolbar" >
			<span class="wordCount">Word Count: &nbsp;</span><span id="edi_count" class="wordCount" style="color: red;">0</span>&nbsp;
		</div>
		<div id="text">
			
		</div>
		
	</div>

</header>

<script type="text/javascript">
    var E = window.wangEditor
    var editor  = new E('#toolbar','#text');
    // 或者 var editor = new E( document.getElementById('editor') )
    
    //debug模式开启    
    editor.customConfig.debug = true

    //editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片

    editor.customConfig.uploadImgServer = 'upAction.php'  // 上传图片到服务器

    // 将图片大小限制为 5M
	editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024

	// 限制一次最多上传 5 张图片
	editor.customConfig.uploadImgMaxLength = 5

	editor.customConfig.uploadImgParamsWithUrl = true

	editor.customConfig.uploadFileName = 'myfiles[]'

    // 自定义字体
    editor.customConfig.fontNames = [
        '宋体',
        '微软雅黑',
        'Arial',
        'Tahoma',
        'Verdana',
        '华文行楷',
        '黑体',
        '幼圆',
    ]


    // 自定义菜单配置
    /*editor.customConfig.menus = [
        'head',
        'bold',
        'italic',
        'underline'
    ] 
        
    //默认
    /*[
	    'head',  // 标题
	    'bold',  // 粗体
	    'fontSize',  // 字号
	    'fontName',  // 字体
	    'italic',  // 斜体
	    'underline',  // 下划线
	    'strikeThrough',  // 删除线
	    'foreColor',  // 文字颜色
	    'backColor',  // 背景颜色
	    'link',  // 插入链接
	    'list',  // 列表
	    'justify',  // 对齐方式
	    'quote',  // 引用
	    'emoticon',  // 表情
	    'image',  // 插入图片
	    'table',  // 表格
	    'video',  // 插入视频
	    'code',  // 插入代码
	    'undo',  // 撤销
	    'redo'  // 重复
	]
	*/
    
    //onchange  
	 editor.customConfig.onchange = function (html) {
        // html 即变化之后的内容
        //console.log(html)
        //获取字数 -- 不知道为什么 前后空格不能清除 
        var edi_art_text=editor.txt.text();
        edi_art_text=edi_art_text.replace(/\s/g,'');
        edi_art_text=$.trim(edi_art_text);
        var edi_count=edi_art_text.length;
        $('#edi_count').text(edi_count);
        
    }


    editor.create()

</script>
</body>
</html>