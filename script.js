/* =========================================================
   YOUR HOME — SCRIPT.JS
   ყველა JavaScript ცალკე ფაილში
========================================================= */


/* =========================
   SUPABASE
========================= */

const SUPABASE_URL =
    "https://clymnqkiarrpatcfuwwt.supabase.co";

const SUPABASE_KEY =
    "sb_publishable__CQ1qg7_KizhMzPKDaD3tA_TQq6AzsM";

const SUPABASE_SITE_URL =
    "https://yourhomens.github.io/Geohome/";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================
   GLOBAL
========================= */

let currentUser = null;
let searchType = "sale";
let selectedFiles = [];


/* =========================
   MESSAGE
========================= */

function showMessage(text) {

    const message =
        document.getElementById("message");

    if (!message) return;

    message.textContent = text;

    message.classList.add("show");

    setTimeout(function () {

        message.classList.remove("show");

    }, 3500);
}


/* =========================
   PAGES
========================= */

const homePage =
    document.getElementById("homePage");

const addPage =
    document.getElementById("addPage");


function openAddPage() {

    if (!homePage || !addPage) return;

    homePage.classList.add("hidden");

    addPage.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function closeAddPage() {

    if (!homePage || !addPage) return;

    addPage.classList.remove("active");

    homePage.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   USER
========================= */

async function loadCurrentUser() {

    try {

        const result =
            await supabaseClient.auth.getUser();

        currentUser =
            result.data.user || null;

        updateLoginButton();

    } catch (error) {

        console.error(error);

    }
}


function updateLoginButton() {

    const button =
        document.getElementById("loginButton");

    if (!button) return;

    if (currentUser) {

        const name =
            currentUser.user_metadata?.name;

        button.textContent =
            name ||
            currentUser.email ||
            "ანგარიში";

        button.style.color =
            "var(--olive-dark)";

    } else {

        button.textContent =
            "შესვლა";

        button.style.color = "";

    }
}


/* =========================
   LOGIN MODAL
========================= */

const loginModal =
    document.getElementById("loginModal");


function openLogin() {

    if (!loginModal) return;

    loginModal.classList.add("active");

    setLoginTab("login");
}


function closeLogin() {

    if (!loginModal) return;

    loginModal.classList.remove("active");
}


function setLoginTab(type) {

    document
        .querySelectorAll(".login-tab")
        .forEach(function (tab) {

            tab.classList.toggle(
                "active",
                tab.dataset.loginTab === type
            );

        });


    document
        .querySelectorAll(".login-form")
        .forEach(function (form) {

            form.classList.remove("active");

        });


    const form =
        document.getElementById(
            type === "login"
                ? "loginForm"
                : "registerForm"
        );

    if (form) {

        form.classList.add("active");

    }
}


/* =========================
   LOGIN BUTTON
========================= */

const loginButton =
    document.getElementById("loginButton");

if (loginButton) {

    loginButton.addEventListener(
        "click",
        async function () {

            if (currentUser) {

                const answer =
                    confirm(
                        "გსურთ ანგარიშიდან გამოსვლა?"
                    );

                if (answer) {

                    const result =
                        await supabaseClient.auth.signOut();

                    if (result.error) {

                        showMessage(
                            result.error.message
                        );

                        return;
                    }

                    currentUser = null;

                    updateLoginButton();

                    showMessage(
                        "ანგარიშიდან გამოხვედით."
                    );
                }

            } else {

                openLogin();

            }

        }
    );
}


/* =========================
   CLOSE LOGIN
========================= */

const loginClose =
    document.getElementById("loginClose");

if (loginClose) {

    loginClose.addEventListener(
        "click",
        closeLogin
    );
}


if (loginModal) {

    loginModal.addEventListener(
        "click",
        function (event) {

            if (event.target === loginModal) {

                closeLogin();

            }

        }
    );
}


/* =========================
   LOGIN TABS
========================= */

document
    .querySelectorAll(".login-tab")
    .forEach(function (tab) {

        tab.addEventListener(
            "click",
            function () {

                setLoginTab(
                    this.dataset.loginTab
                );

            }
        );

    });


/* =========================
   REGISTER
========================= */

const registerSubmit =
    document.getElementById("registerSubmit");

if (registerSubmit) {

    registerSubmit.addEventListener(
        "click",
        async function () {

            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim()
                    .toLowerCase();

            const phone =
                document
                    .getElementById("registerPhone")
                    .value
                    .trim();

            const password =
                document.getElementById(
                    "registerPassword"
                ).value;

            const password2 =
                document.getElementById(
                    "registerPassword2"
                ).value;


            if (!name) {

                showMessage(
                    "გთხოვთ შეიყვანოთ სახელი და გვარი."
                );

                return;
            }


            if (!email || !email.includes("@")) {

                showMessage(
                    "გთხოვთ შეიყვანოთ სწორი ელფოსტა."
                );

                return;
            }


            if (!phone) {

                showMessage(
                    "გთხოვთ შეიყვანოთ ტელეფონის ნომერი."
                );

                return;
            }


            if (password.length < 6) {

                showMessage(
                    "პაროლი მინიმუმ 6 სიმბოლოს უნდა შეიცავდეს."
                );

                return;
            }


            if (password !== password2) {

                showMessage(
                    "პაროლები ერთმანეთს არ ემთხვევა."
                );

                return;
            }


            const button = this;

            button.disabled = true;

            button.textContent =
                "რეგისტრაცია...";


            try {

                /*
                 * IMPORTANT:
                 * ელფოსტის დადასტურების შემდეგ
                 * მომხმარებელი დაბრუნდება პირდაპირ
                 * Your Home-ის რეალურ მისამართზე.
                 */

                const result =
                    await supabaseClient.auth.signUp({

                        email: email,

                        password: password,

                        options: {

                            emailRedirectTo:
                                SUPABASE_SITE_URL,

                            data: {

                                name: name,

                                phone: phone

                            }

                        }

                    });


                if (result.error) {

                    console.error(
                        "REGISTER ERROR:",
                        result.error
                    );

                    showMessage(
                        result.error.message
                    );

                    return;
                }


                if (result.data.user) {

                    currentUser =
                        result.data.user;

                    updateLoginButton();


                    if (result.data.session) {

                        closeLogin();

                        showMessage(
                            "რეგისტრაცია წარმატებით დასრულდა ❤️"
                        );

                    } else {

                        showMessage(
                            "რეგისტრაცია დასრულდა. გთხოვთ დაადასტუროთ ელფოსტა."
                        );

                    }

                }

            } catch (error) {

                console.error(error);

                showMessage(
                    "რეგისტრაციისას მოხდა შეცდომა."
                );

            } finally {

                button.disabled = false;

                button.textContent =
                    "რეგისტრაცია";

            }

        }
    );

}


/* =========================
   LOGIN
========================= */

const loginSubmit =
    document.getElementById("loginSubmit");

if (loginSubmit) {

    loginSubmit.addEventListener(
        "click",
        async function () {

            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim()
                    .toLowerCase();

            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            if (!email || !password) {

                showMessage(
                    "გთხოვთ შეავსოთ ყველა ველი."
                );

                return;
            }


            const button = this;

            button.disabled = true;

            button.textContent =
                "შესვლა...";


            try {

                const result =
                    await supabaseClient.auth
                        .signInWithPassword({

                            email: email,

                            password: password

                        });


                if (result.error) {

                    showMessage(
                        "ელფოსტა ან პაროლი არასწორია."
                    );

                    return;
                }


                currentUser =
                    result.data.user;

                updateLoginButton();

                closeLogin();


                document.getElementById(
                    "loginEmail"
                ).value = "";

                document.getElementById(
                    "loginPassword"
                ).value = "";


                showMessage(
                    "კეთილი იყოს თქვენი დაბრუნება ❤️"
                );

            } catch (error) {

                console.error(error);

                showMessage(
                    "შესვლისას მოხდა შეცდომა."
                );

            } finally {

                button.disabled = false;

                button.textContent =
                    "ავტორიზაცია";

            }

        }
    );

}


/* =========================
   GOOGLE LOGIN
========================= */

const googleLogin =
    document.getElementById("googleLogin");

if (googleLogin) {

    googleLogin.addEventListener(
        "click",
        async function () {

            try {

                const result =
                    await supabaseClient.auth
                        .signInWithOAuth({

                            provider: "google",

                            options: {

                                redirectTo:
                                    SUPABASE_SITE_URL

                            }

                        });


                if (result.error) {

                    showMessage(
                        result.error.message
                    );

                }

            } catch (error) {

                console.error(error);

                showMessage(
                    "Google ავტორიზაცია ვერ შესრულდა."
                );

            }

        }
    );

}


/* =========================
   PASSWORD RESET
========================= */

const forgotPassword =
    document.getElementById("forgotPassword");

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        async function () {

            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim()
                    .toLowerCase();


            if (!email) {

                showMessage(
                    "ჯერ შეიყვანეთ ელფოსტა."
                );

                return;
            }


            try {

                const result =
                    await supabaseClient.auth
                        .resetPasswordForEmail(
                            email,
                            {
                                redirectTo:
                                    SUPABASE_SITE_URL
                            }
                        );


                if (result.error) {

                    showMessage(
                        result.error.message
                    );

                    return;
                }


                showMessage(
                    "პაროლის აღდგენის ბმული გამოგზავნილია ელფოსტაზე."
                );

            } catch (error) {

                console.error(error);

                showMessage(
                    "პაროლის აღდგენა ვერ შესრულდა."
                );

            }

        }
    );

}


/* =========================
   AUTH STATE
========================= */

supabaseClient.auth.onAuthStateChange(
    function (event, session) {

        currentUser =
            session?.user || null;

        updateLoginButton();

    }
);


/* =========================
   REQUIRE LOGIN
========================= */

function requireLogin() {

    if (!currentUser) {

        openLogin();

        showMessage(
            "გაიარეთ ავტორიზაცია ან დარეგისტრირდით."
        );

        return false;
    }

    return true;
}


/* =========================
   ADD PAGE
========================= */

const addButton =
    document.getElementById("addButton");

if (addButton) {

    addButton.addEventListener(
        "click",
        function () {

            if (requireLogin()) {

                openAddPage();

            }

        }
    );

}


const ctaButton =
    document.getElementById("ctaButton");

if (ctaButton) {

    ctaButton.addEventListener(
        "click",
        function () {

            if (requireLogin()) {

                openAddPage();

            }

        }
    );

}


const backButton =
    document.getElementById("backButton");

if (backButton) {

    backButton.addEventListener(
        "click",
        closeAddPage
    );

}


const cancelButton =
    document.getElementById("cancelButton");

if (cancelButton) {

    cancelButton.addEventListener(
        "click",
        closeAddPage
    );

}


/* =========================
   DEAL TYPE
========================= */

document
    .querySelectorAll("#dealChoices .choice")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(
                        "#dealChoices .choice"
                    )
                    .forEach(function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    });

                this.classList.add(
                    "selected"
                );

            }
        );

    });


/* =========================
   OWNER TYPE
========================= */

document
    .querySelectorAll("#ownerChoices .choice")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(
                        "#ownerChoices .choice"
                    )
                    .forEach(function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    });

                this.classList.add(
                    "selected"
                );

            }
        );

    });


/* =========================
   CONTACT METHODS
========================= */

document
    .querySelectorAll(".contact-choice")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                this.classList.toggle(
                    "selected"
                );

            }
        );

    });


/* =========================
   PHOTOS
========================= */

const photoInput =
    document.getElementById("photoInput");

const photoPreview =
    document.getElementById("photoPreview");


if (photoInput) {

    photoInput.addEventListener(
        "change",
        function () {

            const newFiles =
                Array.from(this.files);


            if (
                selectedFiles.length +
                newFiles.length >
                10
            ) {

                showMessage(
                    "მაქსიმუმ 10 ფოტოს დამატება შეგიძლიათ."
                );

                this.value = "";

                return;
            }


            selectedFiles =
                selectedFiles.concat(
                    newFiles
                );


            renderPhotos();

            this.value = "";

        }
    );

}


function renderPhotos() {

    if (!photoPreview) return;

    photoPreview.innerHTML = "";


    selectedFiles.forEach(
        function (file, index) {

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "preview-item";


                    item.innerHTML =
                        `
                        <img src="${event.target.result}">
                        <span data-index="${index}">×</span>
                        `;


                    photoPreview.appendChild(
                        item
                    );


                    item
                        .querySelector("span")
                        .addEventListener(
                            "click",
                            function () {

                                selectedFiles.splice(
                                    Number(
                                        this.dataset.index
                                    ),
                                    1
                                );

                                renderPhotos();

                            }
                        );

                };


            reader.readAsDataURL(file);

        }
    );

}


/* =========================
   SEARCH TYPE
========================= */

function setSearchType(type) {

    searchType = type;


    document
        .querySelectorAll(".tabs button")
        .forEach(function (button) {

            button.classList.toggle(
                "active",
                button.dataset.type === type
            );

        });


    filterProperties();
}


/* =========================
   SEARCH TABS
========================= */

document
    .querySelectorAll(".tabs button")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                setSearchType(
                    this.dataset.type
                );

            }
        );

    });


/* =========================
   NAVIGATION
========================= */

document
    .querySelectorAll("nav button")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                if (this.dataset.type) {

                    setSearchType(
                        this.dataset.type
                    );


                    const searchBox =
                        document.querySelector(
                            ".search-box"
                        );

                    if (searchBox) {

                        searchBox.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                } else {

                    showMessage(
                        "ეს განყოფილება მალე დაემატება."
                    );

                }

            }
        );

    });


/* =========================
   FILTER BUTTONS
========================= */

document
    .querySelectorAll(".filter")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const active =
                    this.classList.contains(
                        "active"
                    );


                document
                    .querySelectorAll(".filter")
                    .forEach(function (item) {

                        item.classList.remove(
                            "active"
                        );

                    });


                if (!active) {

                    this.classList.add(
                        "active"
                    );

                }


                filterProperties();

            }
        );

    });


/* =========================
   SEARCH
========================= */

const searchButton =
    document.getElementById("searchButton");

if (searchButton) {

    searchButton.addEventListener(
        "click",
        function () {

            filterProperties();


            const cards =
                document.getElementById(
                    "propertyCards"
                );

            if (cards) {

                cards.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


/* =========================
   FILTER PROPERTIES
========================= */

function filterProperties() {

    const locationElement =
        document.getElementById(
            "locationInput"
        );

    const propertyElement =
        document.getElementById(
            "propertyType"
        );

    const roomsElement =
        document.getElementById(
            "rooms"
        );

    const priceElement =
        document.getElementById(
            "priceInput"
        );


    const location =
        locationElement
            ? locationElement.value
                .toLowerCase()
                .trim()
            : "";


    const property =
        propertyElement
            ? propertyElement.value
            : "all";


    const rooms =
        roomsElement
            ? roomsElement.value
            : "all";


    const price =
        priceElement
            ? Number(priceElement.value) || 0
            : 0;


    const activeFilter =
        document.querySelector(
            ".filter.active"
        );


    const filter =
        activeFilter
            ? activeFilter.dataset.filter
            : null;


    let visible = 0;


    document
        .querySelectorAll(
            ".property-card"
        )
        .forEach(function (card) {

            const typeMatch =
                card.dataset.type ===
                searchType;


            const propertyMatch =
                property === "all" ||
                card.dataset.property ===
                property;


            const cardRooms =
                Number(
                    card.dataset.rooms || 0
                );


            const roomMatch =
                rooms === "all" ||
                cardRooms ===
                    Number(rooms) ||
                (
                    rooms === "5" &&
                    cardRooms >= 5
                );


            const locationText =
                (
                    card.dataset.location ||
                    ""
                ).toLowerCase();


            const locationMatch =
                !location ||
                locationText.includes(
                    location
                );


            const cardPrice =
                Number(
                    card.dataset.price || 0
                );


            const priceMatch =
                !price ||
                cardPrice <= price;


            const tags =
                card.dataset.tags || "";


            const filterMatch =
                !filter ||
                card.dataset.property ===
                    filter ||
                tags.includes(filter);


            if (
                typeMatch &&
                propertyMatch &&
                roomMatch &&
                locationMatch &&
                priceMatch &&
                filterMatch
            ) {

                card.classList.remove(
                    "hidden"
                );

                visible++;

            } else {

                card.classList.add(
                    "hidden"
                );

            }

        });


    if (
        visible === 0 &&
        document.querySelector(
            ".property-card"
        )
    ) {

        showMessage(
            "ამ პირობებით განცხადება ვერ მოიძებნა."
        );

    }

}


/* =========================
   SHOW ALL
========================= */

const showAll =
    document.getElementById("showAll");

if (showAll) {

    showAll.addEventListener(
        "click",
        function () {

            const location =
                document.getElementById(
                    "locationInput"
                );

            const property =
                document.getElementById(
                    "propertyType"
                );

            const rooms =
                document.getElementById(
                    "rooms"
                );

            const price =
                document.getElementById(
                    "priceInput"
                );


            if (location) location.value = "";

            if (property) property.value = "all";

            if (rooms) rooms.value = "all";

            if (price) price.value = "";


            document
                .querySelectorAll(".filter")
                .forEach(function (item) {

                    item.classList.remove(
                        "active"
                    );

                });


            filterProperties();

        }
    );

}


/* =========================
   FAVORITES
========================= */

const propertyCards =
    document.getElementById(
        "propertyCards"
    );

if (propertyCards) {

    propertyCards.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".favorite"
                );


            if (!button) return;


            button.classList.toggle(
                "saved"
            );


            if (
                button.classList.contains(
                    "saved"
                )
            ) {

                button.textContent =
                    "♥";

                showMessage(
                    "განცხადება რჩეულებში დაემატა."
                );

            } else {

                button.textContent =
                    "♡";

                showMessage(
                    "განცხადება რჩეულებიდან წაიშალა."
                );

            }

        }
    );

}


/* =========================
   FORMAT PRICE
========================= */

function formatPrice(
    price,
    currency
) {

    const number =
        Number(price || 0)
            .toLocaleString("en-US");


    if (currency === "GEL") {

        return number + " ₾";

    }


    if (currency === "EUR") {

        return "€" + number;

    }


    return "$" + number;
}


/* =========================
   DEAL LABEL
========================= */

function dealLabel(type) {

    if (type === "rent") {

        return "ქირავდება";

    }


    if (type === "pledge") {

        return "გირავდება";

    }


    return "იყიდება";
}


/* =========================
   PROPERTY LABEL
========================= */

function propertyLabel(type) {

    const labels = {

        apartment: "ბინა",

        house: "სახლი",

        commercial: "კომერციული",

        land: "მიწა",

        cottage: "აგარაკი",

        hotel: "სასტუმრო",

        other: "სხვა"

    };


    return labels[type] || type;
}


/* =========================
   LOAD LISTINGS
========================= */

async function loadListings() {

    try {

        const result =
            await supabaseClient
                .from("listings")
                .select("*")
                .eq(
                    "status",
                    "published"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (result.error) {

            console.error(
                result.error
            );

            showMessage(
                "განცხადებების ჩატვირთვა ვერ მოხერხდა."
            );

            return;
        }


        renderListings(
            result.data || []
        );

    } catch (error) {

        console.error(error);

        showMessage(
            "განცხადებების ჩატვირთვა ვერ მოხერხდა."
        );

    }
}


/* =========================
   RENDER LISTINGS
========================= */

function renderListings(listings) {

    const container =
        document.getElementById(
            "propertyCards"
        );


    if (!container) return;


    container.innerHTML = "";


    if (!listings.length) {

        container.innerHTML =
            `
            <div style="
                grid-column:1/-1;
                background:#fff;
                border:1px solid var(--border);
                border-radius:14px;
                padding:40px;
                text-align:center;
                color:var(--muted);
            ">
                ჯერ განცხადებები არ არის.
            </div>
            `;

        return;
    }


    listings.forEach(
        function (listing) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card property-card";


            const firstPhoto =
                listing.photos &&
                listing.photos.length
                    ? listing.photos[0]
                    : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80";


            const roomText =
                listing.rooms
                    ? listing.rooms +
                      " ოთახი"
                    : "";


            const areaText =
                listing.area
                    ? listing.area +
                      " მ²"
                    : "";


            const floorText =
                listing.floor
                    ? listing.floor +
                      (
                        listing.total_floors
                            ? "/" +
                              listing.total_floors
                            : ""
                      ) +
                      " სართული"
                    : "";


            const address =
                [
                    listing.city,
                    listing.district
                ]
                    .filter(Boolean)
                    .join(", ");


            const seller =
                listing.seller_type ===
                "agent"
                    ? "აგენტი"
                    : "მესაკუთრე";


            card.dataset.type =
                listing.deal_type ||
                "sale";


            card.dataset.property =
                listing.property_type ||
                "";


            card.dataset.rooms =
                Number(
                    String(
                        listing.rooms ||
                        "0"
                    ).replace("+", "")
                ) || 0;


            card.dataset.location =
                address;


            card.dataset.price =
                listing.price || 0;


            card.dataset.tags =
                [
                    listing.condition ||
                        "",
                    listing.seller_type ||
                        ""
                ].join(" ");


            card.innerHTML =
                `
                <div class="card-image"
                     style="background-image:url('${escapeHtml(firstPhoto)}')">

                    <div class="badge">
                        ${dealLabel(
                            listing.deal_type
                        )}
                    </div>

                    <button class="favorite">
                        ♡
                    </button>

                </div>

                <div class="card-body">

                    <div class="price">
                        ${formatPrice(
                            listing.price,
                            listing.currency
                        )}
                        ${
                            listing.deal_type ===
                            "rent"
                                ? " / თვე"
                                : ""
                        }
                    </div>

                    <div class="address">
                        ${escapeHtml(
                            address
                        )}
                    </div>

                    <div class="details">

                        ${
                            roomText
                                ? `<span>${escapeHtml(
                                      roomText
                                  )}</span>`
                                : ""
                        }

                        ${
                            listing.bedrooms
                                ? `<span>${escapeHtml(
                                      listing.bedrooms
                                  )} საძინებელი</span>`
                                : ""
                        }

                        ${
                            areaText
                                ? `<span>${escapeHtml(
                                      areaText
                                  )}</span>`
                                : ""
                        }

                        ${
                            floorText
                                ? `<span>${escapeHtml(
                                      floorText
                                  )}</span>`
                                : ""
                        }

                    </div>

                    <div class="owner">
                        ${seller} ·
                        ${propertyLabel(
                            listing.property_type
                        )}
                    </div>

                </div>
                `;


            container.appendChild(
                card
            );

        }
    );


    filterProperties();
}


/* =========================
   ESCAPE HTML
========================= */

function escapeHtml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================
   UPLOAD PHOTOS
========================= */

async function uploadPhotos() {

    if (!selectedFiles.length) {

        return [];

    }


    const urls = [];


    for (
        let i = 0;
        i < selectedFiles.length;
        i++
    ) {

        const file =
            selectedFiles[i];


        const extension =
            file.name
                .split(".")
                .pop()
                .toLowerCase();


        const fileName =
            currentUser.id +
            "/" +
            Date.now() +
            "-" +
            i +
            "." +
            extension;


        const result =
            await supabaseClient
                .storage
                .from(
                    "property-images"
                )
                .upload(
                    fileName,
                    file,
                    {
                        cacheControl:
                            "3600",
                        upsert: false
                    }
                );


        if (result.error) {

            console.error(
                result.error
            );

            throw new Error(
                "ფოტოს ატვირთვა ვერ მოხერხდა."
            );

        }


        const publicResult =
            supabaseClient
                .storage
                .from(
                    "property-images"
                )
                .getPublicUrl(
                    fileName
                );


        urls.push(
            publicResult.data
                .publicUrl
        );

    }


    return urls;
}


/* =========================
   PUBLISH LISTING
========================= */

const publishButton =
    document.getElementById(
        "publishButton"
    );

if (publishButton) {

    publishButton.addEventListener(
        "click",
        async function () {

            if (!requireLogin()) {

                return;
            }


            const button = this;


            const dealButton =
                document.querySelector(
                    "#dealChoices .choice.selected"
                );


            const ownerButton =
                document.querySelector(
                    "#ownerChoices .choice.selected"
                );


            const contactButtons =
                Array.from(
                    document.querySelectorAll(
                        ".contact-choice.selected"
                    )
                );


            const property =
                document.getElementById(
                    "listingProperty"
                ).value;


            const city =
                document.getElementById(
                    "city"
                ).value.trim();


            const price =
                document.getElementById(
                    "listingPrice"
                ).value;


            const phone =
                document.getElementById(
                    "phone"
                ).value.trim();


            if (!property) {

                showMessage(
                    "გთხოვთ აირჩიოთ ქონების ტიპი."
                );

                return;
            }


            if (!city) {

                showMessage(
                    "გთხოვთ მიუთითოთ ქალაქი."
                );

                return;
            }


            if (!price) {

                showMessage(
                    "გთხოვთ მიუთითოთ ფასი."
                );

                return;
            }


            if (!phone) {

                showMessage(
                    "გთხოვთ მიუთითოთ ტელეფონის ნომერი."
                );

                return;
            }


            button.disabled = true;

            button.textContent =
                "იტვირთება...";


            try {

                const photoUrls =
                    await uploadPhotos();


                const listing = {

                    user_id:
                        currentUser.id,

                    deal_type:
                        dealButton
                            ? dealButton.dataset.value
                            : "sale",

                    property_type:
                        property,

                    condition:
                        document.getElementById(
                            "condition"
                        ).value ||
                        null,

                    rooms:
                        document.getElementById(
                            "listingRooms"
                        ).value ||
                        null,

                    bedrooms:
                        document.getElementById(
                            "bedrooms"
                        ).value ||
                        null,

                    floor:
                        Number(
                            document.getElementById(
                                "floor"
                            ).value
                        ) || null,

                    total_floors:
                        Number(
                            document.getElementById(
                                "totalFloors"
                            ).value
                        ) || null,

                    area:
                        Number(
                            document.getElementById(
                                "area"
                            ).value
                        ) || null,

                    balconies:
                        document.getElementById(
                            "balconies"
                        ).value ||
                        null,

                    balcony_area:
                        Number(
                            document.getElementById(
                                "balconyArea"
                            ).value
                        ) || null,

                    city: city,

                    district:
                        document.getElementById(
                            "district"
                        ).value.trim() ||
                        null,

                    address:
                        document.getElementById(
                            "address"
                        ).value.trim() ||
                        null,

                    price:
                        Number(price),

                    currency:
                        document.getElementById(
                            "currency"
                        ).value,

                    seller_type:
                        ownerButton
                            ? ownerButton.dataset.value
                            : "owner",

                    phone: phone,

                    contact_name:
                        document.getElementById(
                            "contactName"
                        ).value.trim() ||
                        null,

                    contact_methods:
                        contactButtons.map(
                            function (button) {

                                return button
                                    .dataset
                                    .value;

                            }
                        ),

                    description:
                        document.getElementById(
                            "description"
                        ).value.trim() ||
                        null,

                    photos:
                        photoUrls,

                    status:
                        "published"

                };


                const result =
                    await supabaseClient
                        .from("listings")
                        .insert(
                            listing
                        )
                        .select()
                        .single();


                if (result.error) {

                    console.error(
                        result.error
                    );

                    throw new Error(
                        result.error.message
                    );

                }


                showMessage(
                    "🎉 განცხადება წარმატებით გამოქვეყნდა!"
                );


                resetListingForm();


                await loadListings();


                setTimeout(
                    function () {

                        closeAddPage();

                    },
                    1200
                );


            } catch (error) {

                console.error(
                    error
                );

                showMessage(
                    "შეცდომა: " +
                    error.message
                );

            } finally {

                button.disabled =
                    false;

                button.textContent =
                    "გამოქვეყნება →";

            }

        }
    );

}


/* =========================
   RESET FORM
========================= */

function resetListingForm() {

    const ids = [

        "listingProperty",
        "condition",
        "listingRooms",
        "bedrooms",
        "floor",
        "totalFloors",
        "area",
        "balconies",
        "balconyArea",
        "city",
        "district",
        "address",
        "listingPrice",
        "phone",
        "contactName",
        "description"

    ];


    ids.forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );

            if (element) {

                element.value = "";

            }

        }
    );


    const currency =
        document.getElementById(
            "currency"
        );

    if (currency) {

        currency.value =
            "USD";

    }


    document
        .querySelectorAll(
            "#dealChoices .choice"
        )
        .forEach(function (button) {

            button.classList.remove(
                "selected"
            );

        });


    const sale =
        document.querySelector(
            '#dealChoices .choice[data-value="sale"]'
        );

    if (sale) {

        sale.classList.add(
            "selected"
        );

    }


    document
        .querySelectorAll(
            "#ownerChoices .choice"
        )
        .forEach(function (button) {

            button.classList.remove(
                "selected"
            );

        });


    const owner =
        document.querySelector(
            '#ownerChoices .choice[data-value="owner"]'
        );

    if (owner) {

        owner.classList.add(
            "selected"
        );

    }


    document
        .querySelectorAll(
            ".contact-choice"
        )
        .forEach(function (button) {

            button.classList.remove(
                "selected"
            );

        });


    const call =
        document.querySelector(
            '.contact-choice[data-value="call"]'
        );

    if (call) {

        call.classList.add(
            "selected"
        );

    }


    selectedFiles = [];


    if (photoPreview) {

        photoPreview.innerHTML =
            "";

    }


    if (photoInput) {

        photoInput.value =
            "";

    }

}


/* =========================
   LANGUAGE
========================= */

const translations = {

    ka: {

        title:
            "იპოვე უძრავი ქონება საქართველოში",

        subtitle:
            "იყიდე, იქირავე ან იგირავე — მოძებნე შენთვის სასურველი ქონება მარტივად.",

        location:
            "მდებარეობა",

        locationPlaceholder:
            "ქალაქი, უბანი ან ქუჩა",

        property:
            "ქონების ტიპი",

        rooms:
            "ოთახები",

        price:
            "ფასი",

        pricePlaceholder:
            "მაგ. 100000",

        search:
            "ძებნა",

        popular:
            "🔥 ყველაზე ნახვადი",

        all:
            "ყველას ნახვა →",

        ctaTitle:
            "გაქვს უძრავი ქონება?",

        ctaText:
            "განათავსე განცხადება Your Home-ზე.",

        add:
            "+ განცხადების დამატება"

    },


    en: {

        title:
            "Find real estate in Georgia",

        subtitle:
            "Buy, rent or pledge — find the property that suits you.",

        location:
            "Location",

        locationPlaceholder:
            "City, district or street",

        property:
            "Property type",

        rooms:
            "Rooms",

        price:
            "Price",

        pricePlaceholder:
            "e.g. 100000",

        search:
            "Search",

        popular:
            "🔥 Most viewed",

        all:
            "View all →",

        ctaTitle:
            "Have a property?",

        ctaText:
            "Post your property on Your Home.",

        add:
            "+ Add listing"

    },


    ru: {

        title:
            "Найдите недвижимость в Грузии",

        subtitle:
            "Купите, арендуйте или заложите — найдите подходящую недвижимость.",

        location:
            "Местоположение",

        locationPlaceholder:
            "Город, район или улица",

        property:
            "Тип недвижимости",

        rooms:
            "Комнаты",

        price:
            "Цена",

        pricePlaceholder:
            "например 100000",

        search:
            "Поиск",

        popular:
            "🔥 Самые просматриваемые",

        all:
            "Посмотреть все →",

        ctaTitle:
            "У вас есть недвижимость?",

        ctaText:
            "Разместите объявление на Your Home.",

        add:
            "+ Добавить объявление"

    }

};


function changeLanguage(lang) {

    const t =
        translations[lang];

    if (!t) return;


    document.documentElement.lang =
        lang;


    const heroTitle =
        document.getElementById(
            "heroTitle"
        );

    if (heroTitle) {

        heroTitle.textContent =
            t.title;

    }


    const heroSubtitle =
        document.getElementById(
            "heroSubtitle"
        );

    if (heroSubtitle) {

        heroSubtitle.textContent =
            t.subtitle;

    }


    const labels =
        document.querySelectorAll(
            ".field label"
        );


    if (labels[0])
        labels[0].textContent =
            t.location;

    if (labels[1])
        labels[1].textContent =
            t.property;

    if (labels[2])
        labels[2].textContent =
            t.rooms;

    if (labels[3])
        labels[3].textContent =
            t.price;


    const locationInput =
        document.getElementById(
            "locationInput"
        );

    if (locationInput) {

        locationInput.placeholder =
            t.locationPlaceholder;

    }


    const priceInput =
        document.getElementById(
            "priceInput"
        );

    if (priceInput) {

        priceInput.placeholder =
            t.pricePlaceholder;

    }


    const search =
        document.getElementById(
            "searchButton"
        );

    if (search) {

        search.textContent =
            t.search;

    }


    const popular =
        document.getElementById(
            "popularTitle"
        );

    if (popular) {

        popular.textContent =
            t.popular;

    }


    const all =
        document.getElementById(
            "showAll"
        );

    if (all) {

        all.textContent =
            t.all;

    }


    const ctaTitle =
        document.querySelector(
            ".cta-box h2"
        );

    if (ctaTitle) {

        ctaTitle.textContent =
            t.ctaTitle;

    }


    const ctaText =
        document.querySelector(
            ".cta-box p"
        );

    if (ctaText) {

        ctaText.textContent =
            t.ctaText;

    }


    const add =
        document.getElementById(
            "addButton"
        );

    if (add && !currentUser) {

        add.textContent =
            t.add;

    }


    const cta =
        document.getElementById(
            "ctaButton"
        );

    if (cta) {

        cta.textContent =
            t.add;

    }

}


const language =
    document.getElementById(
        "language"
    );

if (language) {

    language.addEventListener(
        "change",
        function () {

            changeLanguage(
                this.value
            );

        }
    );

}


/* =========================
   START
========================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await loadCurrentUser();

        await loadListings();

    }
);
