/* =========================================
   YOUR HOME — SUPABASE AUTH
========================================= */

const SUPABASE_URL =
    "https://clymnqkiarrpatcfuwwt.supabase.co";

const SUPABASE_KEY =
    "sb_publishable__CQ1qg7_KizhMzPKDaD3tA_TQq6AzsM";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================
   MESSAGE
========================================= */

function showMessage(text) {

    const message =
        document.getElementById("message");

    if (!message) {
        alert(text);
        return;
    }

    message.textContent = text;

    message.classList.add("show");

    setTimeout(function () {
        message.classList.remove("show");
    }, 3000);
}


/* =========================================
   LOGIN MODAL
========================================= */

const loginModal =
    document.getElementById("loginModal");

const loginButton =
    document.getElementById("loginButton");

const loginClose =
    document.getElementById("loginClose");


function openLogin() {

    if (loginModal) {
        loginModal.classList.add("active");
    }

}


function closeLogin() {

    if (loginModal) {
        loginModal.classList.remove("active");
    }

}


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


/* =========================================
   LOGIN / REGISTER TABS
========================================= */

document
    .querySelectorAll(".login-tab")
    .forEach(function (tab) {

        tab.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(".login-tab")
                    .forEach(function (item) {
                        item.classList.remove("active");
                    });

                document
                    .querySelectorAll(".login-form")
                    .forEach(function (form) {
                        form.classList.remove("active");
                    });

                this.classList.add("active");

                const type =
                    this.dataset.loginTab;

                if (type === "login") {

                    document
                        .getElementById("loginForm")
                        .classList.add("active");

                } else {

                    document
                        .getElementById("registerForm")
                        .classList.add("active");

                }

            }
        );

    });


/* =========================================
   CURRENT USER
========================================= */

async function loadCurrentUser() {

    const {
        data,
        error
    } = await supabaseClient.auth.getUser();

    if (error || !data.user) {

        updateLoginButton(null);

        return;

    }

    updateLoginButton(data.user);

}


/* =========================================
   UPDATE LOGIN BUTTON
========================================= */

function updateLoginButton(user) {

    if (!loginButton) {
        return;
    }

    if (user) {

        const name =
            user.user_metadata?.full_name ||
            user.email ||
            "ჩემი ანგარიში";

        loginButton.textContent = name;

        loginButton.style.color =
            "var(--olive-dark)";

    } else {

        loginButton.textContent =
            "შესვლა";

        loginButton.style.color = "";

    }

}


/* =========================================
   LOGIN BUTTON
========================================= */

if (loginButton) {

    loginButton.addEventListener(
        "click",
        async function () {

            const {
                data
            } = await supabaseClient.auth.getUser();

            if (data.user) {

                const answer =
                    confirm(
                        "თქვენ შესული ხართ ანგარიშში.\n\nგსურთ ანგარიშიდან გამოსვლა?"
                    );

                if (answer) {

                    await supabaseClient.auth.signOut();

                    updateLoginButton(null);

                    showMessage(
                        "ანგარიშიდან გამოხვედით."
                    );

                }

                return;

            }

            openLogin();

        }
    );

}


/* =========================================
   REGISTRATION
========================================= */

/*
   ძველ localStorage რეგისტრაციას ვაჩერებთ,
   რათა მხოლოდ Supabase იმუშაოს.
*/

document.addEventListener(
    "click",
    async function (event) {

        const button =
            event.target.closest("#fakeRegister");

        if (!button) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();


        const inputs =
            document.querySelectorAll(
                "#registerForm input"
            );


        const name =
            inputs[0]?.value.trim();

        const email =
            inputs[1]?.value.trim().toLowerCase();

        const phone =
            inputs[2]?.value.trim();

        const password =
            inputs[3]?.value;

        const repeatPassword =
            inputs[4]?.value;


        if (!name) {

            showMessage(
                "გთხოვთ შეიყვანოთ სახელი და გვარი."
            );

            return;

        }


        if (!email) {

            showMessage(
                "გთხოვთ შეიყვანოთ ელფოსტა."
            );

            return;

        }


        if (!email.includes("@")) {

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


        if (!password || password.length < 6) {

            showMessage(
                "პაროლი მინიმუმ 6 სიმბოლოს უნდა შეიცავდეს."
            );

            return;

        }


        if (password !== repeatPassword) {

            showMessage(
                "პაროლები ერთმანეთს არ ემთხვევა."
            );

            return;

        }


        button.disabled = true;

        button.textContent =
            "რეგისტრაცია...";


        try {

            /*
             * Supabase Authentication
             */

            const {
                data,
                error
            } =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        data: {

                            full_name: name,

                            phone: phone

                        }

                    }

                });


            if (error) {

                throw error;

            }


            /*
             * თუ მომხმარებელი შეიქმნა,
             * ვქმნით profiles ჩანაწერს.
             */

            if (data.user) {

                const {
                    error: profileError
                } =
                    await supabaseClient
                        .from("profiles")
                        .insert({

                            id: data.user.id,

                            full_name: name,

                            email: email,

                            phone: phone

                        });


                if (profileError) {

                    console.error(
                        "PROFILE ERROR:",
                        profileError
                    );

                    /*
                     * მომხმარებელი მაინც შეიქმნა
                     * Authentication-ში.
                     */

                    showMessage(
                        "ანგარიში შეიქმნა, მაგრამ პროფილის შენახვისას პრობლემა მოხდა."
                    );

                } else {

                    /*
                     * Email confirmation თუ გამორთულია,
                     * მომხმარებელი პირდაპირ შევა.
                     */

                    if (data.session) {

                        updateLoginButton(
                            data.user
                        );

                        closeLogin();

                        showMessage(
                            "რეგისტრაცია წარმატებით დასრულდა ❤️"
                        );

                    } else {

                        showMessage(
                            "რეგისტრაცია წარმატებით დასრულდა. შეამოწმეთ ელფოსტა დასადასტურებლად."
                        );

                    }

                }

            }

        } catch (error) {

            console.error(
                "REGISTRATION ERROR:",
                error
            );


            let message =
                "რეგისტრაცია ვერ მოხერხდა.";


            if (
                error.message &&
                error.message.includes(
                    "already registered"
                )
            ) {

                message =
                    "ეს ელფოსტა უკვე რეგისტრირებულია.";

            } else if (error.message) {

                message =
                    error.message;

            }


            showMessage(message);

        }


        button.disabled = false;

        button.textContent =
            "რეგისტრაცია";

    },
    true
);


/* =========================================
   LOGIN
========================================= */

document.addEventListener(
    "click",
    async function (event) {

        const button =
            event.target.closest("#fakeLogin");

        if (!button) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();


        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim()
                .toLowerCase();


        const password =
            document
                .getElementById("loginPassword")
                .value;


        if (!email || !password) {

            showMessage(
                "გთხოვთ შეავსოთ ყველა ველი."
            );

            return;

        }


        button.disabled = true;

        button.textContent =
            "შესვლა...";


        try {

            const {
                data,
                error
            } =
                await supabaseClient.auth.signInWithPassword({

                    email: email,

                    password: password

                });


            if (error) {

                throw error;

            }


            updateLoginButton(
                data.user
            );

            closeLogin();


            document
                .getElementById("loginEmail")
                .value = "";

            document
                .getElementById("loginPassword")
                .value = "";


            showMessage(
                "კეთილი იყოს თქვენი დაბრუნება ❤️"
            );


        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            showMessage(
                "ელფოსტა ან პაროლი არასწორია."
            );

        }


        button.disabled = false;

        button.textContent =
            "შესვლა";

    },
    true
);


/* =========================================
   PASSWORD RESET
========================================= */

const forgotPassword =
    document.getElementById(
        "forgotPassword"
    );


if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        async function () {

            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();


            if (!email) {

                showMessage(
                    "ჯერ შეიყვანეთ თქვენი ელფოსტა."
                );

                return;

            }


            const {
                error
            } =
                await supabaseClient.auth
                    .resetPasswordForEmail(
                        email
                    );


            if (error) {

                showMessage(
                    "პაროლის აღდგენა ვერ მოხერხდა."
                );

                return;

            }


            showMessage(
                "პაროლის აღდგენის ბმული გამოგზავნილია ელფოსტაზე."
            );

        }
    );

}


/* =========================================
   AUTH STATE
========================================= */

supabaseClient.auth.onAuthStateChange(
    function (event, session) {

        if (session?.user) {

            updateLoginButton(
                session.user
            );

        } else {

            updateLoginButton(null);

        }

    }
);


/* =========================================
   START
========================================= */

loadCurrentUser();

console.log(
    "YOUR HOME: Supabase authentication is ready."
);
