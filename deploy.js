const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8")
    // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    //     encryptedJson,
    //     process.env.PRIVATE_KEY_PASSWORD
    // )
    // wallet = await wallet.connect(provider)

    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf-8"
    )
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf-8"
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Starting to deploy a contract :)")
    const contract = await contractFactory.deploy()

    console.log(`contract address : ${contract.address}`)

    const transactionReceipt = await contract.deployTransaction.wait(1)

    // nonce = await wallet.getTransactionCount();

    // const tx = {
    //   nonce,
    //   gasPrice: 2000000000,
    //   gasLimit: 1000000,
    //   to: null,
    //   value: 0,
    //   data: "0x" + binary,
    //   chainId: 1337,
    // };

    // const sentTxResponse = await wallet.sendTransaction(tx);
    // await sentTxResponse.wait(1);
    // console.log(sentTxResponse);

    console.log(
        `current favourite number : ${(await contract.retrieve()).toString()}`
    )

    const transactionResponse = await contract.store("13")
    console.log(
        `Updated favourite number : ${(await contract.retrieve()).toString()}`
    )
    // return transactionReceipt;
}

main()
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log(err)
    })
