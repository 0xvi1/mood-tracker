<script lang="ts">
    import { ethers } from "ethers";
    import GreeterABI from "../../artifacts/contracts/Greeter.sol/Greeter.json";

    // window.ethereum.enable();

    let greeeting = "";

    const smartContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

     // request access to the user's MetaMask account
    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    // get smart contract
    function getContract() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const smartContract = new ethers.Contract(smartContractAddress, GreeterABI.abi, signer);

        return smartContract;
    }

    async function getGreeting() {
        // await requestAccount();
        const sc = getContract();
        const greeting = await sc.greet();
        greeeting = greeting;
    }

    async function setGreeting() {
        await requestAccount();

        const sc = getContract();
        let txn = await sc.setGreeting("five");
        await txn.wait();

        getGreeting();
    }

</script>

<h1>The greeting is: {greeeting}</h1>

<button on:click={getGreeting}>show greeeting</button>
<button on:click={setGreeting}>set greeeting</button>



