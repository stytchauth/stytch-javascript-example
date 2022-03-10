export async function login() {
    await window.ethereum.request({
        method: 'eth_requestAccounts',
    });
    let provider = new ethers.providers.Web3Provider(window.ethereum)
    let [address] = await provider.listAccounts()

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
        return data.challenge;
    }).then((challenge) => {
        let signature = provider.getSigner().signMessage(challenge);
        console.log(signature)
        return signature
    }).then((signature) => {
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
            console.log(data.status_code)
        })
    });
}