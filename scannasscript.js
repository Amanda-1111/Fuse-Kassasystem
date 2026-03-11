docReady(function () {

    const html5QrCode = new Html5Qrcode("qr-reader");
    const scannedCodes = new Set();
    let currentCameraId = null;

    // Fyll dropdown med tillgängliga kameror
    Html5Qrcode.getCameras().then(devices => {
        const cameraSelect = document.getElementById("camera-select");

        devices.forEach((camera, index) => {
            const option = document.createElement("option");
            option.value = camera.id;
            option.text = camera.label || "Camera " + (index + 1);
            cameraSelect.appendChild(option);
        });

        if (devices.length) {
            currentCameraId = devices[0].id;
            cameraSelect.value = currentCameraId;
        }
    });

    // Starta scanner när användaren trycker på knappen
    document.getElementById("start-scanner").addEventListener("click", () => {
        const cameraSelect = document.getElementById("camera-select");
        currentCameraId = cameraSelect.value;

        html5QrCode.start(
            currentCameraId,
            { fps: 10, qrbox: "auto" },
            decodedText => {
                if (!scannedCodes.has(decodedText)) {
                    scannedCodes.add(decodedText);
                    onScanSuccess(decodedText);
                }
            },
            errorMessage => { /* ignorera fel */ }
        );
    });

    // ==== Resten av din varukorg och onScanSuccess ====
    let cart = {};

    function onScanSuccess(decodedText) {
        if (cart[decodedText]) {
            cart[decodedText].quantity += 1;
        } else {
            const materials = {
                "123456789": { name: "Trä", type: "Byggmaterial", location: "Lager A" },
                "987654321": { name: "Stål", type: "Metall", location: "Lager B" },
                "555666777": { name: "Plast", type: "Polymer", location: "Lager C" }
            };
            const material = materials[decodedText] || { name: decodedText, type: "", location: "" };

            cart[decodedText] = {
                code: decodedText,
                name: material.name,
                type: material.type,
                location: material.location,
                quantity: 1
            };
        }

        updateCart();
    }

    function updateCart() {
        const cartDiv = document.getElementById("cart");
        let html = "<h3>Varukorg</h3>";
        Object.values(cart).forEach(item => {
            html += `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <select onchange="changeQuantity('${item.code}', this.value)">
                        ${createOptions(item.quantity)}
                    </select>
                </div>
            `;
        });
        function createOptions(selected) {
            let options = "";
            for (let i = 1; i <= 20; i++) {
                options += `<option value="${i}" ${i == selected ? "selected" : ""}>${i}</option>`;
            }
            return options;
        }
        window.changeQuantity = function(code, quantity) {
            cart[code].quantity = parseInt(quantity);
            updateCart();
        };
        cartDiv.innerHTML = html;
    }

});