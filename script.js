const SUPABASE_URL = "https://clymnqkiarrpatcfuwwt.supabase.co";
const SUPABASE_KEY = "შენი Publishable key აქ";

/* YOUR HOME — მთავარი JavaScript ფაილი */

/* =========================
   MESSAGE
========================= */

function showMessage(text) {
    const message = document.getElementById("message");

    if (!message) return;

    message.textContent = text;
    message.classList.add("show");

    setTimeout(function () {
        message.classList.remove("show");
    }, 2800);
}


/* =========================
   LOGIN MODAL
========================= */

function openLogin() {
    const modal = document.getElementById("loginModal");

    if (modal) {
        modal.classList.add("active");
    }
}

function closeLogin() {
    const modal = document.getElementById("loginModal");

    if (modal) {
        modal.classList.remove("active");
    }
}


/* =========================
   ADD LISTING PAGE
========================= */

function openAddPage() {
    const homePage = document.getElementById("homePage");
    const addPage = document.getElementById("addPage");

    if (homePage) {
        homePage.classList.add("hidden");
    }

    if (addPage) {
        addPage.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function closeAddPage() {
    const homePage = document.getElementById("homePage");
    const addPage = document.getElementById("addPage");

    if (addPage) {
        addPage.classList.remove("active");
    }

    if (homePage) {
        homePage.classList.remove("hidden");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   INITIALIZATION
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const loginButton =
        document.getElementById("loginButton");

    const loginClose =
        document.getElementById("loginClose");

    const loginModal =
        document.getElementById("loginModal");

    const addButton =
        document.getElementById("addButton");

    const ctaButton =
        document.getElementById("ctaButton");

    const backButton =
        document.getElementById("backButton");

    const cancelButton =
        document.getElementById("cancelButton");


    /* LOGIN */

    if (loginButton) {
        loginButton.addEventListener("click", openLogin);
    }

    if (loginClose) {
        loginClose.addEventListener("click", closeLogin);
    }

    if (loginModal) {
        loginModal.addEventListener("click", function (event) {

            if (event.target === loginModal) {
                closeLogin();
            }

        });
    }


    /* ADD LISTING */

    if (addButton) {
        addButton.addEventListener("click", openAddPage);
    }

    if (ctaButton) {
        ctaButton.addEventListener("click", openAddPage);
    }

    if (backButton) {
        backButton.addEventListener("click", closeAddPage);
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", closeAddPage);
    }

});


/* =========================
   FUTURE DATABASE
========================= */

/*
   შემდეგ ეტაპზე აქ დავამატებთ:

   1. მომხმარებლის რეგისტრაციას
   2. მომხმარებლის შესვლას
   3. მონაცემთა ბაზასთან დაკავშირებას
   4. განცხადების შენახვას
   5. VIP / VIP+ სისტემას
   6. ონლაინ გადახდას
   7. ავტომატურ წამოწევას
   8. ადმინისტრატორის პანელს
*/
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="script.js"></script>

</body>
</html>
