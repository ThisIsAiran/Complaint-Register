const ArrowArray = document.querySelectorAll(".Arrow")
const ComplaintsBox = document.querySelectorAll(".complaints")
// console.log(ComplaintsBox);
//console.log(ArrowArray)
ArrowArray.forEach((Arrow)=>{
	Arrow.addEventListener("click",()=>{
	 Arrow.parentNode.parentNode.children[0].classList.toggle("complaintsAdd");
	 Arrow.classList.toggle("fa-angle-up");
	 Arrow.classList.toggle("fa-angle-down");
	});
})

