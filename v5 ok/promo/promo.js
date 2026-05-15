const featureGrid =
    document.getElementById(
        "featureGrid"
    );

const techGrid =
    document.getElementById(
        "techGrid"
    );


fiturData.forEach(item => {

    featureGrid.innerHTML += `

        <div class="feature-card reveal">

            <div class="feature-icon">
                ${item.icon}
            </div>

            <h3>
                ${item.title}
            </h3>

            <p>
                ${item.desc}
            </p>

        </div>

    `;

});


teknologiData.forEach(item => {

    techGrid.innerHTML += `

        <div class="tech-card reveal">

            <div class="tech-icon">
                ${item.icon}
            </div>

            <h3>
                ${item.title}
            </h3>

            <p>
                ${item.desc}
            </p>

        </div>

    `;

});


const revealItems =
    document.querySelectorAll(
        ".reveal"
    );


function revealOnScroll() {

    revealItems.forEach(item => {

        const top =
            item.getBoundingClientRect().top;

        if (
            top < window.innerHeight - 80
        ) {

            item.style.opacity = "1";

            item.style.transform =
                "translateY(0)";

        }

    });

}


revealItems.forEach(item => {

    item.style.opacity = "0";

    item.style.transform =
        "translateY(40px)";

    item.style.transition =
        ".7s ease";

});


window.addEventListener(
    "scroll",
    revealOnScroll
);

revealOnScroll();