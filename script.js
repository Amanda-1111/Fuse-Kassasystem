function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {

    const resultContainer = document.getElementById("qr-reader-results");

    let lastResult = null;

    // ===== MATERIAL DATABAS =====
    const materials = {
        "123456789": {
            name: "Trä",
            type: "Byggmaterial",
            location: "Lager A"
        },
        "987654321": {
            name: "Stål",
            type: "Metall",
            location: "Lager B"
        },
        "555666777": {
            name: "Plast",
            type: "Polymer",
            location: "Lager C"
        }
    };

    // ===== QR SCANNER =====
    const html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        {
            fps: 10,
            qrbox: 250
        }
    );

    function onScanSuccess(decodedText, decodedResult) {

        if (decodedText === lastResult) {
            return;
        }

        lastResult = decodedText;

        console.log("Scan result:", decodedText);

        // Kontrollera om material finns
        if (materials[decodedText]) {

            const material = materials[decodedText];

            resultContainer.innerHTML = `
                <h3>Material hittat</h3>
                <p><b>Barcode:</b> ${decodedText}</p>
                <p><b>Namn:</b> ${material.name}</p>
                <p><b>Typ:</b> ${material.type}</p>
                <p><b>Plats:</b> ${material.location}</p>
                <br>
                <button onclick="startScanner()">Scanna igen</button>
            `;

        } else {

            resultContainer.innerHTML = `
                <h3>Okänd kod</h3>
                <p>${decodedText}</p>
                <button onclick="startScanner()">Scanna igen</button>
            `;
        }

    }

    function onScanError(errorMessage) {
        // Ignorerar fel
    }

    html5QrcodeScanner.render(onScanSuccess, onScanError);

    // Starta scanner igen
    window.startScanner = function () {
        resultContainer.innerHTML = "";
        lastResult = null;

        html5QrcodeScanner.render(onScanSuccess, onScanError);
    };

});