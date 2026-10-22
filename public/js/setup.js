const addPartyButton = document.getElementById("addParty");

const partiesContainer = document.getElementById("partiesContainer");

let partyCount = 1;

addPartyButton.addEventListener("click", () => {
    partyCount++;

    const partyDiv = document.createElement("div");

    partyDiv.classList.add("party");

    partyDiv.innerHTML = `
        <hr>

        <h3>Party ${partyCount}</h3>

        <label>Party Name</label>
        <input
            type="text"
            name="partyName[]"
            placeholder="Enter party name"
        >

        <br><br>

        
        <label>Party Symbol</label>
        <input
            type="file"
            name="partySymbol[]"
            accept="image/*"
        >

        <br><br>
    `;

    partiesContainer.appendChild(partyDiv);
});
const addCandidateButton = document.getElementById("addCandidate");

const candidatesContainer = document.getElementById("candidatesContainer");

let candidateCount = 1;

addCandidateButton.addEventListener("click", () => {

    candidateCount++;

    const candidateDiv = document.createElement("div");

    candidateDiv.classList.add("candidate");

    candidateDiv.innerHTML = `
        <hr>

        <h3>Candidate ${candidateCount}</h3>

        <label>Candidate Name</label>
        <input
            type="text"
            name="candidateName[]"
            placeholder="Enter candidate name"
        >

        <br><br>

        <label>Candidate Photo</label>
        <input
            type="file"
            name="candidateImage[]"
            accept="image/*"
        >

        <br><br>

        <label>Party</label>
        <select name="candidateParty[]">

            <option value="">Select Party</option>
            <option value="INDEPENDENT">Independent</option>

        </select>

        <br><br>

        <label>Position</label>
        <input
            type="text"
            name="candidatePosition[]"
            placeholder="Enter position"
        >

        <br><br>

        <label>Constituency</label>
        <input
            type="text"
            name="candidateConstituency[]"
            placeholder="Enter constituency"
        >

        <br><br>
    `;

    candidatesContainer.appendChild(candidateDiv);
    updateCandidatePartyOptions();
});
function updateCandidatePartyOptions() {

    const partyInputs = document.querySelectorAll(
        'input[name="partyName[]"]'
    );

    const candidateSelects = document.querySelectorAll(
        'select[name="candidateParty[]"]'
    );

    const parties = [];

    partyInputs.forEach(input => {
        if (input.value.trim() !== "") {
            parties.push(input.value.trim());
        }
    });

    candidateSelects.forEach(select => {

        const currentValue = select.value;

        select.innerHTML = `
            <option value="">Select Party</option>
            <option value="INDEPENDENT">Independent</option>
        `;

        parties.forEach(party => {

            const option = document.createElement("option");

            option.value = party;
            option.textContent = party;

            select.appendChild(option);
        });

        if (
            currentValue === "INDEPENDENT" ||
            parties.includes(currentValue)
        ) {
            select.value = currentValue;
        }
    });
}
document.addEventListener("input", (event) => {

    if (event.target.name === "partyName[]") {
        updateCandidatePartyOptions();
    }

});
const form = document.querySelector("form");

const startButton = document.querySelector(
    'button[type="submit"]'
);

const reviewSection = document.createElement("section");

reviewSection.id = "reviewSection";

reviewSection.style.display = "none";

form.appendChild(reviewSection);


startButton.type = "button";
startButton.textContent = "REVIEW ELECTION";
startButton.addEventListener("click", () => {

    // Check all required form fields
    if (!form.checkValidity()) {

        form.reportValidity();

        return;
    }

    const electionName =
        document.querySelector("#name").value;

    const category =
        document.querySelector("#category").value;

    const startTime =
        document.querySelector("#startTime").value;

    const endTime =
        document.querySelector("#endTime").value;

    let html = `
        <hr>

        <h2>Review Election</h2>

        <h3>Election Details</h3>

        <p>
            <strong>Election Name:</strong>
            ${electionName}
        </p>

        <p>
            <strong>Election Type:</strong>
            ${category}
        </p>

        <p>
            <strong>Start:</strong>
            ${startTime}
        </p>

        <p>
            <strong>End:</strong>
            ${endTime}
        </p>

        <h3>Parties</h3>
    `;


    // =========================
    // PARTIES
    // =========================

    const partyNames =
        document.querySelectorAll(
            'input[name="partyName[]"]'
        );

    
    const partySymbols =
        document.querySelectorAll(
            'input[name="partySymbol[]"]'
        );


    partyNames.forEach((input, index) => {

        if (input.value.trim() !== "") {

            html += `
               
                <div class="review-party">

                    <h4>Party ${index + 1}</h4>

                    <p>
                        <strong>Name:</strong>
                        ${input.value}
                    </p>
            `;

            // Party symbol
            if (partySymbols[index].files.length > 0) {

                const symbolURL =
                    URL.createObjectURL(
                        partySymbols[index].files[0]
                    );

                html += `
                    <p><strong>Symbol:</strong></p>

                    <img
                        src="${symbolURL}"
                        width="100"
                        height="100"
                        style="object-fit: contain;"
                    >
                `;
            }


            html += `
                </div>

                <hr>
            `;
        }

    });


    // =========================
    // CANDIDATES
    // =========================

    html += `<h3>Candidates</h3>`;


    const candidateNames =
        document.querySelectorAll(
            'input[name="candidateName[]"]'
        );

    const candidateImages =
        document.querySelectorAll(
            'input[name="candidateImage[]"]'
        );

    const candidateParties =
        document.querySelectorAll(
            'select[name="candidateParty[]"]'
        );

    const candidatePositions =
        document.querySelectorAll(
            'input[name="candidatePosition[]"]'
        );

    const candidateConstituencies =
        document.querySelectorAll(
            'input[name="candidateConstituency[]"]'
        );


    candidateNames.forEach((input, index) => {

        if (input.value.trim() !== "") {

            html += `
                <div class="review-candidate">

                    <h4>
                        Candidate ${index + 1}
                    </h4>
            `;


            // Candidate photo
            if (candidateImages[index].files.length > 0) {

                const imageURL =
                    URL.createObjectURL(
                        candidateImages[index].files[0]
                    );

                html += `
                    <img
                        src="${imageURL}"
                        width="150"
                        height="150"
                        style="
                            object-fit: cover;
                            border-radius: 10px;
                        "
                    >
                `;
            }


            html += `
                    <p>
                        <strong>Name:</strong>
                        ${input.value}
                    </p>

                    <p>
                        <strong>Party:</strong>
                        ${candidateParties[index].value ||
                        "Not selected"}
                    </p>

                    <p>
                        <strong>Position:</strong>
                        ${candidatePositions[index].value}
                    </p>

                    <p>
                        <strong>Constituency:</strong>
                        ${candidateConstituencies[index].value}
                    </p>

                </div>

                <hr>
            `;
           
        }

    });


    html += `
                <button type="button" id="editElection">
                    EDIT
                </button>

                <button type="button" id="confirmStart">
                    START ELECTION
                </button>
    `;
    reviewSection.innerHTML = html;
    form.append(...reviewSection.querySelectorAll("button"));
    reviewSection.style.display = "flex";
    startButton.style.display = "none";
    // EDIT
    document
        .getElementById("editElection")
        .addEventListener("click", () => {

            reviewSection.style.display = "none";
            document.querySelectorAll("#editElection, #confirmStart").forEach(button => button.remove());

            startButton.style.display = "inline-block";

        });


    // START ELECTION
    document
        .getElementById("confirmStart")
        .addEventListener("click", () => {

            form.submit();

        });

});
