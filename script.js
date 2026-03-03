function domReady(fn) {
    if (document.readyState === "complete" ||
        document.readyState === "interactive") {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

domReady(function () {

    const products = {
        "P1001": {
            name: "T-Shirt",
            price: 199,
            description: "Vit bomulls T-shirt"
        },
        "P1002": {
            name: "Skor",
            price: 799,
            description: "Svarta sneakers"
        },
        "P1003": {
            name: "Keps",
            price: 149,
            description: "Blå keps"
        }
    };

    function onScanSuccess(decodeText, decodeResult) {
        console.log("Scanned QR:", decodeText); // alltid kolla i console

        const product = products[decodeText];

        if (product) {
            document.getElementById("product-result").innerHTML = `
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <strong>${product.price} kr</strong>
            `;
        } else {
            document.getElementById("product-result").innerHTML = `
                <p>Produkten hittades inte.</p>
            `;
        }

        // Om du vill ha alert (valfritt)
        // alert("You QR is: " + decodeText);
    }

    let htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",
        { fps: 10, qrbox: 250 }
    );

    htmlscanner.render(onScanSuccess);
});