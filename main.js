let btn_submit = document.getElementById("btn-submit");
let cards = document.getElementById("cards");
let card = document.getElementById("card");
let card_passangers = document.getElementById("card_passangers");
let btn_buyt1 = document.getElementById("1");
let btn_buyt2 = document.getElementById("2");
let btn_buyt3 = document.getElementById("3");
let index_from
let index_where
let index_date
let index_passanger
let totalPrice = 0;
const totalPriceEl = document.getElementById("total_price");


addEventListener("DOMContentLoaded", async () => {
    if (cards) {
        await getFilteredTrains();
    }


})

function values(){
    let from = document.getElementById("from");
    let where = document.getElementById("where");
    let date = document.getElementById("date").value;
    let passangers = document.getElementById("passangers").value;
    from = from.options[from.selectedIndex].text;
    where = where.options[where.selectedIndex].text;
    index_date = date
    index_from = from
    index_passanger = passangers
    index_where = where
    return {from , where , date , passangers};
}

async function getFilteredTrains() {
    const params = new URLSearchParams(window.location.search);

    const result = {
        from: params.get("from"),
        where: params.get("where"),
        date: params.get("date"),
        passangers: params.get("passangers")
    };

    try {
        let response = await fetch("https://railway.stepprojects.ge/api/trains");
        console.log(result.date);
        if (!response.ok) {
            throw new Error("Get Request Failed");
        }

        let data = await response.json();

        cards.innerHTML = "";

        
        let number = 1
        for (let places of data) {
        if (places.from == result.from && places.to == result.where && number < 4) {
            cards.innerHTML += `
                <div class="card">
                    <div class="no_dash">
                        <h6 class="number">${places.number}</h6>
                        <h6 class="name">${places.name} Express</h6>
                    </div>
                    <div>
                        <h6 class="from_time">${places.departure}</h6>
                        <h6 class="from_place">${places.from}</h6>
                    </div>
                    <div>
                        <h6 class="where_time">${places.arrive}</h6>
                        <h6 class="where_place">${places.to}</h6>
                    </div>
                    <div>
                        <br><button class="btn_buy" onclick="goCheckout('${places.id}')"><span>დაჯავშნა</span></button>
                    </div>
                </div>
            `;

            number = number + 1
        }
    }
    } catch (error) {
        console.error(error);
    }
}

if (btn_submit) {
    btn_submit.addEventListener('click', function() {
        let v = values();
        if (v.from == v.where) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "გთხოვთ აირჩიოთ 2 განსხვავებული რეალური ქალაქი",
                draggable: true,
            });
            return;
        }

        if (v.from == "საიდან" || v.where == "სად") {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "გთხოვთ აირჩიოთ 2 განსხვავებული რეალური ქალაქი",
                draggable: true,
            });
            return;
        }

        if (v.date == "") {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "გთხოვთ აირჩიოთ თარიღი",
                draggable: true,
            });
            return;
        }

        if (v.passangers < 1) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "გთხოვთ აირჩიოთ მგზავრების რაოდენობა",
                draggable: true,
            });
            return;
        }

        const query = new URLSearchParams(v).toString();
        window.location.href = `purchase.html?${query}`;
    });
}

function goCheckout(trainId) {
    const params = new URLSearchParams(window.location.search);
    const passangers = params.get("passangers");

    window.location.href = `checkout.html?id=${trainId}&passangers=${passangers}`;
}

addEventListener("DOMContentLoaded", async () => {

    if (!card) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const passangers = parseInt(params.get("passangers"));

    if (!id) {
        card.innerHTML = "<h2>No train selected</h2>";
        return;
    }

    try {
        const response = await fetch(`https://railway.stepprojects.ge/api/trains/${id}`);

        if (!response.ok) {
            throw new Error("Train not found");
        }

        const train = await response.json();

        card.innerHTML = `
        <div class="card">
            <div class="no_dash">
                <h6 class="number">${train.number}</h6>
                <h6 class="name">${train.name} Express</h6>
            </div>
            <div>
                <h6 class="from_time">${train.departure}</h6>
                <h6 class="from_place">${train.from}</h6>
            </div>
            <div>
                <h6 class="where_time">${train.arrive}</h6>
                <h6 class="where_place">${train.to}</h6>
            </div>
        </div>
        `;

        for (let i = 1; i <= passangers; i++) {
            card_passangers.innerHTML += `
            <h1>მგზავრი ${i}</h1><br><br>
            <div class="card_passanger">
                <span class="background">ადგილი: 0</span>
                <input type="text" required placeholder="სახელი">
                <input type="text" required placeholder="გვარი">
                <input type="text" required placeholder="პირადი ნომერი">
                <div><br><button type="button" class="select_class_btn"><span>დაჯავშნა</span></button></div>
            </div><br><br><br>
            `;
        }
        
        const classButtons = document.querySelectorAll(".select_class_btn");

        classButtons.forEach((btn, index) => {
            btn.addEventListener("click", () => {
                Swal.fire({
                    title: 'აირჩიეთ კლასი',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'I კლასი',
                    denyButtonText: 'II კლასი',
                    cancelButtonText: 'ბიზნეს კლასი',
                }).then((result) => {
                    let selectedClass = "";
                    if(result.isConfirmed) selectedClass = "I";
                    else if(result.isDenied) selectedClass = "II";
                    else if(result.isDismissed) selectedClass = "ბიზნეს";

                    if(selectedClass) {
                        btn.previousElementSibling.textContent = `კლასი: ${selectedClass}`;
                        showSeatModal(selectedClass, index);
                    }
                });
            });
        });

    } catch (error) {
        card.innerHTML = "<h2>Something went wrong</h2>";
    }
});

let occupiedSeatsByClass = {
    "I": [],
    "II": [],
    "ბიზნეს": []
};

const classPrices = {
    "I": 35,
    "II": 75,
    "ბიზნეს": 125
};

function showSeatModal(selectedClass, passengerIndex) {
    const rows = ["A", "B", "C", "D"];
    const cols = 10;
    let seatHtml = "";

    rows.forEach(row => {
        seatHtml += `<div style="display:flex; justify-content:center; margin-bottom:5px;">`;
        for (let i = 1; i <= cols; i++) {
            const seatCode = `${row}${i}`;
            const isOccupied = occupiedSeatsByClass[selectedClass].includes(seatCode);
            seatHtml += `<button class="seat-btn" 
                                style="
                                    background-color:${isOccupied ? '#e74c3c' : '#3498db'};
                                    color:white; border:none; border-radius:5px; 
                                    width:40px; height:40px; margin:2px; cursor:${isOccupied ? 'not-allowed' : 'pointer'};
                                "
                                ${isOccupied ? "disabled" : ""}
                                >${seatCode}</button>`;
        }
        seatHtml += `</div>`;
    });

    Swal.fire({
        title: `აირჩიეთ ადგილი - ${selectedClass} (${classPrices[selectedClass]}₾)`,
        html: `<div>${seatHtml}</div>
               <br><img src="./imgs/train-inside-image.png" style="width:100%; max-width:300px;">`,
        showConfirmButton: false,
        didOpen: () => {
            const seatButtons = Swal.getHtmlContainer().querySelectorAll(".seat-btn");
            seatButtons.forEach(button => {
                if (!button.disabled) {
                    button.addEventListener("click", () => {
                        const passengerCards = document.querySelectorAll(".card_passanger .background");
                        if(passengerCards[passengerIndex]) {

                            const oldPriceMatch = passengerCards[passengerIndex].textContent.match(/\d+₾$/);
                            if(oldPriceMatch) totalPrice -= parseInt(oldPriceMatch[0]);

                            passengerCards[passengerIndex].textContent = 
                                `ადგილი: ${button.textContent} (${selectedClass}) - ${classPrices[selectedClass]}₾`;

                            totalPrice += classPrices[selectedClass];
                            const totalPriceEl = document.getElementById("total_price");
                            if(totalPriceEl) totalPriceEl.textContent = `${totalPrice}₾`;
                        }
                        occupiedSeatsByClass[selectedClass].push(button.textContent);
                        Swal.close();
                    });
                }
            });
        }
    });
}

