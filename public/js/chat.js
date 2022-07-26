$(document).ready(function(){

   const chaticon=document.querySelector(".chaticon");
   const chat=document.querySelector(".chat");
   const msgbox=document.querySelector(".msgbox");
   const chatform=document.querySelector(".chatform");
   const chatinput=document.querySelector(".chatinput");
   var socket;
   chaticon.addEventListener("click",async function(){
     // socket.on("connect",()=>{
     //
     // })
     socket=await io();

     const val=socket.on("connect",()=>{
       $(".chat").fadeIn("fast",
       function() {
           $(".chatinput").focus();
       }
      );
      chaticon.classList.add("disabled");
     });

     // if(!val.connected) window.location.pathname="/";

    // if(val.connected){
    //   $(".chat").fadeIn("fast",
    //   function() {
    //       $(".chatinput").focus();
    //   }
    //  );
    // }

    // socket.on("redirect",path=>{
    //   window.location.pathname=path;
    // })

    socket.on("flashmsg",msg=>{
      const div=document.createElement("div");
      div.classList.add("flashmsg");
      div.innerHTML=msg;
      msgbox.appendChild(div);
    })

    socket.on("msg",msg=>{
      outputmsg(msg);
      msgbox.scrollTop=msgbox.scrollHeight;
    });

    // socket.on('redirect', function(destination) {
    //   console.log("undone");
    // window.location.href = destination;
    // });

  });

  chatform.addEventListener("submit",e=>{
    e.preventDefault();
    const msg=e.target.elements.msg;
    const div=document.createElement("div");
    div.classList.add("mymessage");
    div.innerHTML=`<p>${msg.value}</p>
    <span class="nav-link profile">
      <img class="pf pfpic" src="https://www.gravatar.com/avatar/email" alt="pf">
      <!-- <i class="fa-solid fa-user"></i> -->
    </span>`;
    msgbox.appendChild(div);
    msgbox.scrollTop=msgbox.scrollHeight;

     socket.emit("chatmsg",msg.value);

     msg.value="";
     msg.focus();
     // console.log(socket.request.session);
  })


  const xmark=document.querySelector(".chatxmark");
  xmark.addEventListener("click",function handler(){
    msgbox.innerHTML='';
    chatinput.value='';
    socket.disconnect(true);
    chat.style.display="none";
    chaticon.classList.remove("disabled");
  });


  function outputmsg(msg){
    const div=document.createElement("div");
    div.classList.add("message");
    div.innerHTML=`<span class="nav-link profile">
      <img class="pf pfpic" src="https://www.gravatar.com/avatar/email" alt="pf">
      <!-- <i class="fa-solid fa-user"></i> -->
    </span>
    <p><b>${msg.username}</b> : ${msg.msg}</p>`;
    msgbox.appendChild(div);
  }


});
