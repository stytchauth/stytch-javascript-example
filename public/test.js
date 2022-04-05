export async function login() {

    const resp = await window.solana.connect();
    let address = resp.publicKey.toString()
    console.log(address)

    await fetch("http://localhost:9000/crypto_wallets/authenticate/start", {
        method: "POST",
        mode: 'cors',
        body: JSON.stringify({address: address}),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }).then((data) => {
        console.log(data)
        return data.challenge;
    }).then((challenge) => {
        const encodedMessage = new TextEncoder().encode(challenge);

        return window.solana.request({
            method: "signMessage",
            params: {
                message: encodedMessage,
                display: "utf8",
            },
        });
    }).then((resp) => {
        console.log(resp)
        let signature = resp.signature
        console.log(signature)

        fetch("http://localhost:9000/crypto_wallets/authenticate", {
            method: "POST",
            mode: 'cors',
            body: JSON.stringify({address: address, signature: signature}),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }).then((data) => {
            console.log(data)
        })
    });
}