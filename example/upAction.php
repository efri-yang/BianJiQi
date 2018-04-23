<?php
	require_once('upClass.php');

	//获取日期
	$date=date('Y-m-d');

	//设定上传路径
	$path="./uploads/".$date."/";


	//设定允许的文件类型
	$allowtype=array(
		'bmp',
		'gif',
		'jpg',
		'jpeg',
		'png',
		);

	$upfile = new UploadFiles(array('filepath'=>$path,'allowtype'=>$allowtype,'israndfile'=>true,'maxsize'=>'10000000'));
	if($upfile ->uploadeFile('myfiles')){ 
		//此处myfiles对应前面的  editor.customConfig.uploadFileName = 'myfiles[]'
		 //$arrfile = $upfile ->getnewFile();
		 //$arrfile = $upfile ->getFileInfo();
		 $arrfile = $upfile -> getWangEditor3();
		 $arrfile = json_encode($arrfile);
		 //返回json数据给前端
		 echo $arrfile;
	}else{
		 $err = $upfile ->gteerror();
		 if(is_array($err)){
			 foreach($err as $v1){
			  echo $v1,"<br/>";
	 		}
		 }else{
		 echo $err;
		 }
	 	//var_dump($err);
	}
	//var_dump($upfile);