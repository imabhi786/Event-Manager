function openModal(id){
	document.getElementById(id).style.display='block';
}
function closeModal(id){
	document.getElementById(id).style.display='none';
}

function extend(id,id2){
	let ele = document.getElementById(id);
	let ico = document.getElementById(id2);
	if(ele.style.display=='block'){
		ele.style.display='none';
		ico.classList.replace('fa-angle-up','fa-angle-down');
	}
	else{
		ele.style.display='block';
		ico.classList.replace('fa-angle-down','fa-angle-up');
	}
}

function navigation(){
	if(document.getElementById('navmenu').style.display=='block'){
		document.getElementById('navmenu').style.display='none';
	}
	else{
		document.getElementById('navmenu').style.display='block';
		nav=document.getElementById('navmenu');
	}
}