async function start(){

    const response=await fetch("config.json");

    const config=await response.json();

    document.title=config.title;

    document.getElementById("title").innerHTML=config.title;

    document.getElementById("status").innerHTML=config.loadingText;

    const url=
        "https://wa.me/"
        +config.phone
        +"?text="
        +encodeURIComponent(config.message);

    setTimeout(()=>{

        window.location.href=url;

    },config.delay);

}

start();
