const follow=document.querySelector(".follow");
const user=document.querySelector(".username");

const url="http://localhost:3000"

if(follow){
  if(follow.children[0].innerHTML=="Follow") {
    follow.classList.add("btn-primary");
    follow.children[1].classList.add("fa-user-plus");
  }
  else{
    follow.classList.add("btn-danger");
    follow.children[1].classList.add("fa-user-xmark");
  }

  follow.addEventListener("click",function(){
    const val=follow.children[0].innerHTML;
    const username=user.innerHTML;
    fetch("/f/follow"+"/"+username)
    .then((res)=>{
      if(res.status==200)
      {
        if(val=="Follow") {
          follow.children[0].innerHTML="UnFollow";
          follow.classList.remove("btn-primary");
          follow.children[1].classList.remove("fa-user-plus");
          follow.classList.add("btn-danger");
          follow.children[1].classList.add("fa-user-xmark");
        }
        else{
          follow.children[0].innerHTML="Follow";
          follow.classList.remove("btn-danger");
          follow.children[1].classList.remove("fa-user-xmark");
          follow.classList.add("btn-primary");
          follow.children[1].classList.add("fa-user-plus");
        }
      }
    })
    .catch((err)=>console.log(err));
  })
}

const searchicon=document.querySelector(".searchicon");
const search=document.querySelector(".search");
const xmark=document.querySelector(".xmark");
const input=document.querySelector(".searchinput");
const userTemplate=document.querySelector("[data-user-template]");
var container=document.querySelector(".card-container");

if(searchicon){
  searchicon.addEventListener("click",function(){
    // document.getElementById('searchinput').setAttribute('autofocus', true);
    // document.getElementById("searchinput").focus();
    // $(".searchicon").focus();
    // search.style.display="block";
    $(".search").fadeIn("fast",
    function() {
        $("#searchinput").focus();
    }
);
  })
  xmark.addEventListener("click",function(){
    input.value="";
    search.style.display="none";
    container.innerHTML="";
    document.querySelector(".resultcard").innerHTML="";
  })
}


input.addEventListener("input",function(){
  container.innerHTML="";
  document.querySelector(".resultcard").innerHTML="";
  // console.log(input.value);
  // console.log("ok",JSON.stringify(input.value));
  fetch("/f/search",{
  method: 'POST', // or 'PUT'
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({input:input.value})
})
  .then(response=>response.json())
  .then(data => {
  const num=data.posts.length+data.users.length;
  document.querySelector(".resultcard").innerHTML="<div class='resultbody'>"+"Search Results("+num+" items found)"+"</div>";
  data.users.forEach(user=>{
    const card=userTemplate.content.cloneNode(true).children[0];
    card.setAttribute("href","/"+user.username);
    const img=card.querySelector(".pfpic");
    img.setAttribute("src","https://www.gravatar.com/avatar/"+user.email);
    const name=card.querySelector(".font2");
    name.innerHTML=user.username;
    container.append(card);
  })
  data.posts.forEach(post=>{
    const card=userTemplate.content.cloneNode(true).children[0];
    card.setAttribute("href","/post/"+post._id);
    const img=card.querySelector(".pfpic");
    img.setAttribute("src","https://www.gravatar.com/avatar/"+post.user);
    const name=card.querySelector(".font2");

    name.innerHTML="<b>"+post.postTitle+"</b>"+" by "+post.user+" on "+post.date;
    container.append(card);
  })
 })
.catch((error) => {
  console.error('Error:', error);
});
// container.splice(0,container.length);
})
