// ==UserScript==
// @name         Personal Trigger Keyword Filter
// @namespace    PersonalSafetyTools
// @version      4.1
// @description  Personal content filter with aggressive scanning and SPA support
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    'use strict';


    const defaultKeywords = [
        "example trigger"
    ];


    let keywords = GM_getValue("keywords", defaultKeywords);

    let warningVisible = false;

    let ignoredUntil = 0;

    let lastUrl = location.href;

    let scanTimeout;



    function saveKeywords() {

        GM_setValue(
            "keywords",
            keywords
        );

    }




    function getPageContent() {


        let content = "";


        if (document.body) {

            content += document.body.innerText;

        }



        document.querySelectorAll("*")
        .forEach(el => {

            content += " " + (el.alt || "");

            content += " " + (el.title || "");

            content += " " + (
                el.getAttribute("aria-label") || ""
            );

        });



        return content.toLowerCase();


    }







    function findTriggeredKeywords() {


        const text = getPageContent();



        return keywords.filter(word => {


            if (!word.trim())
                return false;



            try {


                if (
                    word.startsWith("/") &&
                    word.lastIndexOf("/") > 0
                ) {


                    let pattern =
                    word.slice(
                        1,
                        word.lastIndexOf("/")
                    );


                    return new RegExp(
                        pattern,
                        "i"
                    ).test(text);


                }



                return text.includes(
                    word.toLowerCase()
                );



            } catch {


                return text.includes(
                    word.toLowerCase()
                );


            }


        });


    }







    function blurPage() {


        document.querySelectorAll("body > *")
        .forEach(el => {


            if (
                el.id !== "ptsd-warning" &&
                el.id !== "filter-settings"
            ) {

                el.style.filter =
                "blur(12px)";

            }


        });


    }





    function unblurPage() {


        document.querySelectorAll("body > *")
        .forEach(el => {

            el.style.filter = "";

        });


    }







    function createWarning() {


        if (warningVisible)
            return;



        const detected =
        findTriggeredKeywords();



        if (!detected.length)
            return;



        warningVisible = true;



        blurPage();



        const box =
        document.createElement("div");


        box.id =
        "ptsd-warning";



        box.innerHTML = `

        <div style="
        position:fixed;
        inset:0;
        display:flex;
        justify-content:center;
        align-items:center;
        z-index:999999;
        font-family:Arial;
        ">


        <div style="
        background:#222;
        color:white;
        padding:30px;
        border-radius:15px;
        width:430px;
        text-align:center;
        box-shadow:0 0 30px black;
        ">


        <h2>
        🌸 Content Warning
        </h2>


        <p>
        This page contains blocked content.
        </p>


        <p>
        Blocked keywords:
        <br><br>

        <strong>
        ${detected.join(", ")}
        </strong>

        </p>


        <button id="showPage">
        View Anyway
        </button>


        <button id="openSettings">
        Settings
        </button>


        </div>

        </div>

        `;



        document.body.appendChild(box);





        document.getElementById("showPage")
        .onclick = () => {


            unblurPage();


            box.remove();


            warningVisible = false;


            // Ignore current page for 5 minutes
            ignoredUntil =
            Date.now() + 300000;


        };






        document.getElementById("openSettings")
        .onclick = openSettings;


    }









    function scan() {


        if (
            Date.now() < ignoredUntil
        ) {

            return;

        }



        if (
            !warningVisible &&
            findTriggeredKeywords().length
        ) {


            createWarning();


        }


    }








    function openSettings() {


        const panel =
        document.createElement("div");


        panel.id =
        "filter-settings";



        panel.innerHTML = `

        <div style="
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.7);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:1000000;
        font-family:Arial;
        ">


        <div style="
        background:white;
        padding:25px;
        border-radius:15px;
        width:420px;
        ">


        <h2>
        Keyword Filter Settings
        </h2>


        <textarea id="keywordBox"
        style="
        width:100%;
        height:200px;
        ">${keywords.join("\n")}</textarea>


        <br><br>


        <button id="saveKeywords">
        Save
        </button>


        <button id="closeSettings">
        Close
        </button>


        </div>

        </div>

        `;



        document.body.appendChild(panel);





        document.getElementById("saveKeywords")
        .onclick = () => {


            keywords =
            document.getElementById("keywordBox")
            .value
            .split("\n")
            .map(x => x.trim())
            .filter(Boolean);



            saveKeywords();


            alert("Saved 💜");


        };





        document.getElementById("closeSettings")
        .onclick = () => {

            panel.remove();

        };


    }








    function addButton() {


        const button =
        document.createElement("button");



        button.innerHTML =
        "⚙ Filter";



        button.style.position =
        "fixed";


        button.style.bottom =
        "20px";


        button.style.right =
        "20px";


        button.style.zIndex =
        "999998";


        button.style.padding =
        "10px";


        button.style.borderRadius =
        "10px";



        button.onclick =
        openSettings;



        document.body.appendChild(button);


    }








    function startObserver() {


        const observer =
        new MutationObserver(() => {


            clearTimeout(scanTimeout);


            scanTimeout =
            setTimeout(
                scan,
                500
            );


        });



        observer.observe(
            document.documentElement,
            {
                childList:true,
                subtree:true
            }
        );


    }







    function watchNavigation() {


        setInterval(() => {


            if (
                location.href !== lastUrl
            ) {


                lastUrl =
                location.href;



                ignoredUntil = 0;



                warningVisible = false;



                setTimeout(
                    scan,
                    1000
                );


            }


        }, 500);


    }








    document.addEventListener(
        "click",
        () => {


            setTimeout(
                scan,
                700
            );


        }
    );







    addButton();


    scan();


    startObserver();


    watchNavigation();




    // Backup scan
    setInterval(
        scan,
        3000
    );



})();